import { sql } from '../config/db';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: 'user' | 'admin';
  admin_code?: string;
  savedListings: string[];
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

type UserInput = Pick<IUser, 'name' | 'email'> & Partial<Pick<IUser, 'password' | 'image'>>;

const mapUser = (row: Record<string, unknown>): IUser => ({
  _id: String(row.id), name: String(row.name), email: String(row.email),
  password: row.password as string | undefined, image: row.image as string | undefined,
  role: row.role as IUser['role'], admin_code: row.admin_code as string | undefined, savedListings: [], googleId: row.google_id as string | undefined,
  createdAt: new Date(String(row.created_at)), updatedAt: new Date(String(row.updated_at)),
});

const User = {
  async findOne(email: string): Promise<IUser | null> {
    const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
    return rows[0] ? mapUser(rows[0]) : null;
  },
  async findById(id: string): Promise<IUser | null> {
    const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
    return rows[0] ? mapUser(rows[0]) : null;
  },
  async create(input: UserInput): Promise<IUser> {
    const rows = await sql`INSERT INTO users (name, email, password, image)
      VALUES (${input.name}, ${input.email}, ${input.password ?? null}, ${input.image ?? null}) RETURNING *`;
    return mapUser(rows[0]);
  },
  async createAdmin(input: UserInput & { adminCode?: string }): Promise<IUser> {
    const rows = await sql`INSERT INTO users (name, email, password, image, role, admin_code)
      VALUES (${input.name}, ${input.email}, ${input.password ?? null}, ${input.image ?? null}, 'admin', ${input.adminCode ?? null}) RETURNING *`;
    return mapUser(rows[0]);
  },
  async findAll(): Promise<IUser[]> {
    const rows = await sql`SELECT * FROM users ORDER BY created_at DESC`;
    return rows.map(mapUser);
  },
  async updateRole(id: string, role: IUser['role']): Promise<IUser | null> {
    const rows = await sql`UPDATE users SET role = ${role}, updated_at = NOW() WHERE id = ${id} RETURNING *`;
    return rows[0] ? mapUser(rows[0]) : null;
  },
  async updateProfile(id: string, updates: { name?: string; image?: string }): Promise<IUser | null> {
    const rows = await sql`UPDATE users SET 
      name = COALESCE(${updates.name ?? null}, name), 
      image = COALESCE(${updates.image ?? null}, image), 
      updated_at = NOW() 
      WHERE id = ${id} RETURNING *`;
    return rows[0] ? mapUser(rows[0]) : null;
  },
  async updatePassword(id: string, hashedPassword: string): Promise<IUser | null> {
    const rows = await sql`UPDATE users SET password = ${hashedPassword}, updated_at = NOW() WHERE id = ${id} RETURNING *`;
    return rows[0] ? mapUser(rows[0]) : null;
  },
  async findByAdminCode(code: string): Promise<IUser | null> {
    const rows = await sql`SELECT * FROM users WHERE admin_code = ${code} AND role = 'admin' LIMIT 1`;
    return rows[0] ? mapUser(rows[0]) : null;
  },
  async delete(id: string): Promise<boolean> {
    const rows = await sql`DELETE FROM users WHERE id = ${id} RETURNING id`;
    return Boolean(rows[0]);
  },
};

export default User;
