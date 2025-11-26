
import { Restaurant, Review, Order, UserProfile, CartItem } from '../types';
import { generateMockRestaurants } from './mockDataGenerator';

const DB_KEY = 'breakthrough_restaurants_db_v5';
const ORDERS_KEY = 'breakthrough_orders_db';
const USER_KEY = 'breakthrough_user_db';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getDB = (): Restaurant[] => {
  try {
    const stored = localStorage.getItem(DB_KEY);
    if (!stored) {
      const data = generateMockRestaurants(160);
      localStorage.setItem(DB_KEY, JSON.stringify(data));
      return data;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error("Database Error:", e);
    return [];
  }
};

const saveDB = (data: Restaurant[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// --- User & Orders DB Helpers ---
const getOrdersDB = (): Order[] => {
  const stored = localStorage.getItem(ORDERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveOrdersDB = (orders: Order[]) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

const getUserDB = (): UserProfile => {
  const stored = localStorage.getItem(USER_KEY);
  if (stored) return JSON.parse(stored);
  
  const defaultUser: UserProfile = {
    name: 'Sarthak Kadu',
    email: 'sarthak@breakthrough.com',
    phone: '+1 (555) 019-2834',
    addresses: ['123 Innovation Dr, Tech Park, NY', '456 Startup Avenue, Silicon Valley, CA']
  };
  localStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
  return defaultUser;
};

export const api = {
  getRestaurants: async (page: number = 1, limit: number = 12): Promise<{ data: Restaurant[], total: number }> => {
    await delay(600); 
    const all = getDB();
    const start = (page - 1) * limit;
    const paginated = all.slice(start, start + limit);
    return { data: paginated, total: all.length };
  },

  addReview: async (restaurantId: string, review: Omit<Review, 'id' | 'date'>): Promise<Restaurant> => {
    await delay(1000);
    const db = getDB();
    const restaurantIndex = db.findIndex(r => r.id === restaurantId);
    if (restaurantIndex === -1) throw new Error("Restaurant not found");

    const newReview: Review = {
      id: `r-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: 'Just now',
      ...review
    };

    const restaurant = db[restaurantIndex];
    restaurant.reviews.unshift(newReview);
    const totalRating = restaurant.reviews.reduce((acc, r) => acc + r.rating, 0);
    restaurant.rating = Number((totalRating / restaurant.reviews.length).toFixed(1));

    db[restaurantIndex] = restaurant;
    saveDB(db);
    return restaurant;
  },

  // --- New User/Order Endpoints ---

  getUserProfile: async (): Promise<UserProfile> => {
    await delay(300);
    return getUserDB();
  },

  getOrders: async (): Promise<Order[]> => {
    await delay(500);
    return getOrdersDB().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  placeOrder: async (restaurantId: string, items: CartItem[], totalAmount: number, address: string): Promise<Order> => {
    await delay(1500);
    const restaurants = getDB();
    const restaurant = restaurants.find(r => r.id === restaurantId);
    
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      restaurantId,
      restaurantName: restaurant?.name || 'Unknown Restaurant',
      items,
      totalAmount,
      status: 'Processing',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      address
    };

    const orders = getOrdersDB();
    orders.push(newOrder);
    saveOrdersDB(orders);
    return newOrder;
  }
};
