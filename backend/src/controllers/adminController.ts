import { Request, Response } from 'express';
import { sql } from '../config/db';
import { listingColumns, mapListing } from '../models/Listing';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const select = `SELECT ${listingColumns} FROM listings`;

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const rows = await sql`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'pending')::int AS pending, COUNT(*) FILTER (WHERE status = 'active')::int AS active, COUNT(*) FILTER (WHERE status = 'sold')::int AS sold, COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected, COALESCE(SUM(views), 0)::int AS total_views FROM listings`;
    const users = await sql`SELECT COUNT(*)::int AS total_users FROM users`;
    res.json({ ...rows[0], totalUsers: users[0].total_users, totalViews: rows[0].total_views });
  } catch { res.status(500).json({ error: 'Internal server error' }); }
};

export const getAllListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = '1', limit = '20' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page)); const limitNum = Math.min(100, Math.max(1, parseInt(limit))); const params: unknown[] = [];
    const where = status ? 'WHERE l.status = $1' : ''; if (status) params.push(status);
    const rows = await sql.query(`${select.replace('FROM listings', 'FROM listings l')} ${where} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`, [...params, limitNum, (pageNum - 1) * limitNum]);
    const count = await sql.query(`SELECT COUNT(*)::int AS total FROM listings l ${where}`, params);
    res.json({ listings: rows.map(mapListing), total: Number(count[0].total), page: pageNum, totalPages: Math.ceil(Number(count[0].total) / limitNum) });
  } catch { res.status(500).json({ error: 'Internal server error' }); }
};

export const moderateListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { action } = req.body;
    if (action === 'delete') { await sql.query('DELETE FROM listings WHERE id = $1', [req.params.id]); res.json({ message: 'Listing deleted' }); return; }
    if (!['approve', 'reject'].includes(action)) { res.status(400).json({ error: 'Invalid action' }); return; }
    const rows = await sql.query(`UPDATE listings SET approved = $1, status = $2, updated_at = NOW() WHERE id = $3 RETURNING ${listingColumns}`, [action === 'approve', action === 'approve' ? 'active' : 'rejected', req.params.id]);
    if (!rows[0]) { res.status(404).json({ error: 'Not found' }); return; }
    res.json({ listing: mapListing(rows[0]) });
  } catch { res.status(500).json({ error: 'Internal server error' }); }
};

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try { const users = await User.findAll(); res.json({ users: users.map(({ password: _password, ...user }) => user) }); } catch { res.status(500).json({ error: 'Internal server error' }); }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.body; if (!['user', 'admin'].includes(role)) { res.status(400).json({ error: 'Invalid role' }); return; }
    const user = await User.updateRole(req.params.id, role); if (!user) { res.status(404).json({ error: 'Not found' }); return; }
    const { password: _password, ...safeUser } = user; res.json({ user: safeUser });
  } catch { res.status(500).json({ error: 'Internal server error' }); }
};

export const removeListingImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;
    if (!imageUrl) {
      res.status(400).json({ error: 'Image URL is required' });
      return;
    }
    const rows = await sql.query(
      `UPDATE listings SET image_urls = array_remove(image_urls, $1), updated_at = NOW() WHERE id = $2 RETURNING ${listingColumns}`,
      [imageUrl, id]
    );
    if (!rows[0]) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }
    res.json({ listing: mapListing(rows[0]) });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (req.user && req.user.id === id) {
      res.status(400).json({ error: 'You cannot delete your own admin account' });
      return;
    }
    const deleted = await User.delete(id);
    if (!deleted) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'User and all associated listings removed successfully' });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

