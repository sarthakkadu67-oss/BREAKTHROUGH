
import { Restaurant, MenuItem, Review } from '../types';

const PREFIXES = ['The', 'Golden', 'Royal', 'Spicy', 'Urban', 'Taste of', 'Little', 'Grand', 'Fusion', 'Red', 'Crispy', 'Velvet'];
const NAMES = ['Spoon', 'Bowl', 'Grill', 'Oven', 'Plate', 'Kitchen', 'Bistro', 'Palace', 'Hub', 'Diner', 'House', 'Corner', 'Crust', 'Wok'];
// Added explicit 'Pizza' and 'Burger' to ensure search hits
const CUISINES = ['North Indian', 'Chinese', 'Italian', 'Mexican', 'Japanese', 'Fast Food', 'Desserts', 'South Indian', 'Thai', 'Burgers', 'Pizza', 'Sandwich'];
const LOCATIONS = ['Downtown', 'Westside', 'Uptown', 'Midtown', 'Tech Park', 'River View', 'Chinatown', 'Market Square', 'Harbor', 'Old City'];

// Map keywords to specific images to ensure variety
const getFoodImage = (keyword: string): string => {
  const k = keyword.toLowerCase();
  if (k.includes('pizza')) return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80';
  if (k.includes('burger')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80';
  if (k.includes('salad')) return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80';
  if (k.includes('pasta')) return 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&q=80';
  if (k.includes('sushi')) return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80';
  if (k.includes('cake') || k.includes('dessert')) return 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=80';
  if (k.includes('biryani') || k.includes('rice')) return 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80';
  if (k.includes('sandwich')) return 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80';
  if (k.includes('chicken')) return 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&q=80';
  if (k.includes('combo') || k.includes('feast')) return 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80'; // Platter
  
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80'; // Generic food
};

const MENU_ITEMS_DB = [
  { name: 'Maharaja Combo', desc: 'Biryani, Chicken Tikka, 2 Rotis, Gulab Jamun', price: 15, cat: 'Combos', veg: false },
  { name: 'Veg Delight Box', desc: 'Paneer Butter Masala, Dal, Rice, Salad', price: 12, cat: 'Combos', veg: true },
  { name: 'Pizza Party Combo', desc: '2 Large Pizzas, Garlic Bread, Coke', price: 25, cat: 'Combos', veg: true },
  { name: 'Burger Buddy Meal', desc: '2 Crispy Chicken Burgers, Large Fries, 2 Drinks', price: 18, cat: 'Combos', veg: false },
  { name: 'Butter Chicken', desc: 'Rich creamy tomato gravy with tender chicken', price: 14, cat: 'Main Course', veg: false },
  { name: 'Paneer Tikka', desc: 'Marinated cottage cheese grilled to perfection', price: 10, cat: 'Starters', veg: true },
  { name: 'Pepperoni Pizza', desc: 'Classic New York style pepperoni', price: 18, cat: 'Main Course', veg: false },
  { name: 'Margherita Pizza', desc: 'Fresh basil, mozzarella, tomato sauce', price: 14, cat: 'Main Course', veg: true },
  { name: 'Truffle Pasta', desc: 'Creamy pasta with truffle oil and mushrooms', price: 16, cat: 'Main Course', veg: true },
  { name: 'Spicy Ramen', desc: 'Japanese noodle soup with spicy broth', price: 13, cat: 'Main Course', veg: false },
  { name: 'Chicken Wings', desc: '6pcs spicy buffalo wings with dip', price: 9, cat: 'Starters', veg: false },
  { name: 'Caesar Salad', desc: 'Fresh lettuce, croutons, parmesan', price: 8, cat: 'Starters', veg: true },
  { name: 'Chocolate Lava Cake', desc: 'Warm cake with gooey chocolate center', price: 7, cat: 'Desserts', veg: true },
  { name: 'Club Sandwich', desc: 'Triple layer toasted sandwich with fries', price: 11, cat: 'Starters', veg: false },
];

const generateReviews = (count: number): Review[] => {
  return Array.from({ length: count }).map(() => ({
    id: `rev-${Math.random()}`,
    userName: `User ${Math.floor(Math.random() * 1000)}`,
    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars mostly
    text: ['Amazing food!', 'Great service.', 'Loved the ambiance.', 'Will order again.', 'Tasty but spicy.'][Math.floor(Math.random() * 5)],
    date: `${Math.floor(Math.random() * 10)} days ago`
  }));
};

const generateMenu = (): MenuItem[] => {
  const items: MenuItem[] = [];

  // Guaranteed Combos: Add 1 or 2 combo items to every restaurant to ensure the tab appears
  const comboTemplates = MENU_ITEMS_DB.filter(i => i.cat === 'Combos');
  const combosToAdd = Math.floor(Math.random() * 2) + 1; // 1 or 2
  for(let i=0; i<combosToAdd; i++) {
     const template = comboTemplates[Math.floor(Math.random() * comboTemplates.length)];
     items.push({
      id: `menu-combo-${Math.random()}`,
      name: template.name,
      description: template.desc,
      price: template.price,
      imageUrl: getFoodImage(template.name), // Smart image mapping
      isVeg: template.veg,
      isBestseller: true,
      category: 'Combos'
    });
  }

  // Random Items
  const count = Math.floor(Math.random() * 6) + 5;
  
  for (let i = 0; i < count; i++) {
    const template = MENU_ITEMS_DB[Math.floor(Math.random() * MENU_ITEMS_DB.length)];
    if(template.cat === 'Combos') continue; // Skip combos here as we added them above

    items.push({
      id: `menu-${Math.random()}`,
      name: template.name,
      description: template.desc,
      price: template.price + Math.floor(Math.random() * 5),
      imageUrl: getFoodImage(template.name), // Smart image mapping
      isVeg: template.veg,
      isBestseller: Math.random() > 0.8,
      category: template.cat
    });
  }
  return items;
};

export const generateMockRestaurants = (count: number = 100): Restaurant[] => {
  return Array.from({ length: count }).map((_, i) => {
    const name = `${PREFIXES[Math.floor(Math.random() * PREFIXES.length)]} ${NAMES[Math.floor(Math.random() * NAMES.length)]}`;
    const cuisineCount = Math.floor(Math.random() * 3) + 1;
    // Weighted randomness to ensure we have enough "Pizza" and "Burger" places for search
    const randomCuisine = () => CUISINES[Math.floor(Math.random() * CUISINES.length)];
    
    const cuisines = Array.from({ length: cuisineCount }).map(randomCuisine);
    
    // Ensure uniqueness
    const uniqueCuisines = [...new Set(cuisines)];
    
    const isVeg = Math.random() > 0.7; // 30% pure veg
    
    // Pick an image based on the first cuisine to ensure relevance
    const mainCuisine = uniqueCuisines[0] || 'Food';
    const restImage = getFoodImage(mainCuisine);

    return {
      id: `rest-${i + 1}`,
      name: name,
      cuisine: uniqueCuisines,
      rating: parseFloat((Math.random() * (5.0 - 3.5) + 3.5).toFixed(1)),
      deliveryTime: `${Math.floor(Math.random() * 30) + 20}-${Math.floor(Math.random() * 20) + 40} min`,
      priceForTwo: Math.floor(Math.random() * 50) + 15,
      imageUrl: restImage,
      discount: Math.random() > 0.6 ? `${Math.floor(Math.random() * 50) + 10}% OFF` : undefined,
      isPromoted: Math.random() > 0.9,
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      isVeg: isVeg,
      healthScore: Math.floor(Math.random() * (100 - 60) + 60),
      reviews: generateReviews(3),
      menu: generateMenu()
    };
  });
};
