export type HairType = 'Straight' | 'Wavy' | 'Curly' | 'Coily';
export type ListingStatus = 'active' | 'sold' | 'rejected' | 'pending';
export type UserRole = 'user' | 'admin';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: UserRole;
  savedListings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IListing {
  _id: string;
  userId: string;
  sellerName: string;
  whatsapp: string;
  state: string;
  city: string;
  hairLength: number;
  hairWeight: number;
  hairType: HairType;
  virginHair: boolean;
  description: string;
  imageUrls: string[];
  cloudinaryPublicIds: string[];
  views: number;
  status: ListingStatus;
  approved: boolean;
  reportedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  search: string;
  state: string;
  city: string;
  minLength: string;
  maxLength: string;
  hairType: string;
  virginHair: string;
  sortBy: 'newest' | 'views' | 'length-asc' | 'length-desc';
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
] as const;

export const HAIR_TYPES: HairType[] = ['Straight', 'Wavy', 'Curly', 'Coily'];

export const HAIR_LENGTH_RANGES = [
  { label: 'All Lengths', value: 'all' },
  { label: 'Short (< 12 inches)', value: 'short' },
  { label: 'Medium (12–20 inches)', value: 'medium' },
  { label: 'Long (> 20 inches)', value: 'long' },
];
