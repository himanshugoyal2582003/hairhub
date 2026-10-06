export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Listing {
  id: string;
  userId: string;
  sellerName: string;
  whatsapp: string;
  state: string;
  city: string;
  hairLength: number; // in inches
  hairWeight: number; // in grams
  hairType: 'Straight' | 'Wavy' | 'Curly' | 'Coily';
  virginHair: boolean;
  description: string;
  imageUrls: string[];
  cloudinaryPublicIds: string[];
  views: number;
  status: 'active' | 'sold' | 'rejected' | 'pending';
  approved: boolean;
  createdAt: string;
  reportedCount?: number;
  reports?: ListingReport[];
}

export interface ListingReport {
  id: string;
  userId: string;
  reason: string;
  createdAt: string;
}

export interface SearchFilters {
  search: string;
  state: string;
  city: string;
  hairLength: string; // e.g. "all", "short" (<12), "medium" (12-20), "long" (>20)
  hairType: string; // e.g. "all", "Straight", "Wavy", etc.
  virginHair: string; // e.g. "all", "yes", "no"
  sortBy: 'newest' | 'views' | 'length-asc' | 'length-desc';
}

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'
];

export const HAIR_TYPES = ['Straight', 'Wavy', 'Curly', 'Coily'] as const;
