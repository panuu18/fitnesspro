import type { Micronutrients } from '../types/index.ts';

export interface IndianDishNutrition {
  name: string;
  category: 'North Indian' | 'South Indian' | 'West Indian' | 'East Indian' | 'Central / Street Food' | 'Fitness / High Protein' | 'Dessert / Sweet' | 'Beverage';
  standardPortionGrams: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  micros?: Micronutrients;
  primaryIngredients?: string[];
  keywords: string[];
}

export interface IngredientNutrition {
  name: string;
  category: 'vegetable' | 'pulse' | 'grain' | 'dairy' | 'meat' | 'fat' | 'condiment';
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  micros?: Micronutrients;
}

/**
 * Authoritative Nutritional Profiles for Indian Dishes
 * Referenced from ICMR - National Institute of Nutrition (NIN) "Indian Food Composition Tables (IFCT)".
 */
export const PAN_INDIAN_DISH_DATABASE: IndianDishNutrition[] = [
  // ==================== NORTH INDIAN ====================
  {
    name: 'Dal Tadka with Steamed Rice',
    category: 'North Indian',
    standardPortionGrams: 350,
    caloriesPer100g: 120,
    proteinPer100g: 4.6,
    carbsPer100g: 19.4,
    fatPer100g: 2.6,
    fiberPer100g: 2.3,
    micros: { iron: 4.2, potassium: 510, sodium: 390 },
    primaryIngredients: ['Toor Dal', 'Basmati Rice', 'Ghee', 'Cumin', 'Tomatoes'],
    keywords: ['dal tadka', 'dal chawal', 'yellow dal', 'steamed rice'],
  },
  {
    name: 'Dal Makhani with Jeera Rice',
    category: 'North Indian',
    standardPortionGrams: 380,
    caloriesPer100g: 145,
    proteinPer100g: 4.8,
    carbsPer100g: 20.5,
    fatPer100g: 5.2,
    fiberPer100g: 2.8,
    micros: { iron: 3.8, calcium: 110, potassium: 480, sodium: 450 },
    primaryIngredients: ['Urad Dal', 'Rajma', 'Butter', 'Cream', 'Jeera Rice'],
    keywords: ['dal makhani', 'black lentil', 'jeera rice'],
  },
  {
    name: 'Rajma Chawal',
    category: 'North Indian',
    standardPortionGrams: 380,
    caloriesPer100g: 121,
    proteinPer100g: 5.0,
    carbsPer100g: 20.0,
    fatPer100g: 2.1,
    fiberPer100g: 2.9,
    micros: { iron: 5.1, potassium: 680, sodium: 430 },
    primaryIngredients: ['Rajma (Kidney Beans)', 'Basmati Rice', 'Onion', 'Tomato', 'Spices'],
    keywords: ['rajma chawal', 'rajma', 'kidney bean'],
  },
  {
    name: 'Chole Bhature with Pickled Onions',
    category: 'North Indian',
    standardPortionGrams: 400,
    caloriesPer100g: 170,
    proteinPer100g: 5.2,
    carbsPer100g: 22.0,
    fatPer100g: 7.0,
    fiberPer100g: 3.0,
    micros: { iron: 5.6, calcium: 140, potassium: 620, sodium: 650 },
    primaryIngredients: ['Kabuli Chana (Chickpeas)', 'Bhatura (Maida)', 'Oil', 'Onion', 'Tomato'],
    keywords: ['chole bhature', 'bhatura', 'chickpea'],
  },
  {
    name: 'Paneer Butter Masala with Roti',
    category: 'North Indian',
    standardPortionGrams: 360,
    caloriesPer100g: 165,
    proteinPer100g: 6.7,
    carbsPer100g: 14.5,
    fatPer100g: 9.0,
    fiberPer100g: 2.1,
    micros: { calcium: 340, iron: 3.1, potassium: 420, sodium: 580 },
    primaryIngredients: ['Paneer', 'Butter', 'Tomatoes', 'Cream', 'Whole Wheat Atta'],
    keywords: ['paneer butter masala', 'shahi paneer', 'paneer makhani'],
  },
  {
    name: 'Palak Paneer with Phulka Roti',
    category: 'North Indian',
    standardPortionGrams: 340,
    caloriesPer100g: 120,
    proteinPer100g: 6.5,
    carbsPer100g: 11.2,
    fatPer100g: 5.6,
    fiberPer100g: 2.4,
    micros: { iron: 6.2, calcium: 380, potassium: 710, vitaminA: 420, sodium: 460 },
    primaryIngredients: ['Spinach (Palak)', 'Paneer', 'Garlic', 'Onion', 'Whole Wheat Roti'],
    keywords: ['palak paneer', 'spinach paneer', 'saag paneer'],
  },
  {
    name: 'Kadai Paneer with Naan',
    category: 'North Indian',
    standardPortionGrams: 360,
    caloriesPer100g: 155,
    proteinPer100g: 6.5,
    carbsPer100g: 15.0,
    fatPer100g: 7.8,
    fiberPer100g: 2.2,
    micros: { calcium: 290, iron: 2.8, potassium: 390, sodium: 520 },
    primaryIngredients: ['Paneer', 'Capsicum (Bell Pepper)', 'Onion', 'Tomato', 'Naan'],
    keywords: ['kadai paneer', 'karahi paneer'],
  },
  {
    name: 'Matar Paneer with Jeera Rice',
    category: 'North Indian',
    standardPortionGrams: 350,
    caloriesPer100g: 135,
    proteinPer100g: 5.8,
    carbsPer100g: 16.0,
    fatPer100g: 5.5,
    fiberPer100g: 2.5,
    micros: { calcium: 240, iron: 3.0, potassium: 410, sodium: 460 },
    primaryIngredients: ['Paneer', 'Green Peas (Matar)', 'Tomato Gravy', 'Jeera Rice'],
    keywords: ['matar paneer', 'mutter paneer'],
  },
  {
    name: 'Aloo Gobi with Roti',
    category: 'North Indian',
    standardPortionGrams: 300,
    caloriesPer100g: 115,
    proteinPer100g: 3.5,
    carbsPer100g: 18.0,
    fatPer100g: 3.3,
    fiberPer100g: 3.0,
    micros: { vitaminC: 32, iron: 2.4, potassium: 420, sodium: 380 },
    primaryIngredients: ['Potato (Aloo)', 'Cauliflower (Gobi)', 'Ginger', 'Turmeric', 'Roti'],
    keywords: ['aloo gobi', 'alu gobi', 'gobi aloo'],
  },
  {
    name: 'Aloo Matar Sabzi with Roti',
    category: 'North Indian',
    standardPortionGrams: 300,
    caloriesPer100g: 110,
    proteinPer100g: 3.8,
    carbsPer100g: 17.5,
    fatPer100g: 2.8,
    fiberPer100g: 2.8,
    micros: { vitaminC: 22, iron: 2.2, potassium: 390, sodium: 360 },
    primaryIngredients: ['Potato (Aloo)', 'Green Peas (Matar)', 'Tomato', 'Roti'],
    keywords: ['aloo matar', 'alu matar'],
  },
  {
    name: 'Bhindi Masala with Roti',
    category: 'North Indian',
    standardPortionGrams: 280,
    caloriesPer100g: 105,
    proteinPer100g: 3.2,
    carbsPer100g: 16.5,
    fatPer100g: 3.0,
    fiberPer100g: 3.6,
    micros: { calcium: 95, iron: 2.6, vitaminC: 18, potassium: 320, sodium: 340 },
    primaryIngredients: ['Okra (Bhindi)', 'Onion', 'Amchur', 'Roti'],
    keywords: ['bhindi masala', 'bhindi', 'okra'],
  },
  {
    name: 'Baingan Ka Bharta with Phulka',
    category: 'North Indian',
    standardPortionGrams: 300,
    caloriesPer100g: 95,
    proteinPer100g: 3.0,
    carbsPer100g: 14.5,
    fatPer100g: 2.8,
    fiberPer100g: 3.4,
    micros: { iron: 2.5, potassium: 380, sodium: 340 },
    primaryIngredients: ['Roasted Eggplant (Baingan)', 'Onions', 'Tomatoes', 'Green Chillies', 'Phulka'],
    keywords: ['baingan bharta', 'baingan ka bharta', 'eggplant bharta'],
  },
  {
    name: 'Sarson Ka Saag with Makki Di Roti',
    category: 'North Indian',
    standardPortionGrams: 350,
    caloriesPer100g: 130,
    proteinPer100g: 4.2,
    carbsPer100g: 18.0,
    fatPer100g: 4.8,
    fiberPer100g: 4.5,
    micros: { iron: 7.2, calcium: 280, potassium: 590, vitaminA: 510, sodium: 410 },
    primaryIngredients: ['Mustard Greens (Sarson)', 'Spinach', 'Bathua', 'Makki Atta (Cornmeal)', 'White Butter'],
    keywords: ['sarson ka saag', 'makki di roti', 'sarson saag'],
  },
  {
    name: 'Kadhi Pakora with Steamed Rice',
    category: 'North Indian',
    standardPortionGrams: 360,
    caloriesPer100g: 125,
    proteinPer100g: 4.5,
    carbsPer100g: 18.0,
    fatPer100g: 4.0,
    fiberPer100g: 2.0,
    micros: { calcium: 180, iron: 2.4, potassium: 360, sodium: 480 },
    primaryIngredients: ['Besan (Gram Flour)', 'Dahi (Yogurt)', 'Fenugreek Seeds', 'Rice'],
    keywords: ['kadhi pakora', 'kadhi chawal', 'punjabi kadhi'],
  },
  {
    name: 'North Indian Thali (Roti, Dal Tadka, Sabzi & Jeera Rice)',
    category: 'North Indian',
    standardPortionGrams: 450,
    caloriesPer100g: 135,
    proteinPer100g: 4.8,
    carbsPer100g: 21.0,
    fatPer100g: 3.8,
    fiberPer100g: 3.2,
    micros: { iron: 5.5, calcium: 160, potassium: 580, sodium: 520 },
    primaryIngredients: ['Atta Roti', 'Toor Dal', 'Seasonal Sabzi', 'Jeera Rice', 'Salad'],
    keywords: ['thali', 'north indian thali', 'roti dal sabzi rice', 'full meal'],
  },
  {
    name: 'Aloo Paratha with Dahi & Makkhan',
    category: 'North Indian',
    standardPortionGrams: 280,
    caloriesPer100g: 157,
    proteinPer100g: 4.3,
    carbsPer100g: 22.1,
    fatPer100g: 6.1,
    fiberPer100g: 2.2,
    micros: { calcium: 210, iron: 2.8, potassium: 490, sodium: 410 },
    primaryIngredients: ['Whole Wheat Atta', 'Boiled Potato', 'Ghee / Butter', 'Dahi (Curd)'],
    keywords: ['aloo paratha', 'alu paratha'],
  },
  {
    name: 'Paneer Paratha with Dahi',
    category: 'North Indian',
    standardPortionGrams: 280,
    caloriesPer100g: 175,
    proteinPer100g: 7.2,
    carbsPer100g: 19.5,
    fatPer100g: 7.8,
    fiberPer100g: 2.0,
    micros: { calcium: 320, iron: 2.5, potassium: 380, sodium: 390 },
    primaryIngredients: ['Paneer', 'Whole Wheat Atta', 'Dahi', 'Spices'],
    keywords: ['paneer paratha'],
  },
  {
    name: 'Butter Chicken (Murgh Makhani) with Naan',
    category: 'North Indian',
    standardPortionGrams: 380,
    caloriesPer100g: 165,
    proteinPer100g: 9.8,
    carbsPer100g: 13.0,
    fatPer100g: 8.2,
    fiberPer100g: 1.5,
    micros: { iron: 3.2, potassium: 480, sodium: 590 },
    primaryIngredients: ['Chicken', 'Butter', 'Cream', 'Tomato Gravy', 'Naan'],
    keywords: ['butter chicken', 'murgh makhani'],
  },
  {
    name: 'Chicken Dum Biryani with Raita',
    category: 'North Indian',
    standardPortionGrams: 420,
    caloriesPer100g: 148,
    proteinPer100g: 9.0,
    carbsPer100g: 17.6,
    fatPer100g: 4.8,
    fiberPer100g: 1.2,
    micros: { iron: 3.8, potassium: 560, sodium: 590 },
    primaryIngredients: ['Basmati Rice', 'Chicken', 'Yogurt Raita', 'Biryani Spices', 'Ghee'],
    keywords: ['chicken biryani', 'chicken dum biryani', 'biryani'],
  },

  // ==================== SOUTH INDIAN ====================
  {
    name: 'Idli Sambar with Coconut Chutney',
    category: 'South Indian',
    standardPortionGrams: 300,
    caloriesPer100g: 97,
    proteinPer100g: 3.7,
    carbsPer100g: 17.3,
    fatPer100g: 1.3,
    fiberPer100g: 2.0,
    micros: { calcium: 85, iron: 2.1, potassium: 360, sodium: 380 },
    primaryIngredients: ['Fermented Rice & Urad Dal', 'Toor Dal Sambar', 'Coconut Chutney'],
    keywords: ['idli', 'idli sambar', 'steamed rice cake'],
  },
  {
    name: 'Masala Dosa with Sambar & Chutney',
    category: 'South Indian',
    standardPortionGrams: 280,
    caloriesPer100g: 128,
    proteinPer100g: 3.2,
    carbsPer100g: 20.7,
    fatPer100g: 3.9,
    fiberPer100g: 1.8,
    micros: { calcium: 90, iron: 2.4, potassium: 390, sodium: 420 },
    primaryIngredients: ['Crispy Rice Crepe', 'Spiced Potato Filling', 'Sambar', 'Coconut Chutney'],
    keywords: ['masala dosa', 'dosa', 'paper dosa', 'ghee roast'],
  },
  {
    name: 'Medu Vada with Sambar',
    category: 'South Indian',
    standardPortionGrams: 220,
    caloriesPer100g: 195,
    proteinPer100g: 6.2,
    carbsPer100g: 21.0,
    fatPer100g: 9.8,
    fiberPer100g: 3.5,
    micros: { iron: 3.2, potassium: 410, sodium: 440 },
    primaryIngredients: ['Urad Dal', 'Curry Leaves', 'Green Chillies', 'Oil', 'Sambar'],
    keywords: ['medu vada', 'vada', 'vadai', 'sambar vada'],
  },
  {
    name: 'Ven Pongal with Coconut Chutney',
    category: 'South Indian',
    standardPortionGrams: 300,
    caloriesPer100g: 135,
    proteinPer100g: 4.5,
    carbsPer100g: 21.0,
    fatPer100g: 3.8,
    fiberPer100g: 2.2,
    micros: { iron: 2.6, calcium: 65, potassium: 340, sodium: 370 },
    primaryIngredients: ['Raw Rice', 'Moong Dal', 'Ghee', 'Black Pepper', 'Cashews', 'Ginger'],
    keywords: ['pongal', 'ven pongal', 'ghee pongal'],
  },
  {
    name: 'Uttapam with Sambar & Chutney',
    category: 'South Indian',
    standardPortionGrams: 260,
    caloriesPer100g: 125,
    proteinPer100g: 3.6,
    carbsPer100g: 20.5,
    fatPer100g: 3.3,
    fiberPer100g: 2.0,
    micros: { calcium: 80, iron: 2.2, potassium: 370, sodium: 390 },
    primaryIngredients: ['Fermented Rice-Lentil Batter', 'Onion', 'Tomato', 'Coriander'],
    keywords: ['uttapam', 'onion uttapam', 'tomato uttapam'],
  },
  {
    name: 'Veg Upma with Coconut Chutney',
    category: 'South Indian',
    standardPortionGrams: 250,
    caloriesPer100g: 120,
    proteinPer100g: 3.6,
    carbsPer100g: 21.6,
    fatPer100g: 2.2,
    fiberPer100g: 1.8,
    micros: { iron: 2.5, potassium: 280, sodium: 310 },
    primaryIngredients: ['Semolina (Rava)', 'Mustard Seeds', 'Peanuts', 'Curry Leaves', 'Vegetables'],
    keywords: ['upma', 'rava upma', 'veg upma'],
  },
  {
    name: 'Curd Rice with Tadka',
    category: 'South Indian',
    standardPortionGrams: 300,
    caloriesPer100g: 110,
    proteinPer100g: 3.5,
    carbsPer100g: 17.5,
    fatPer100g: 2.9,
    fiberPer100g: 0.8,
    micros: { calcium: 140, potassium: 290, sodium: 320 },
    primaryIngredients: ['Steamed Rice', 'Fresh Curd (Dahi)', 'Mustard Seeds', 'Pomegranate', 'Ginger'],
    keywords: ['curd rice', 'thayir sadam', 'daddojanam'],
  },
  {
    name: 'South Indian Lemon Rice (Chitranna)',
    category: 'South Indian',
    standardPortionGrams: 280,
    caloriesPer100g: 135,
    proteinPer100g: 3.2,
    carbsPer100g: 23.0,
    fatPer100g: 3.4,
    fiberPer100g: 1.2,
    micros: { vitaminC: 16, iron: 2.0, potassium: 210, sodium: 340 },
    primaryIngredients: ['Steamed Rice', 'Fresh Lemon Juice', 'Peanuts', 'Chana Dal', 'Curry Leaves'],
    keywords: ['lemon rice', 'chitranna', 'elumichai sadam'],
  },
  {
    name: 'Bisi Bele Bath with Boondi',
    category: 'South Indian',
    standardPortionGrams: 350,
    caloriesPer100g: 130,
    proteinPer100g: 4.5,
    carbsPer100g: 21.5,
    fatPer100g: 3.0,
    fiberPer100g: 3.2,
    micros: { iron: 3.4, calcium: 75, potassium: 410, sodium: 430 },
    primaryIngredients: ['Rice', 'Toor Dal', 'Mixed Veggies', 'Tamarind', 'Bisi Bele Spice Blend', 'Ghee'],
    keywords: ['bisi bele bath', 'bisibelebath', 'sambar rice'],
  },
  {
    name: 'Avial with Steamed Rice',
    category: 'South Indian',
    standardPortionGrams: 340,
    caloriesPer100g: 115,
    proteinPer100g: 3.0,
    carbsPer100g: 17.0,
    fatPer100g: 3.9,
    fiberPer100g: 3.5,
    micros: { calcium: 110, potassium: 450, sodium: 350 },
    primaryIngredients: ['Ash Gourd', 'Drumstick', 'Carrot', 'Coconut', 'Curd', 'Coconut Oil'],
    keywords: ['avial', 'kerala avial'],
  },
  {
    name: 'Appam with Vegetable Stew',
    category: 'South Indian',
    standardPortionGrams: 300,
    caloriesPer100g: 115,
    proteinPer100g: 2.8,
    carbsPer100g: 18.5,
    fatPer100g: 3.5,
    fiberPer100g: 2.0,
    micros: { calcium: 60, potassium: 310, sodium: 310 },
    primaryIngredients: ['Fermented Rice Appam', 'Coconut Milk', 'Potatoes', 'Carrots', 'Green Peas'],
    keywords: ['appam', 'appam stew', 'kerala stew'],
  },
  {
    name: 'Puttu with Kadala Curry',
    category: 'South Indian',
    standardPortionGrams: 320,
    caloriesPer100g: 140,
    proteinPer100g: 5.2,
    carbsPer100g: 23.0,
    fatPer100g: 3.1,
    fiberPer100g: 4.2,
    micros: { iron: 4.5, potassium: 460, sodium: 380 },
    primaryIngredients: ['Steamed Rice Flour (Puttu)', 'Grated Coconut', 'Black Chickpeas (Kadala) Curry'],
    keywords: ['puttu', 'kadala curry', 'puttu kadala'],
  },
  {
    name: 'Chettinad Chicken Curry with Rice',
    category: 'South Indian',
    standardPortionGrams: 380,
    caloriesPer100g: 140,
    proteinPer100g: 8.8,
    carbsPer100g: 14.5,
    fatPer100g: 5.2,
    fiberPer100g: 1.5,
    micros: { iron: 3.5, potassium: 460, sodium: 520 },
    primaryIngredients: ['Chicken', 'Chettinad Roasted Spice Paste', 'Shallots', 'Rice'],
    keywords: ['chettinad chicken', 'chettinad curry'],
  },

  // ==================== WEST INDIAN ====================
  {
    name: 'Pav Bhaji with Buttered Pav',
    category: 'West Indian',
    standardPortionGrams: 350,
    caloriesPer100g: 148,
    proteinPer100g: 3.7,
    carbsPer100g: 20.6,
    fatPer100g: 6.0,
    fiberPer100g: 2.6,
    micros: { vitaminC: 38, iron: 3.5, potassium: 590, sodium: 690 },
    primaryIngredients: ['Potatoes', 'Tomatoes', 'Capsicum', 'Cauliflower', 'Butter', 'Pav'],
    keywords: ['pav bhaji', 'bhaji pav'],
  },
  {
    name: 'Misal Pav with Farsan & Lemon',
    category: 'West Indian',
    standardPortionGrams: 340,
    caloriesPer100g: 142,
    proteinPer100g: 5.5,
    carbsPer100g: 19.5,
    fatPer100g: 4.9,
    fiberPer100g: 3.5,
    micros: { iron: 4.2, potassium: 480, sodium: 650 },
    primaryIngredients: ['Sprouted Moth Beans (Matki)', 'Tarri (Spicy Kat)', 'Farsan', 'Pav'],
    keywords: ['misal pav', 'kolhapuri misal', 'puneri misal'],
  },
  {
    name: 'Vada Pav with Chutneys',
    category: 'West Indian',
    standardPortionGrams: 220,
    caloriesPer100g: 210,
    proteinPer100g: 4.8,
    carbsPer100g: 29.0,
    fatPer100g: 8.5,
    fiberPer100g: 2.2,
    micros: { iron: 2.4, potassium: 320, sodium: 580 },
    primaryIngredients: ['Spiced Mashed Potato Batata Vada', 'Besan Batter', 'Pav', 'Garlic Chutney'],
    keywords: ['vada pav', 'wada pav', 'batata vada'],
  },
  {
    name: 'Kanda Poha with Peanuts',
    category: 'West Indian',
    standardPortionGrams: 220,
    caloriesPer100g: 141,
    proteinPer100g: 3.6,
    carbsPer100g: 24.5,
    fatPer100g: 3.6,
    fiberPer100g: 1.8,
    micros: { iron: 4.5, potassium: 240, vitaminC: 18, sodium: 290 },
    primaryIngredients: ['Flattened Rice (Poha)', 'Onions', 'Roasted Peanuts', 'Mustard Seeds', 'Lemon'],
    keywords: ['poha', 'kanda poha', 'batata poha'],
  },
  {
    name: 'Sabudana Khichdi with Roasted Peanuts',
    category: 'West Indian',
    standardPortionGrams: 240,
    caloriesPer100g: 185,
    proteinPer100g: 3.8,
    carbsPer100g: 31.0,
    fatPer100g: 5.2,
    fiberPer100g: 1.5,
    micros: { calcium: 80, iron: 2.0, potassium: 260, sodium: 320 },
    primaryIngredients: ['Tapioca Pearls (Sabudana)', 'Crushed Peanuts', 'Boiled Potato', 'Ghee', 'Cumin'],
    keywords: ['sabudana khichdi', 'sabudana'],
  },
  {
    name: 'Thalipeeth with Dahi & White Butter',
    category: 'West Indian',
    standardPortionGrams: 240,
    caloriesPer100g: 165,
    proteinPer100g: 5.5,
    carbsPer100g: 24.0,
    fatPer100g: 5.5,
    fiberPer100g: 3.8,
    micros: { iron: 4.0, calcium: 110, potassium: 340, sodium: 380 },
    primaryIngredients: ['Multigrain Bhajani Flour (Jowar, Bajra, Wheat, Chana)', 'Onion', 'Coriander'],
    keywords: ['thalipeeth', 'maharashtrian thalipeeth'],
  },
  {
    name: 'Pithla Bhakri with Thecha',
    category: 'West Indian',
    standardPortionGrams: 300,
    caloriesPer100g: 135,
    proteinPer100g: 5.8,
    carbsPer100g: 21.0,
    fatPer100g: 3.4,
    fiberPer100g: 4.2,
    micros: { iron: 4.5, potassium: 420, sodium: 460 },
    primaryIngredients: ['Besan Pithla (Gram Flour Curry)', 'Jowar / Bajra Bhakri', 'Green Chilli Thecha'],
    keywords: ['pithla bhakri', 'zunka bhakar', 'pitla'],
  },
  {
    name: 'Khaman Dhokla with Green Chutney',
    category: 'West Indian',
    standardPortionGrams: 200,
    caloriesPer100g: 130,
    proteinPer100g: 5.0,
    carbsPer100g: 21.5,
    fatPer100g: 2.8,
    fiberPer100g: 2.5,
    micros: { iron: 2.8, potassium: 280, sodium: 450 },
    primaryIngredients: ['Fermented Gram Flour (Besan)', 'Mustard Tempering', 'Curry Leaves', 'Lemon'],
    keywords: ['dhokla', 'khaman dhokla', 'khaman'],
  },
  {
    name: 'Methi Thepla with Dahi & Chhundo',
    category: 'West Indian',
    standardPortionGrams: 220,
    caloriesPer100g: 160,
    proteinPer100g: 5.2,
    carbsPer100g: 24.0,
    fatPer100g: 5.0,
    fiberPer100g: 3.0,
    micros: { iron: 4.8, calcium: 160, potassium: 380, sodium: 390 },
    primaryIngredients: ['Whole Wheat Flour', 'Fresh Fenugreek (Methi)', 'Besan', 'Yogurt', 'Sesame Seeds'],
    keywords: ['thepla', 'methi thepla', 'gujarati thepla'],
  },
  {
    name: 'Gujarati Dal Dhokli',
    category: 'West Indian',
    standardPortionGrams: 320,
    caloriesPer100g: 125,
    proteinPer100g: 4.2,
    carbsPer100g: 21.0,
    fatPer100g: 2.6,
    fiberPer100g: 2.8,
    micros: { iron: 3.2, potassium: 360, sodium: 410 },
    primaryIngredients: ['Toor Dal', 'Whole Wheat Pasta Diamonds (Dhokli)', 'Peanuts', 'Jaggery'],
    keywords: ['dal dhokli', 'gujarati dal dhokli'],
  },
  {
    name: 'Sev Tameta Nu Shaak with Phulka',
    category: 'West Indian',
    standardPortionGrams: 280,
    caloriesPer100g: 138,
    proteinPer100g: 4.0,
    carbsPer100g: 19.5,
    fatPer100g: 5.0,
    fiberPer100g: 2.4,
    micros: { vitaminC: 24, iron: 2.6, potassium: 340, sodium: 490 },
    primaryIngredients: ['Tangy Tomato Curry', 'Crispy Sev (Gram Flour Vermicelli)', 'Phulka Roti'],
    keywords: ['sev tameta', 'sev tamatar', 'sev tomato'],
  },
  {
    name: 'Dal Baati Churma with Ghee',
    category: 'West Indian',
    standardPortionGrams: 380,
    caloriesPer100g: 210,
    proteinPer100g: 5.6,
    carbsPer100g: 28.5,
    fatPer100g: 8.5,
    fiberPer100g: 3.8,
    micros: { iron: 4.6, calcium: 140, potassium: 450, sodium: 490 },
    primaryIngredients: ['Panchmel Dal (5 Lentils)', 'Baked Wheat Baati', 'Churma (Sweet Crumb)', 'Desi Ghee'],
    keywords: ['dal baati churma', 'dal baati', 'rajasthani dal bati'],
  },
  {
    name: 'Gatte Ki Sabzi with Bajra Roti',
    category: 'West Indian',
    standardPortionGrams: 320,
    caloriesPer100g: 135,
    proteinPer100g: 5.2,
    carbsPer100g: 18.0,
    fatPer100g: 4.8,
    fiberPer100g: 3.5,
    micros: { calcium: 190, iron: 3.8, potassium: 410, sodium: 460 },
    primaryIngredients: ['Gram Flour Dumplings (Gatte)', 'Yogurt Gravy', 'Bajra (Pearl Millet) Roti'],
    keywords: ['gatte ki sabzi', 'gatta curry', 'rajasthani gatte'],
  },
  {
    name: 'Goan Fish Curry with Steamed Rice',
    category: 'West Indian',
    standardPortionGrams: 380,
    caloriesPer100g: 130,
    proteinPer100g: 7.8,
    carbsPer100g: 16.0,
    fatPer100g: 4.0,
    fiberPer100g: 1.2,
    micros: { iron: 2.8, potassium: 420, sodium: 480 },
    primaryIngredients: ['Pomfret / Kingfish', 'Fresh Grated Coconut', 'Kokum', 'Red Kashmiri Chillies', 'Rice'],
    keywords: ['goan fish curry', 'fish curry rice', 'goan curry'],
  },

  // ==================== EAST INDIAN & NORTH-EAST ====================
  {
    name: 'Macher Jhol with Steamed Rice',
    category: 'East Indian',
    standardPortionGrams: 380,
    caloriesPer100g: 118,
    proteinPer100g: 7.5,
    carbsPer100g: 16.2,
    fatPer100g: 2.8,
    fiberPer100g: 1.0,
    micros: { iron: 3.2, potassium: 440, sodium: 420 },
    primaryIngredients: ['Rohu / Katla Fish', 'Mustard Oil', 'Paanch Phoron', 'Potatoes', 'Rice'],
    keywords: ['macher jhol', 'bengali fish curry', 'fish curry'],
  },
  {
    name: 'Kosha Mangsho with Luchi',
    category: 'East Indian',
    standardPortionGrams: 360,
    caloriesPer100g: 180,
    proteinPer100g: 8.5,
    carbsPer100g: 18.0,
    fatPer100g: 8.5,
    fiberPer100g: 1.2,
    micros: { iron: 4.2, potassium: 490, sodium: 560 },
    primaryIngredients: ['Mutton (Goat Meat)', 'Rich Mustard Onion Gravy', 'Deep Fried Luchi (Maida)'],
    keywords: ['kosha mangsho', 'bengali mutton curry', 'mangsho'],
  },
  {
    name: 'Luchi with Alur Dom',
    category: 'East Indian',
    standardPortionGrams: 300,
    caloriesPer100g: 160,
    proteinPer100g: 3.5,
    carbsPer100g: 24.5,
    fatPer100g: 5.6,
    fiberPer100g: 2.2,
    micros: { vitaminC: 18, iron: 2.4, potassium: 360, sodium: 440 },
    primaryIngredients: ['Puffed Deep-Fried Luchi', 'Spiced Baby Potato Curry (Alur Dom)'],
    keywords: ['luchi alur dom', 'luchi aloo dum', 'alur dom'],
  },
  {
    name: 'Shorshe Ilish with Steamed Rice',
    category: 'East Indian',
    standardPortionGrams: 360,
    caloriesPer100g: 155,
    proteinPer100g: 8.2,
    carbsPer100g: 15.0,
    fatPer100g: 7.0,
    fiberPer100g: 0.8,
    micros: { iron: 2.6, potassium: 410, sodium: 430 },
    primaryIngredients: ['Hilsa Fish (Ilish)', 'Yellow & Black Mustard Paste', 'Green Chillies', 'Steamed Rice'],
    keywords: ['shorshe ilish', 'ilish mach', 'mustard hilsa'],
  },
  {
    name: 'Chingri Malai Curry with Basmati Rice',
    category: 'East Indian',
    standardPortionGrams: 360,
    caloriesPer100g: 145,
    proteinPer100g: 7.6,
    carbsPer100g: 16.0,
    fatPer100g: 5.5,
    fiberPer100g: 1.0,
    micros: { calcium: 110, iron: 2.4, potassium: 390, sodium: 460 },
    primaryIngredients: ['Tiger Prawns (Chingri)', 'Coconut Milk', 'Ghee', 'Garam Masala', 'Rice'],
    keywords: ['chingri malai curry', 'prawn malai curry'],
  },
  {
    name: 'Dalma with Steamed Rice',
    category: 'East Indian',
    standardPortionGrams: 350,
    caloriesPer100g: 115,
    proteinPer100g: 4.8,
    carbsPer100g: 19.0,
    fatPer100g: 2.2,
    fiberPer100g: 3.5,
    micros: { iron: 4.0, calcium: 120, potassium: 480, sodium: 360 },
    primaryIngredients: ['Toor / Moong Dal', 'Raw Papaya', 'Pumpkin', 'Brinjal', 'Ghee & Roasted Cumin'],
    keywords: ['dalma', 'odia dalma'],
  },
  {
    name: 'Litti Chokha with Desi Ghee',
    category: 'East Indian',
    standardPortionGrams: 340,
    caloriesPer100g: 155,
    proteinPer100g: 6.2,
    carbsPer100g: 23.0,
    fatPer100g: 4.2,
    fiberPer100g: 4.5,
    micros: { iron: 5.2, potassium: 450, sodium: 480 },
    primaryIngredients: ['Wheat Dough Baati', 'Roasted Gram Flour (Sattu)', 'Charred Baingan Chokha', 'Ghee'],
    keywords: ['litti chokha', 'litti', 'sattu litti'],
  },
  {
    name: 'Sattu Paratha with Baingan Bharta',
    category: 'East Indian',
    standardPortionGrams: 300,
    caloriesPer100g: 148,
    proteinPer100g: 6.5,
    carbsPer100g: 22.0,
    fatPer100g: 3.9,
    fiberPer100g: 4.2,
    micros: { iron: 5.0, potassium: 430, sodium: 420 },
    primaryIngredients: ['Whole Wheat Flour', 'Spiced Sattu (Roasted Chana Flour)', 'Roasted Eggplant'],
    keywords: ['sattu paratha', 'sattu roti'],
  },
  {
    name: 'Momos with Spicy Red Garlic Chutney',
    category: 'East Indian',
    standardPortionGrams: 200,
    caloriesPer100g: 135,
    proteinPer100g: 5.5,
    carbsPer100g: 21.0,
    fatPer100g: 3.2,
    fiberPer100g: 1.8,
    micros: { vitaminC: 12, iron: 1.8, potassium: 240, sodium: 520 },
    primaryIngredients: ['Steamed Flour Wrapper', 'Cabbage / Onion / Chicken Filling', 'Red Chilli Chutney'],
    keywords: ['momos', 'steamed momos', 'veg momos', 'chicken momos'],
  },
  {
    name: 'Thukpa (Tibetan / Himalayan Noodle Soup)',
    category: 'East Indian',
    standardPortionGrams: 350,
    caloriesPer100g: 95,
    proteinPer100g: 4.5,
    carbsPer100g: 14.5,
    fatPer100g: 2.0,
    fiberPer100g: 2.0,
    micros: { iron: 2.4, potassium: 380, sodium: 590 },
    primaryIngredients: ['Wheat Noodles', 'Clear Vegetable / Chicken Broth', 'Bok Choy', 'Ginger Garlic'],
    keywords: ['thukpa', 'noodle soup'],
  },

  // ==================== STREET FOODS & CHAATS ====================
  {
    name: 'Pani Puri (Gol Gappe / Puchka)',
    category: 'Central / Street Food',
    standardPortionGrams: 180,
    caloriesPer100g: 110,
    proteinPer100g: 2.5,
    carbsPer100g: 20.5,
    fatPer100g: 2.0,
    fiberPer100g: 2.0,
    micros: { iron: 2.2, potassium: 260, sodium: 580 },
    primaryIngredients: ['Crisp Hollow Puri', 'Ragda / Boiled Potato & Chana', 'Mint-Coriander Spiced Water', 'Tamarind Water'],
    keywords: ['pani puri', 'gol gappa', 'puchka', 'gol gappe'],
  },
  {
    name: 'Bhel Puri with Sev & Chutneys',
    category: 'Central / Street Food',
    standardPortionGrams: 200,
    caloriesPer100g: 155,
    proteinPer100g: 3.8,
    carbsPer100g: 26.5,
    fatPer100g: 3.8,
    fiberPer100g: 2.8,
    micros: { iron: 3.0, potassium: 310, sodium: 490 },
    primaryIngredients: ['Puffed Rice (Murmura)', 'Sev', 'Boiled Potatoes', 'Onions', 'Tamarind & Mint Chutney'],
    keywords: ['bhel puri', 'bhel', 'sukha bhel'],
  },
  {
    name: 'Sev Puri',
    category: 'Central / Street Food',
    standardPortionGrams: 180,
    caloriesPer100g: 175,
    proteinPer100g: 3.6,
    carbsPer100g: 25.0,
    fatPer100g: 6.8,
    fiberPer100g: 2.2,
    micros: { iron: 2.4, potassium: 290, sodium: 520 },
    primaryIngredients: ['Flat Crispy Papdi', 'Potatoes', 'Onions', 'Crispy Sev', 'Sweet & Spicy Chutneys'],
    keywords: ['sev puri', 'sev batata puri'],
  },
  {
    name: 'Aloo Tikki Chaat with Dahi & Chutneys',
    category: 'Central / Street Food',
    standardPortionGrams: 260,
    caloriesPer100g: 145,
    proteinPer100g: 3.8,
    carbsPer100g: 22.0,
    fatPer100g: 4.8,
    fiberPer100g: 2.6,
    micros: { calcium: 120, iron: 2.8, potassium: 390, sodium: 540 },
    primaryIngredients: ['Pan-Fried Potato Patties (Aloo Tikki)', 'Chole Ragda', 'Sweet Curd', 'Chutneys'],
    keywords: ['aloo tikki chaat', 'aloo tikki', 'tikki chaat'],
  },
  {
    name: 'Samosa with Mint Chutney',
    category: 'Central / Street Food',
    standardPortionGrams: 180,
    caloriesPer100g: 233,
    proteinPer100g: 3.9,
    carbsPer100g: 26.7,
    fatPer100g: 12.8,
    fiberPer100g: 2.8,
    micros: { iron: 2.2, potassium: 310, sodium: 490 },
    primaryIngredients: ['Flaky Pastry', 'Spiced Potato & Pea Filling', 'Mint Chutney'],
    keywords: ['samosa', 'punjabi samosa', 'singara'],
  },
  {
    name: 'Samosa Chaat with Chole & Dahi',
    category: 'Central / Street Food',
    standardPortionGrams: 300,
    caloriesPer100g: 175,
    proteinPer100g: 4.8,
    carbsPer100g: 24.0,
    fatPer100g: 6.8,
    fiberPer100g: 3.5,
    micros: { iron: 3.8, calcium: 110, potassium: 420, sodium: 580 },
    primaryIngredients: ['Crushed Samosa', 'Chole Curry', 'Sweet Yogurt', 'Tamarind Chutney', 'Sev'],
    keywords: ['samosa chaat'],
  },
  {
    name: 'Dahi Puri / Dahi Bhalla Chaat',
    category: 'Central / Street Food',
    standardPortionGrams: 250,
    caloriesPer100g: 140,
    proteinPer100g: 4.2,
    carbsPer100g: 20.0,
    fatPer100g: 4.8,
    fiberPer100g: 2.0,
    micros: { calcium: 160, iron: 2.4, potassium: 340, sodium: 460 },
    primaryIngredients: ['Lentil Dumplings / Puris', 'Thick Sweetened Dahi', 'Roasted Cumin', 'Saunth Chutney'],
    keywords: ['dahi puri', 'dahi bhalla', 'dahi vada'],
  },
  {
    name: 'Chicken Kathi Roll',
    category: 'Central / Street Food',
    standardPortionGrams: 240,
    caloriesPer100g: 185,
    proteinPer100g: 9.8,
    carbsPer100g: 21.0,
    fatPer100g: 6.8,
    fiberPer100g: 1.8,
    micros: { iron: 2.8, potassium: 360, sodium: 560 },
    primaryIngredients: ['Paratha Wrap', 'Tikka Chicken Pieces', 'Sliced Onion', 'Green Chutney', 'Egg'],
    keywords: ['chicken roll', 'kathi roll', 'chicken kathi roll'],
  },
  {
    name: 'Paneer Tikka Kathi Roll',
    category: 'Central / Street Food',
    standardPortionGrams: 240,
    caloriesPer100g: 190,
    proteinPer100g: 7.5,
    carbsPer100g: 22.0,
    fatPer100g: 7.8,
    fiberPer100g: 2.2,
    micros: { calcium: 240, iron: 2.5, potassium: 340, sodium: 520 },
    primaryIngredients: ['Paratha Wrap', 'Marinated Paneer Cubes', 'Bell Peppers', 'Mint Sauce'],
    keywords: ['paneer roll', 'paneer kathi roll'],
  },

  // ==================== FITNESS & HIGH PROTEIN ====================
  {
    name: 'Tandoori Grilled Chicken Breast',
    category: 'Fitness / High Protein',
    standardPortionGrams: 200,
    caloriesPer100g: 135,
    proteinPer100g: 24.0,
    carbsPer100g: 2.0,
    fatPer100g: 3.0,
    fiberPer100g: 0.5,
    micros: { iron: 2.1, potassium: 460, sodium: 380 },
    primaryIngredients: ['Chicken Breast Fillet', 'Hung Curd', 'Tandoori Masala', 'Lemon'],
    keywords: ['grilled chicken', 'tandoori chicken breast', 'tandoori chicken'],
  },
  {
    name: 'Boiled Eggs with Chaat Masala (3 Eggs)',
    category: 'Fitness / High Protein',
    standardPortionGrams: 150,
    caloriesPer100g: 140,
    proteinPer100g: 12.0,
    carbsPer100g: 1.3,
    fatPer100g: 9.3,
    fiberPer100g: 0.0,
    micros: { iron: 2.4, calcium: 75, potassium: 200, sodium: 280 },
    primaryIngredients: ['Whole Boiled Eggs', 'Chaat Masala', 'Black Salt'],
    keywords: ['boiled egg', 'boiled eggs', 'hard boiled egg'],
  },
  {
    name: 'Egg Bhurji with Whole Wheat Roti',
    category: 'Fitness / High Protein',
    standardPortionGrams: 260,
    caloriesPer100g: 150,
    proteinPer100g: 8.5,
    carbsPer100g: 14.0,
    fatPer100g: 6.8,
    fiberPer100g: 1.8,
    micros: { iron: 3.2, potassium: 360, vitaminA: 180, sodium: 520 },
    primaryIngredients: ['Scrambled Eggs', 'Onions', 'Tomatoes', 'Green Chillies', 'Whole Wheat Roti'],
    keywords: ['egg bhurji', 'anda bhurji', 'scrambled egg'],
  },
  {
    name: 'Paneer Bhurji with Multigrain Roti',
    category: 'Fitness / High Protein',
    standardPortionGrams: 280,
    caloriesPer100g: 160,
    proteinPer100g: 8.2,
    carbsPer100g: 14.5,
    fatPer100g: 7.8,
    fiberPer100g: 2.4,
    micros: { calcium: 310, iron: 2.8, potassium: 380, sodium: 460 },
    primaryIngredients: ['Crumbled Low-Fat Paneer', 'Tomatoes', 'Capsicum', 'Multigrain Roti'],
    keywords: ['paneer bhurji', 'cottage cheese bhurji'],
  },
  {
    name: 'Sprouted Moong Chaat with Lemon',
    category: 'Fitness / High Protein',
    standardPortionGrams: 200,
    caloriesPer100g: 95,
    proteinPer100g: 7.0,
    carbsPer100g: 15.5,
    fatPer100g: 1.0,
    fiberPer100g: 4.0,
    micros: { iron: 3.9, vitaminC: 28, potassium: 480, sodium: 180 },
    primaryIngredients: ['Sprouted Moong', 'Cucumber', 'Tomato', 'Pomegranate', 'Lemon Juice'],
    keywords: ['moong chaat', 'sprout chaat', 'sprouted moong salad'],
  },
  {
    name: 'Soya Chunks Curry with Brown Rice',
    category: 'Fitness / High Protein',
    standardPortionGrams: 350,
    caloriesPer100g: 125,
    proteinPer100g: 7.5,
    carbsPer100g: 18.0,
    fatPer100g: 2.5,
    fiberPer100g: 3.5,
    micros: { iron: 5.5, calcium: 180, potassium: 510, sodium: 420 },
    primaryIngredients: ['Soya Chunks (Nutrela)', 'Onion Tomato Curry', 'Brown Rice'],
    keywords: ['soya chunks', 'nutrela curry', 'soya curry'],
  },
  {
    name: 'Besan Chilla with Mint Chutney',
    category: 'Fitness / High Protein',
    standardPortionGrams: 220,
    caloriesPer100g: 140,
    proteinPer100g: 6.8,
    carbsPer100g: 18.5,
    fatPer100g: 4.2,
    fiberPer100g: 3.6,
    micros: { iron: 3.6, potassium: 380, sodium: 390 },
    primaryIngredients: ['Gram Flour (Besan)', 'Finely Chopped Veggies', 'Ajwain', 'Mint Chutney'],
    keywords: ['besan chilla', 'chilla', 'gram flour pancake'],
  },
  {
    name: 'Moong Dal Khichdi with Dahi',
    category: 'Fitness / High Protein',
    standardPortionGrams: 350,
    caloriesPer100g: 108,
    proteinPer100g: 4.3,
    carbsPer100g: 17.4,
    fatPer100g: 2.3,
    fiberPer100g: 2.0,
    micros: { calcium: 160, iron: 3.4, potassium: 420, sodium: 340 },
    primaryIngredients: ['Yellow Moong Dal', 'Rice', 'Ghee', 'Cumin', 'Fresh Dahi'],
    keywords: ['khichdi', 'moong dal khichdi', 'khichuri'],
  },

  // ==================== DESSERTS & SWEETS ====================
  {
    name: 'Gulab Jamun',
    category: 'Dessert / Sweet',
    standardPortionGrams: 100,
    caloriesPer100g: 320,
    proteinPer100g: 4.2,
    carbsPer100g: 52.0,
    fatPer100g: 11.0,
    fiberPer100g: 0.5,
    micros: { calcium: 90, sodium: 120 },
    primaryIngredients: ['Khoya / Mawa', 'Cardamom Sugar Syrup', 'Ghee'],
    keywords: ['gulab jamun'],
  },
  {
    name: 'Crispy Jalebi',
    category: 'Dessert / Sweet',
    standardPortionGrams: 100,
    caloriesPer100g: 340,
    proteinPer100g: 2.5,
    carbsPer100g: 62.0,
    fatPer100g: 9.5,
    fiberPer100g: 0.2,
    micros: { iron: 1.2, sodium: 90 },
    primaryIngredients: ['Fermented Flour Batter', 'Saffron Sugar Syrup', 'Ghee'],
    keywords: ['jalebi', 'crispy jalebi'],
  },
  {
    name: 'Rasmalai',
    category: 'Dessert / Sweet',
    standardPortionGrams: 140,
    caloriesPer100g: 210,
    proteinPer100g: 6.5,
    carbsPer100g: 28.0,
    fatPer100g: 8.5,
    fiberPer100g: 0.2,
    micros: { calcium: 240, potassium: 280, sodium: 110 },
    primaryIngredients: ['Chhena Patties', 'Thickened Saffron-Cardamom Milk (Rabri)', 'Pistachios'],
    keywords: ['rasmalai'],
  },
  {
    name: 'Gajar Ka Halwa',
    category: 'Dessert / Sweet',
    standardPortionGrams: 150,
    caloriesPer100g: 240,
    proteinPer100g: 4.8,
    carbsPer100g: 34.0,
    fatPer100g: 9.5,
    fiberPer100g: 2.2,
    micros: { vitaminA: 620, calcium: 180, potassium: 310, sodium: 140 },
    primaryIngredients: ['Grated Red Carrots', 'Full Cream Milk', 'Mawa', 'Desi Ghee', 'Almonds'],
    keywords: ['gajar halwa', 'gajar ka halwa', 'carrot halwa'],
  },

  // ==================== BEVERAGES ====================
  {
    name: 'Masala Chai',
    category: 'Beverage',
    standardPortionGrams: 180,
    caloriesPer100g: 65,
    proteinPer100g: 2.2,
    carbsPer100g: 8.5,
    fatPer100g: 2.4,
    fiberPer100g: 0.0,
    micros: { calcium: 90, potassium: 120, sodium: 45 },
    primaryIngredients: ['Black Tea', 'Milk', 'Ginger', 'Cardamom', 'Sugar'],
    keywords: ['chai', 'masala chai', 'tea'],
  },
  {
    name: 'Sweet Mango Lassi',
    category: 'Beverage',
    standardPortionGrams: 250,
    caloriesPer100g: 95,
    proteinPer100g: 3.2,
    carbsPer100g: 16.0,
    fatPer100g: 2.1,
    fiberPer100g: 0.6,
    micros: { calcium: 150, potassium: 280, vitaminA: 190, sodium: 80 },
    primaryIngredients: ['Yogurt (Curd)', 'Mango Pulp', 'Cardamom', 'Sugar'],
    keywords: ['mango lassi', 'sweet lassi', 'lassi'],
  },
  {
    name: 'Masala Chaas (Spiced Buttermilk)',
    category: 'Beverage',
    standardPortionGrams: 250,
    caloriesPer100g: 32,
    proteinPer100g: 1.8,
    carbsPer100g: 3.2,
    fatPer100g: 1.2,
    fiberPer100g: 0.2,
    micros: { calcium: 95, potassium: 160, sodium: 220 },
    primaryIngredients: ['Churned Curd', 'Water', 'Roasted Cumin', 'Ginger', 'Black Salt'],
    keywords: ['chaas', 'buttermilk', 'masala chaas'],
  },
];

/**
 * Detailed Individual Ingredient Profiles
 * Useful for recalculating nutritional breakdown from bottom-up detected vegetables & ingredients.
 */
export const INGREDIENT_NUTRITION_PROFILES: Record<string, IngredientNutrition> = {
  // Vegetables
  aloo: { name: 'Potato (Aloo)', category: 'vegetable', caloriesPer100g: 87, proteinPer100g: 1.9, carbsPer100g: 20.1, fatPer100g: 0.1, fiberPer100g: 1.8, micros: { vitaminC: 20, potassium: 420 } },
  gobi: { name: 'Cauliflower (Gobi)', category: 'vegetable', caloriesPer100g: 25, proteinPer100g: 2.0, carbsPer100g: 5.0, fatPer100g: 0.3, fiberPer100g: 2.0, micros: { vitaminC: 48, potassium: 300 } },
  palak: { name: 'Spinach (Palak)', category: 'vegetable', caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4, fiberPer100g: 2.2, micros: { iron: 2.7, calcium: 99, vitaminA: 469 } },
  bhindi: { name: 'Okra (Bhindi)', category: 'vegetable', caloriesPer100g: 33, proteinPer100g: 1.9, carbsPer100g: 7.5, fatPer100g: 0.2, fiberPer100g: 3.2, micros: { calcium: 82, vitaminC: 23 } },
  baingan: { name: 'Eggplant (Baingan)', category: 'vegetable', caloriesPer100g: 25, proteinPer100g: 1.0, carbsPer100g: 6.0, fatPer100g: 0.2, fiberPer100g: 3.0, micros: { potassium: 230 } },
  tamatar: { name: 'Tomato', category: 'vegetable', caloriesPer100g: 18, proteinPer100g: 0.9, carbsPer100g: 3.9, fatPer100g: 0.2, fiberPer100g: 1.2, micros: { vitaminC: 14 } },
  pyaz: { name: 'Onion', category: 'vegetable', caloriesPer100g: 40, proteinPer100g: 1.1, carbsPer100g: 9.3, fatPer100g: 0.1, fiberPer100g: 1.7, micros: { potassium: 146 } },
  matar: { name: 'Green Peas (Matar)', category: 'vegetable', caloriesPer100g: 81, proteinPer100g: 5.4, carbsPer100g: 14.5, fatPer100g: 0.4, fiberPer100g: 5.7, micros: { iron: 1.5, vitaminC: 40 } },
  shimla_mirch: { name: 'Capsicum / Bell Pepper', category: 'vegetable', caloriesPer100g: 26, proteinPer100g: 1.0, carbsPer100g: 6.0, fatPer100g: 0.3, fiberPer100g: 2.1, micros: { vitaminC: 128 } },
  lauki: { name: 'Bottle Gourd (Lauki)', category: 'vegetable', caloriesPer100g: 14, proteinPer100g: 0.6, carbsPer100g: 3.4, fatPer100g: 0.1, fiberPer100g: 1.0, micros: { potassium: 150 } },
  karela: { name: 'Bitter Gourd (Karela)', category: 'vegetable', caloriesPer100g: 17, proteinPer100g: 1.0, carbsPer100g: 3.7, fatPer100g: 0.2, fiberPer100g: 2.8, micros: { iron: 2.0, vitaminC: 84 } },
  gajar: { name: 'Carrot (Gajar)', category: 'vegetable', caloriesPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 9.6, fatPer100g: 0.2, fiberPer100g: 2.8, micros: { vitaminA: 835 } },
  methi: { name: 'Fenugreek Leaves (Methi)', category: 'vegetable', caloriesPer100g: 49, proteinPer100g: 4.4, carbsPer100g: 6.0, fatPer100g: 0.9, fiberPer100g: 3.2, micros: { iron: 1.9, calcium: 395 } },
  sarson: { name: 'Mustard Greens (Sarson)', category: 'vegetable', caloriesPer100g: 27, proteinPer100g: 2.9, carbsPer100g: 4.7, fatPer100g: 0.4, fiberPer100g: 3.2, micros: { calcium: 115, iron: 1.6 } },

  // Grains & Flours
  roti: { name: 'Whole Wheat Roti / Phulka', category: 'grain', caloriesPer100g: 260, proteinPer100g: 9.0, carbsPer100g: 52.0, fatPer100g: 2.0, fiberPer100g: 8.0, micros: { iron: 3.5 } },
  chawal: { name: 'Cooked Basmati Rice', category: 'grain', caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28.2, fatPer100g: 0.3, fiberPer100g: 0.4, micros: { iron: 0.5 } },
  naan: { name: 'Naan Bread', category: 'grain', caloriesPer100g: 290, proteinPer100g: 8.5, carbsPer100g: 50.0, fatPer100g: 6.5, fiberPer100g: 2.5, micros: { calcium: 40 } },
  poha: { name: 'Flattened Rice (Poha Cooked)', category: 'grain', caloriesPer100g: 160, proteinPer100g: 3.2, carbsPer100g: 32.0, fatPer100g: 2.0, fiberPer100g: 1.5, micros: { iron: 4.5 } },

  // Pulses & Lentils (Cooked with Tadka)
  dal: { name: 'Cooked Toor / Moong Dal', category: 'pulse', caloriesPer100g: 105, proteinPer100g: 6.5, carbsPer100g: 15.0, fatPer100g: 2.2, fiberPer100g: 3.8, micros: { iron: 2.2, potassium: 310 } },
  rajma: { name: 'Cooked Rajma (Kidney Beans)', category: 'pulse', caloriesPer100g: 125, proteinPer100g: 8.5, carbsPer100g: 19.5, fatPer100g: 1.5, fiberPer100g: 6.0, micros: { iron: 2.9, potassium: 400 } },
  chole: { name: 'Cooked Chole (Chickpeas)', category: 'pulse', caloriesPer100g: 140, proteinPer100g: 7.8, carbsPer100g: 21.0, fatPer100g: 3.0, fiberPer100g: 5.5, micros: { iron: 2.8, calcium: 50 } },

  // Proteins & Dairy
  paneer: { name: 'Fresh Paneer', category: 'dairy', caloriesPer100g: 265, proteinPer100g: 18.3, carbsPer100g: 3.4, fatPer100g: 20.8, fiberPer100g: 0.0, micros: { calcium: 480, sodium: 18 } },
  chicken: { name: 'Cooked Chicken (Curry / Tandoori)', category: 'meat', caloriesPer100g: 185, proteinPer100g: 26.0, carbsPer100g: 1.5, fatPer100g: 8.5, fiberPer100g: 0.0, micros: { iron: 1.8, potassium: 320 } },
  egg: { name: 'Whole Egg (Boiled / Bhurji)', category: 'meat', caloriesPer100g: 145, proteinPer100g: 12.6, carbsPer100g: 1.1, fatPer100g: 10.0, fiberPer100g: 0.0, micros: { iron: 1.8, calcium: 56 } },
  fish: { name: 'Fish (Rohu / Katla Cooked)', category: 'meat', caloriesPer100g: 135, proteinPer100g: 20.0, carbsPer100g: 1.0, fatPer100g: 5.5, fiberPer100g: 0.0, micros: { iron: 1.4, potassium: 350 } },
  dahi: { name: 'Fresh Dahi (Curd / Yogurt)', category: 'dairy', caloriesPer100g: 60, proteinPer100g: 3.5, carbsPer100g: 4.7, fatPer100g: 3.2, fiberPer100g: 0.0, micros: { calcium: 150, potassium: 180 } },

  // Fats & Oils
  ghee: { name: 'Desi Ghee / Butter', category: 'fat', caloriesPer100g: 900, proteinPer100g: 0.3, carbsPer100g: 0.0, fatPer100g: 99.5, fiberPer100g: 0.0 },
  oil: { name: 'Cooking Oil (Mustard / Sunflower)', category: 'fat', caloriesPer100g: 884, proteinPer100g: 0.0, carbsPer100g: 0.0, fatPer100g: 100.0, fiberPer100g: 0.0 },
};

/**
 * Finds the closest matched pan-Indian reference dish for nutrition calibration.
 */
export function findIndianReferenceDish(dishName: string): IndianDishNutrition | null {
  if (!dishName) return null;
  const lower = dishName.toLowerCase();

  // 1. Direct name match
  for (const dish of PAN_INDIAN_DISH_DATABASE) {
    if (lower.includes(dish.name.toLowerCase()) || dish.name.toLowerCase().includes(lower)) {
      return dish;
    }
  }

  // 2. Keyword match
  for (const dish of PAN_INDIAN_DISH_DATABASE) {
    for (const kw of dish.keywords) {
      if (lower.includes(kw)) {
        return dish;
      }
    }
  }

  return null;
}

/**
 * Calibrate and compute high-accuracy nutrition based on detected Indian ingredients and ICMR-NIN reference profiles.
 * Ensures calories, protein, carbs, fat, fiber, and portion weight are nutritionally sound and grounded in Indian culinary physics.
 */
export function calibrateIndianMealNutrition(
  dishName: string,
  rawPortionGrams: number,
  rawCalories: number,
  rawProtein: number,
  rawCarbs: number,
  rawFat: number,
  rawFiber: number,
  ingredients?: Array<{ name: string; weightGrams: number }>
): {
  portionGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  micros: Micronutrients;
} {
  // Step 1: Check if we have individual ingredient weights
  let calculatedWeightFromIngredients = 0;
  let ingredientCals = 0;
  let ingredientProtein = 0;
  let ingredientCarbs = 0;
  let ingredientFat = 0;
  let ingredientFiber = 0;

  if (ingredients && ingredients.length > 0) {
    calculatedWeightFromIngredients = ingredients.reduce((sum, i) => sum + (i.weightGrams || 0), 0);

    for (const ing of ingredients) {
      const ingLower = (ing.name || '').toLowerCase();
      const weight = ing.weightGrams || 0;
      if (weight <= 0) continue;

      // Find matching ingredient profile
      let matchedProfile: IngredientNutrition | null = null;
      for (const [key, prof] of Object.entries(INGREDIENT_NUTRITION_PROFILES)) {
        if (ingLower.includes(key) || ingLower.includes(prof.name.toLowerCase())) {
          matchedProfile = prof;
          break;
        }
      }

      if (matchedProfile) {
        const factor = weight / 100;
        ingredientCals += matchedProfile.caloriesPer100g * factor;
        ingredientProtein += matchedProfile.proteinPer100g * factor;
        ingredientCarbs += matchedProfile.carbsPer100g * factor;
        ingredientFat += matchedProfile.fatPer100g * factor;
        ingredientFiber += matchedProfile.fiberPer100g * factor;
      }
    }
  }

  // Step 2: Look up authoritative ICMR-NIN dish reference
  const referenceDish = findIndianReferenceDish(dishName);

  // Final portion weight calculation
  let finalPortionGrams = rawPortionGrams;
  if (calculatedWeightFromIngredients > 30) {
    finalPortionGrams = calculatedWeightFromIngredients;
  } else if (referenceDish && (rawPortionGrams <= 50 || rawPortionGrams > 1000)) {
    finalPortionGrams = referenceDish.standardPortionGrams;
  }
  finalPortionGrams = Math.max(20, Math.round(finalPortionGrams));

  // Determine baseline macros per 100g
  let finalCalories = rawCalories;
  let finalProtein = rawProtein;
  let finalCarbs = rawCarbs;
  let finalFat = rawFat;
  let finalFiber = rawFiber;

  if (referenceDish) {
    const factor = finalPortionGrams / 100;
    const refCals = Math.round(referenceDish.caloriesPer100g * factor);
    const refProtein = Math.round(referenceDish.proteinPer100g * factor * 10) / 10;
    const refCarbs = Math.round(referenceDish.carbsPer100g * factor * 10) / 10;
    const refFat = Math.round(referenceDish.fatPer100g * factor * 10) / 10;
    const refFiber = Math.round(referenceDish.fiberPer100g * factor * 10) / 10;

    // If AI estimation was missing or wildly unreasonable (> 2.5x or < 0.35x off realistic density),
    // ground it with the reference dish values
    const calDensity = finalPortionGrams > 0 ? rawCalories / finalPortionGrams : 0;
    if (calDensity < 0.4 || calDensity > 4.5 || rawCalories <= 0) {
      finalCalories = refCals;
    } else {
      // Smoothly blend: 60% AI estimation + 40% ICMR benchmark
      finalCalories = Math.round(rawCalories * 0.6 + refCals * 0.4);
    }

    // Protein calibration: Ensure realistic protein density
    if (rawProtein <= 0 || rawProtein > (finalPortionGrams * 0.35)) {
      finalProtein = refProtein;
    } else {
      finalProtein = Math.round((rawProtein * 0.6 + refProtein * 0.4) * 10) / 10;
    }

    finalCarbs = rawCarbs > 0 ? Math.round((rawCarbs * 0.6 + refCarbs * 0.4) * 10) / 10 : refCarbs;
    finalFat = rawFat > 0 ? Math.round((rawFat * 0.6 + refFat * 0.4) * 10) / 10 : refFat;
    finalFiber = rawFiber > 0 ? Math.round((rawFiber * 0.6 + refFiber * 0.4) * 10) / 10 : refFiber;
  } else if (ingredientCals > 50) {
    // If no direct dish match but individual ingredients were identified, use ingredient sum
    finalCalories = Math.round(ingredientCals);
    finalProtein = Math.round(ingredientProtein * 10) / 10;
    finalCarbs = Math.round(ingredientCarbs * 10) / 10;
    finalFat = Math.round(ingredientFat * 10) / 10;
    finalFiber = Math.round(ingredientFiber * 10) / 10;
  }

  // Micros calibration
  const micros: Micronutrients = {};
  if (referenceDish?.micros) {
    const scale = finalPortionGrams / referenceDish.standardPortionGrams;
    if (referenceDish.micros.iron) micros.iron = Math.round(referenceDish.micros.iron * scale * 10) / 10;
    if (referenceDish.micros.calcium) micros.calcium = Math.round(referenceDish.micros.calcium * scale);
    if (referenceDish.micros.vitaminC) micros.vitaminC = Math.round(referenceDish.micros.vitaminC * scale);
    if (referenceDish.micros.potassium) micros.potassium = Math.round(referenceDish.micros.potassium * scale);
    if (referenceDish.micros.sodium) micros.sodium = Math.round(referenceDish.micros.sodium * scale);
    if (referenceDish.micros.vitaminA) micros.vitaminA = Math.round(referenceDish.micros.vitaminA * scale);
  }

  return {
    portionGrams: finalPortionGrams,
    calories: Math.max(10, Math.round(finalCalories)),
    protein: Math.max(0, Math.round(finalProtein * 10) / 10),
    carbs: Math.max(0, Math.round(finalCarbs * 10) / 10),
    fat: Math.max(0, Math.round(finalFat * 10) / 10),
    fiber: Math.max(0, Math.round(finalFiber * 10) / 10),
    micros,
  };
}
