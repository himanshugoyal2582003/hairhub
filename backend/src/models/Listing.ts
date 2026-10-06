import { sql } from '../config/db';

export interface IListing {
  _id: string;
  userId: string;
  sellerName: string;
  whatsapp: string;
  state: string;
  city: string;
  hairLength: number;
  hairWeight: number;
  hairType: 'Straight' | 'Wavy' | 'Curly' | 'Coily';
  virginHair: boolean;
  description: string;
  imageUrls: string[];
  cloudinaryPublicIds: string[];
  views: number;
  status: 'active' | 'sold' | 'pending' | 'rejected';
  approved: boolean;
  reportedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const mapListing = (row: Record<string, unknown>): IListing => ({
  _id: String(row.id), userId: String(row.user_id), sellerName: String(row.seller_name),
  whatsapp: String(row.whatsapp), state: String(row.state), city: String(row.city),
  hairLength: Number(row.hair_length), hairWeight: Number(row.hair_weight),
  hairType: row.hair_type as IListing['hairType'], virginHair: Boolean(row.virgin_hair),
  description: String(row.description), imageUrls: (row.image_urls as string[]) ?? [],
  cloudinaryPublicIds: (row.cloudinary_public_ids as string[]) ?? [], views: Number(row.views),
  status: row.status as IListing['status'], approved: Boolean(row.approved),
  reportedCount: Number(row.reported_count), createdAt: new Date(String(row.created_at)),
  updatedAt: new Date(String(row.updated_at)),
});

export const listingColumns = `id, user_id, seller_name, whatsapp, state, city, hair_length, hair_weight,
  hair_type, virgin_hair, description, image_urls, cloudinary_public_ids, views, status, approved,
  reported_count, created_at, updated_at`;

export { mapListing };
export default { mapListing, listingColumns };
