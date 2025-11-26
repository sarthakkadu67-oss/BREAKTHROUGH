
export interface Review {
  id: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
  isBestseller?: boolean;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  deliveryTime: string;
  priceForTwo: number;
  imageUrl: string;
  discount?: string;
  isPromoted?: boolean;
  location: string;
  isVeg: boolean;
  healthScore: number;
  reviews: Review[];
  menu: MenuItem[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Processing' | 'Delivered' | 'Cancelled' | 'On the way';
  date: string;
  address: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  addresses: string[];
}

export type SortOption = 'relevance' | 'rating' | 'fastestDelivery' | 'costLowHigh';

export interface FilterState {
  rating4Plus: boolean;
  pureVeg: boolean;
  fastDelivery: boolean;
}

export interface AIRecommendationResponse {
  restaurantIds: string[];
  message: string;
}
