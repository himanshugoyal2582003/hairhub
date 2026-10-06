import { Request, Response } from 'express';
import { sql } from '../config/db';
import { IListing, listingColumns, mapListing } from '../models/Listing';
import { AuthRequest } from '../middleware/auth';
import { deleteImage } from '../config/cloudinary';

const select = `SELECT ${listingColumns} FROM listings`;
const getOne = async (id: string): Promise<IListing | null> => {
  const rows = await sql.query(`${select} WHERE id = $1`, [id]);
  return rows[0] ? mapListing(rows[0]) : null;
};

export const getListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '12', search = '', state = '', city = '', hairType = '', virginHair = '', minLength = '', maxLength = '', sortBy = 'newest' } = req.query as Record<string, string>;
    const conditions = ['approved = TRUE', "status = 'active'"]; const params: unknown[] = [];
    const add = (condition: string, value: unknown) => { params.push(value); conditions.push(condition.replace('?', `$${params.length}`)); };
    if (search) { const token = `%${search}%`; params.push(token, token, token, token); const n = params.length - 3; conditions.push(`(description ILIKE $${n} OR seller_name ILIKE $${n + 1} OR city ILIKE $${n + 2} OR state ILIKE $${n + 3})`); }
    if (state) add('state = ?', state); if (city) add('city ILIKE ?', `%${city}%`); if (hairType) add('hair_type = ?', hairType);
    if (virginHair === 'yes') conditions.push('virgin_hair = TRUE'); if (virginHair === 'no') conditions.push('virgin_hair = FALSE');
    if (minLength) add('hair_length >= ?', Number(minLength)); if (maxLength) add('hair_length <= ?', Number(maxLength));
    const pageNum = Math.max(1, parseInt(page)); const limitNum = Math.min(50, Math.max(1, parseInt(limit))); const offset = (pageNum - 1) * limitNum;
    const order = ({ newest: 'created_at DESC', views: 'views DESC', 'length-asc': 'hair_length ASC', 'length-desc': 'hair_length DESC' } as Record<string, string>)[sortBy] ?? 'created_at DESC';
    const where = conditions.join(' AND '); const rows = await sql.query(`${select} WHERE ${where} ORDER BY ${order} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`, [...params, limitNum, offset]);
    const countRows = await sql.query(`SELECT COUNT(*)::int AS total FROM listings WHERE ${where}`, params);
    const total = Number(countRows[0].total);
    res.json({ listings: rows.map(mapListing), total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) { console.error('getListings error:', err); res.status(500).json({ error: 'Internal server error' }); }
};

export const getListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await sql.query(`${select} WHERE id = $1`, [req.params.id]);
    if (!rows[0]) { res.status(404).json({ error: 'Listing not found' }); return; }
    const updated = await sql.query(`UPDATE listings SET views = views + 1 WHERE id = $1 RETURNING ${listingColumns}`, [req.params.id]);
    res.json({ listing: mapListing(updated[0]) });
  } catch (err) { console.error('getListing error:', err); res.status(500).json({ error: 'Internal server error' }); }
};

export const createListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sellerName, whatsapp, state, city, hairLength, hairWeight, hairType, virginHair, description, imageUrls = [], cloudinaryPublicIds = [] } = req.body;
    const rows = await sql.query(`INSERT INTO listings (user_id, seller_name, whatsapp, state, city, hair_length, hair_weight, hair_type, virgin_hair, description, image_urls, cloudinary_public_ids, approved, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,TRUE,'active') RETURNING ${listingColumns}`, [req.user!.id, sellerName, whatsapp, state, city, parseFloat(hairLength), parseFloat(hairWeight), hairType, Boolean(virginHair), description, imageUrls, cloudinaryPublicIds]);
    res.status(201).json({ listing: mapListing(rows[0]) });
  } catch (err) { console.error('createListing error:', err); res.status(500).json({ error: 'Internal server error' }); }
};

export const updateListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listing = await getOne(req.params.id); if (!listing) { res.status(404).json({ error: 'Listing not found' }); return; }
    const isOwner = listing.userId === req.user!.id; if (!isOwner && req.user!.role !== 'admin') { res.status(403).json({ error: 'Forbidden' }); return; }
    const fields: Record<string, string> = { sellerName: 'seller_name', whatsapp: 'whatsapp', state: 'state', city: 'city', hairLength: 'hair_length', hairWeight: 'hair_weight', hairType: 'hair_type', virginHair: 'virgin_hair', description: 'description', imageUrls: 'image_urls', cloudinaryPublicIds: 'cloudinary_public_ids', status: 'status' };
    const set: string[] = []; const values: unknown[] = [];
    for (const [key, column] of Object.entries(fields)) if (req.body[key] !== undefined) { values.push(req.body[key]); set.push(`${column} = $${values.length}`); }
    // Owner edits no longer require re-approval
    if (!set.length) { res.json({ listing }); return; }
    values.push(req.params.id); await sql.query(`UPDATE listings SET ${set.join(', ')}, updated_at = NOW() WHERE id = $${values.length}`, values);
    res.json({ listing: await getOne(req.params.id) });
  } catch (err) { console.error('updateListing error:', err); res.status(500).json({ error: 'Internal server error' }); }
};

export const deleteListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try { const listing = await getOne(req.params.id); if (!listing) { res.status(404).json({ error: 'Listing not found' }); return; } if (listing.userId !== req.user!.id && req.user!.role !== 'admin') { res.status(403).json({ error: 'Forbidden' }); return; } for (const id of listing.cloudinaryPublicIds) await deleteImage(id).catch(() => {}); await sql.query('DELETE FROM listings WHERE id = $1', [req.params.id]); res.json({ message: 'Listing deleted successfully' }); }
  catch { res.status(500).json({ error: 'Internal server error' }); }
};

export const getUserListings = async (req: AuthRequest, res: Response): Promise<void> => { try { const rows = await sql.query(`${select} WHERE user_id = $1 ORDER BY created_at DESC`, [req.user!.id]); res.json({ listings: rows.map(mapListing) }); } catch { res.status(500).json({ error: 'Internal server error' }); } };
export const updateStatus = async (req: AuthRequest, res: Response): Promise<void> => { try { const { status } = req.body; if (!['active', 'sold'].includes(status)) { res.status(400).json({ error: 'Invalid status' }); return; } const listing = await getOne(req.params.id); if (!listing) { res.status(404).json({ error: 'Not found' }); return; } if (listing.userId !== req.user!.id && req.user!.role !== 'admin') { res.status(403).json({ error: 'Forbidden' }); return; } await sql.query('UPDATE listings SET status = $1, updated_at = NOW() WHERE id = $2', [status, req.params.id]); res.json({ listing: await getOne(req.params.id) }); } catch { res.status(500).json({ error: 'Internal server error' }); } };

export const getPublicStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const statsRows = await sql`SELECT 
      COUNT(*)::int AS active_listings, 
      COUNT(DISTINCT user_id)::int AS active_sellers,
      COUNT(DISTINCT state)::int AS states_count,
      COALESCE(SUM(views), 0)::int AS total_views 
      FROM listings WHERE status = 'active' AND approved = TRUE`;
    
    const userRows = await sql`SELECT COUNT(*)::int AS total_users FROM users`;
    
    const activeListings = Number(statsRows[0]?.active_listings || 0);
    const activeSellers = Math.max(Number(statsRows[0]?.active_sellers || 0), Number(userRows[0]?.total_users || 0));
    const statesCount = Number(statsRows[0]?.states_count || 0);
    const totalViews = Number(statsRows[0]?.total_views || 0);

    res.json({
      activeListings,
      activeSellers,
      statesCount,
      totalViews,
    });
  } catch (err) {
    console.error('getPublicStats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
