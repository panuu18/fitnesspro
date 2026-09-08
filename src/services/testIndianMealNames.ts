import { toTypicalIndianMealName, replaceScientificNames, containsScientificTerms, detectVegetablesAndIngredients } from './indianMealNames.ts';
import { calibrateIndianMealNutrition, PAN_INDIAN_DISH_DATABASE } from './indianNutritionData.ts';

interface TestCase {
  description: string;
  inputName: string;
  ingredients?: Array<{ name: string; weightGrams?: number }>;
  inputDesc?: string;
  expectedContainsOrMatch: string | RegExp;
}

const TEST_CASES: TestCase[] = [
  // ==================== 1. Pure Scientific / Botanical Latin Names ====================
  {
    description: 'Scientific: Lens culinaris soup with steamed Oryza sativa',
    inputName: 'Lens culinaris soup with steamed Oryza sativa',
    expectedContainsOrMatch: /Dal|Chawal/i,
  },
  {
    description: 'Scientific: Cicer arietinum with fried puffed bread',
    inputName: 'Cicer arietinum with fried puffed bread',
    expectedContainsOrMatch: /Chole Bhature/i,
  },
  {
    description: 'Scientific: Phaseolus vulgaris curry served with Oryza sativa',
    inputName: 'Phaseolus vulgaris curry served with Oryza sativa',
    expectedContainsOrMatch: /Rajma Chawal|Rajma/i,
  },
  {
    description: 'Scientific: Vigna radiata porridge with curd',
    inputName: 'Vigna radiata porridge with curd',
    expectedContainsOrMatch: /Moong Dal|Khichdi/i,
  },
  {
    description: 'Scientific: Brassica oleracea var. botrytis and Solanum tuberosum curry',
    inputName: 'Brassica oleracea var. botrytis and Solanum tuberosum curry',
    expectedContainsOrMatch: /Aloo Gobi/i,
  },
  {
    description: 'Scientific: Spinacia oleracea with cottage cheese cubes',
    inputName: 'Spinacia oleracea with cottage cheese cubes',
    expectedContainsOrMatch: /Palak Paneer/i,
  },
  {
    description: 'Scientific: Gallus gallus domesticus layered with fragrant basmati rice',
    inputName: 'Gallus gallus domesticus layered with fragrant basmati rice',
    expectedContainsOrMatch: /Chicken Dum Biryani|Chicken Biryani/i,
  },
  {
    description: 'Scientific: Abelmoschus esculentus stir fry with Triticum aestivum flatbread',
    inputName: 'Abelmoschus esculentus stir fry with Triticum aestivum flatbread',
    expectedContainsOrMatch: /Bhindi|Roti/i,
  },
  {
    description: 'Scientific: Solanum melongena roasted mash with phulka',
    inputName: 'Solanum melongena roasted mash with phulka',
    expectedContainsOrMatch: /Baingan Ka Bharta|Baingan/i,
  },

  // ==================== 2. Sterile / Western English Descriptive Names ====================
  {
    description: 'Descriptive: Steamed fermented rice and lentil cakes',
    inputName: 'Steamed fermented rice and lentil cakes with sambar',
    expectedContainsOrMatch: /Idli Sambar/i,
  },
  {
    description: 'Descriptive: Fermented rice crepe with spiced potato filling',
    inputName: 'Crisp fermented rice crepe with potato filling',
    expectedContainsOrMatch: /Masala Dosa/i,
  },
  {
    description: 'Descriptive: Savory fried lentil donuts',
    inputName: 'Fried lentil donuts served with vegetable stew',
    expectedContainsOrMatch: /Medu Vada/i,
  },
  {
    description: 'Descriptive: Flattened rice flakes with turmeric and peanuts',
    inputName: 'Flattened rice flakes with onions, turmeric and roasted peanuts',
    expectedContainsOrMatch: /Poha/i,
  },
  {
    description: 'Descriptive: Savory semolina porridge with vegetables',
    inputName: 'Savory semolina porridge with roasted cashews and vegetables',
    expectedContainsOrMatch: /Upma/i,
  },
  {
    description: 'Descriptive: Deep fried leavened bread with spiced chickpea curry',
    inputName: 'Spiced chickpea curry with deep fried leavened bread',
    expectedContainsOrMatch: /Chole Bhature/i,
  },
  {
    description: 'Descriptive: Red kidney bean curry with steamed white rice',
    inputName: 'Red kidney bean curry served over steamed rice',
    expectedContainsOrMatch: /Rajma Chawal/i,
  },
  {
    description: 'Descriptive: Tempered yellow split-pea lentil stew',
    inputName: 'Tempered yellow split-pea lentil soup with cumin and garlic',
    expectedContainsOrMatch: /Dal Tadka/i,
  },
  {
    description: 'Descriptive: Slow cooked black lentils with cream and butter',
    inputName: 'Slow cooked black lentils simmered with cream and butter',
    expectedContainsOrMatch: /Dal Makhani/i,
  },
  {
    description: 'Descriptive: Cottage cheese in rich tomato butter gravy',
    inputName: 'Cottage cheese cubes in rich creamy tomato butter gravy',
    expectedContainsOrMatch: /Paneer Butter Masala/i,
  },
  {
    description: 'Descriptive: Cottage cheese in spiced spinach puree',
    inputName: 'Cottage cheese simmered in spiced spinach puree',
    expectedContainsOrMatch: /Palak Paneer/i,
  },
  {
    description: 'Descriptive: Spiced scrambled eggs with onions and chillies',
    inputName: 'Spiced scrambled eggs with onions, green chillies and buttered rolls',
    expectedContainsOrMatch: /Egg Bhurji/i,
  },
  {
    description: 'Descriptive: Mashed spiced vegetables with buttered rolls',
    inputName: 'Spicy mashed mixed vegetable stew served with toasted buttered buns',
    expectedContainsOrMatch: /Pav Bhaji/i,
  },
  {
    description: 'Descriptive: Spicy sprouted bean curry with bread',
    inputName: 'Spicy sprouted moth bean gravy topped with farsan and bread rolls',
    expectedContainsOrMatch: /Misal Pav/i,
  },
  {
    description: 'Descriptive: Fried potato dumpling inside bread roll',
    inputName: 'Spiced battered potato dumpling inside a bread roll with garlic chutney',
    expectedContainsOrMatch: /Vada Pav/i,
  },
  {
    description: 'Descriptive: Triangular fried pastry with spiced potatoes',
    inputName: 'Golden fried triangular pastry filled with spiced potatoes and green peas',
    expectedContainsOrMatch: /Samosa/i,
  },
  {
    description: 'Descriptive: Steamed fermented chickpea flour sponge cake',
    inputName: 'Steamed savory chickpea flour sponge cake with mustard seed tempering',
    expectedContainsOrMatch: /Dhokla/i,
  },
  {
    description: 'Descriptive: Unleavened whole wheat flatbread',
    inputName: 'Thin whole wheat puffed flatbread made on a tawa',
    expectedContainsOrMatch: /Roti/i,
  },
  {
    description: 'Descriptive: Stuffed potato flatbread',
    inputName: 'Whole wheat flatbread stuffed with spiced mashed potatoes and butter',
    expectedContainsOrMatch: /Aloo Paratha/i,
  },
  {
    description: 'Descriptive: Stuffed paneer flatbread',
    inputName: 'Whole wheat flatbread stuffed with seasoned cottage cheese',
    expectedContainsOrMatch: /Paneer Paratha/i,
  },
  {
    description: 'Descriptive: Roasted clay oven spiced chicken',
    inputName: 'Chicken on the bone marinated in yogurt and tandoori spices, charred in clay oven',
    expectedContainsOrMatch: /Tandoori Chicken/i,
  },
  {
    description: 'Descriptive: Chicken in buttery creamy tomato sauce',
    inputName: 'Tender chicken pieces simmered in silky tomato butter sauce with cream',
    expectedContainsOrMatch: /Butter Chicken/i,
  },
  {
    description: 'Descriptive: Deep fried milk solid dumplings in sugar syrup',
    inputName: 'Soft fried milk solid spheres soaked in rose cardamom sugar syrup',
    expectedContainsOrMatch: /Gulab Jamun/i,
  },
  {
    description: 'Descriptive: Crisp spiral sweets soaked in saffron syrup',
    inputName: 'Crispy fried spiral flour batter soaked in saffron sugar syrup',
    expectedContainsOrMatch: /Jalebi/i,
  },
  {
    description: 'Descriptive: Spiced churned yogurt drink',
    inputName: 'Chilled churned yogurt drink tempered with roasted cumin, mint, and black salt',
    expectedContainsOrMatch: /Chaas/i,
  },
  {
    description: 'Descriptive: Spiced tea brewed with milk',
    inputName: 'Strong black tea simmered with milk, crushed ginger, cardamom, and sugar',
    expectedContainsOrMatch: /Chai/i,
  },

  // ==================== 3. Vegetable & Ingredient Detection Combos ====================
  {
    description: 'Combo: Roti + Dal + Sabzi + Rice (Thali)',
    inputName: 'Vegetarian Platter',
    ingredients: [
      { name: 'Wheat Roti', weightGrams: 60 },
      { name: 'Yellow Dal Tadka', weightGrams: 150 },
      { name: 'Aloo Gobi Sabzi', weightGrams: 120 },
      { name: 'Steamed Basmati Rice', weightGrams: 120 },
    ],
    expectedContainsOrMatch: /Thali/i,
  },
  {
    description: 'Combo: Rajma and Rice',
    inputName: 'Nutritious Meal',
    ingredients: [
      { name: 'Kidney bean curry (Rajma)', weightGrams: 200 },
      { name: 'Steamed Rice', weightGrams: 180 },
    ],
    expectedContainsOrMatch: /Rajma Chawal/i,
  },
  {
    description: 'Combo: Chole and Bhature',
    inputName: 'High Protein Dish',
    ingredients: [
      { name: 'Chickpea curry (Chole)', weightGrams: 250 },
      { name: 'Fried leavened bread (Bhatura)', weightGrams: 150 },
    ],
    expectedContainsOrMatch: /Chole Bhature/i,
  },
  {
    description: 'Combo: Dal and Chawal',
    inputName: 'Simple Food',
    ingredients: [
      { name: 'Toor Dal Tadka', weightGrams: 180 },
      { name: 'Steamed Rice', weightGrams: 170 },
    ],
    expectedContainsOrMatch: /Dal|Chawal/i,
  },
  {
    description: 'Combo: Idli and Sambar',
    inputName: 'Breakfast Plate',
    ingredients: [
      { name: 'Steamed idli', weightGrams: 120 },
      { name: 'Lentil vegetable sambar', weightGrams: 180 },
    ],
    expectedContainsOrMatch: /Idli Sambar/i,
  },
  {
    description: 'Combo: Spinach (Palak) + Paneer',
    inputName: 'Green Curry',
    ingredients: [
      { name: 'Palak (Spinach)', weightGrams: 150 },
      { name: 'Fresh Paneer', weightGrams: 120 },
      { name: 'Phulka Roti', weightGrams: 60 },
    ],
    expectedContainsOrMatch: /Palak Paneer/i,
  },
  {
    description: 'Combo: Cauliflower (Gobi) + Potato (Aloo)',
    inputName: 'Stir Fried Vegetables',
    ingredients: [
      { name: 'Aloo (Potato)', weightGrams: 120 },
      { name: 'Gobi (Cauliflower)', weightGrams: 120 },
      { name: 'Roti', weightGrams: 60 },
    ],
    expectedContainsOrMatch: /Aloo Gobi/i,
  },
  {
    description: 'Combo: Mustard Greens (Sarson) + Maize Flour (Makki)',
    inputName: 'Punjabi Winter Meal',
    ingredients: [
      { name: 'Sarson (Mustard Greens)', weightGrams: 200 },
      { name: 'Makki Di Roti', weightGrams: 120 },
    ],
    expectedContainsOrMatch: /Sarson Ka Saag with Makki Di Roti/i,
  },

  // ==================== 4. Regional Cuisines Across All of India ====================
  // --- South India ---
  {
    description: 'Regional South: Pongal',
    inputName: 'Ghee Pongal with coconut chutney',
    expectedContainsOrMatch: /Pongal/i,
  },
  {
    description: 'Regional South: Curd Rice',
    inputName: 'Curd Rice with mustard seed tadka and pomegranate',
    expectedContainsOrMatch: /Curd Rice/i,
  },
  {
    description: 'Regional South: Lemon Rice',
    inputName: 'South Indian Lemon Rice with roasted peanuts and curry leaves',
    expectedContainsOrMatch: /Lemon Rice/i,
  },
  {
    description: 'Regional South: Bisi Bele Bath',
    inputName: 'Bisi Bele Bath with boondi and ghee',
    expectedContainsOrMatch: /Bisi Bele Bath/i,
  },
  {
    description: 'Regional South: Avial with Rice',
    inputName: 'Kerala Avial with steamed rice',
    expectedContainsOrMatch: /Avial/i,
  },
  {
    description: 'Regional South: Appam with Stew',
    inputName: 'Fermented rice Appam with coconut vegetable stew',
    expectedContainsOrMatch: /Appam/i,
  },
  {
    description: 'Regional South: Puttu with Kadala Curry',
    inputName: 'Steamed Puttu with spicy black chickpea Kadala curry',
    expectedContainsOrMatch: /Puttu.*Kadala/i,
  },
  {
    description: 'Regional South: Chettinad Chicken',
    inputName: 'Chettinad Chicken curry with steamed rice',
    expectedContainsOrMatch: /Chettinad Chicken/i,
  },

  // --- West India (Maharashtra, Gujarat, Rajasthan, Goa) ---
  {
    description: 'Regional West: Misal Pav',
    inputName: 'Kolhapuri Misal Pav with farsan and lemon',
    expectedContainsOrMatch: /Misal Pav/i,
  },
  {
    description: 'Regional West: Vada Pav',
    inputName: 'Mumbai Vada Pav with dry garlic chutney',
    expectedContainsOrMatch: /Vada Pav/i,
  },
  {
    description: 'Regional West: Sabudana Khichdi',
    inputName: 'Sabudana Khichdi with roasted peanuts and potatoes',
    expectedContainsOrMatch: /Sabudana Khichdi/i,
  },
  {
    description: 'Regional West: Thalipeeth',
    inputName: 'Maharashtrian multigrain Thalipeeth with white butter',
    expectedContainsOrMatch: /Thalipeeth/i,
  },
  {
    description: 'Regional West: Pithla Bhakri',
    inputName: 'Gram flour Pithla with hot Jowar Bhakri and thecha',
    expectedContainsOrMatch: /Pithla Bhakri/i,
  },
  {
    description: 'Regional West: Khaman Dhokla',
    inputName: 'Steamed yellow Khaman Dhokla with green chillies',
    expectedContainsOrMatch: /Dhokla/i,
  },
  {
    description: 'Regional West: Methi Thepla',
    inputName: 'Gujarati Methi Thepla with curd and pickle',
    expectedContainsOrMatch: /Thepla/i,
  },
  {
    description: 'Regional West: Gujarati Dal Dhokli',
    inputName: 'Sweet and tangy Dal Dhokli with peanuts',
    expectedContainsOrMatch: /Dal Dhokli/i,
  },
  {
    description: 'Regional West: Sev Tameta Nu Shaak',
    inputName: 'Sev Tameta Nu Shaak with phulka roti',
    expectedContainsOrMatch: /Sev Tameta/i,
  },
  {
    description: 'Regional West: Dal Baati Churma',
    inputName: 'Rajasthani Dal Baati Churma with pure desi ghee',
    expectedContainsOrMatch: /Dal Baati Churma/i,
  },
  {
    description: 'Regional West: Gatte Ki Sabzi',
    inputName: 'Rajasthani Gatte Ki Sabzi with bajra roti',
    expectedContainsOrMatch: /Gatte Ki Sabzi/i,
  },
  {
    description: 'Regional West: Goan Fish Curry',
    inputName: 'Goan Fish Curry with kokum and coconut milk served with rice',
    expectedContainsOrMatch: /Goan Fish Curry|Fish Curry/i,
  },

  // --- East India (Bengal, Odisha, Bihar, Assam) ---
  {
    description: 'Regional East: Macher Jhol',
    inputName: 'Bengali Macher Jhol with rohu fish and steamed rice',
    expectedContainsOrMatch: /Macher Jhol/i,
  },
  {
    description: 'Regional East: Kosha Mangsho',
    inputName: 'Spicy Bengali Kosha Mangsho with hot luchi',
    expectedContainsOrMatch: /Kosha Mangsho/i,
  },
  {
    description: 'Regional East: Luchi Alur Dom',
    inputName: 'Golden puffed Luchi with Bengali Alur Dom',
    expectedContainsOrMatch: /Luchi with Alur Dom|Alur Dom/i,
  },
  {
    description: 'Regional East: Shorshe Ilish',
    inputName: 'Shorshe Ilish (Hilsa in mustard gravy) with rice',
    expectedContainsOrMatch: /Shorshe Ilish/i,
  },
  {
    description: 'Regional East: Chingri Malai Curry',
    inputName: 'Prawn Chingri Malai Curry with basmati rice',
    expectedContainsOrMatch: /Chingri Malai/i,
  },
  {
    description: 'Regional East: Odia Dalma',
    inputName: 'Odia Dalma with pumpkin, raw papaya, and rice',
    expectedContainsOrMatch: /Dalma/i,
  },
  {
    description: 'Regional East: Litti Chokha',
    inputName: 'Bihari Litti Chokha with roasted baingan and ghee',
    expectedContainsOrMatch: /Litti Chokha/i,
  },
  {
    description: 'Regional East: Sattu Paratha',
    inputName: 'Sattu Paratha with baingan bharta',
    expectedContainsOrMatch: /Sattu Paratha/i,
  },
  {
    description: 'Regional East: Momos',
    inputName: 'Steamed chicken momos with spicy red garlic chutney',
    expectedContainsOrMatch: /Momos/i,
  },
  {
    description: 'Regional East: Thukpa',
    inputName: 'Himalayan Thukpa noodle soup with vegetables',
    expectedContainsOrMatch: /Thukpa/i,
  },

  // --- Central / Street Food ---
  {
    description: 'Street Food: Pani Puri',
    inputName: 'Pani Puri with spicy mint water and ragda',
    expectedContainsOrMatch: /Pani Puri/i,
  },
  {
    description: 'Street Food: Bhel Puri',
    inputName: 'Bhel Puri with murmura, sev, and tamarind chutney',
    expectedContainsOrMatch: /Bhel Puri/i,
  },
  {
    description: 'Street Food: Aloo Tikki Chaat',
    inputName: 'Crispy Aloo Tikki Chaat with dahi and chutneys',
    expectedContainsOrMatch: /Aloo Tikki Chaat/i,
  },
  {
    description: 'Street Food: Chicken Kathi Roll',
    inputName: 'Kolkata Chicken Kathi Roll with egg and onion',
    expectedContainsOrMatch: /Chicken Kathi Roll/i,
  },

  // --- High Protein & Fitness ---
  {
    description: 'Fitness: Tandoori Grilled Chicken Breast',
    inputName: 'Tandoori Grilled Chicken Breast with mint sauce',
    expectedContainsOrMatch: /Tandoori Grilled Chicken Breast/i,
  },
  {
    description: 'Fitness: Boiled Eggs with Chaat Masala',
    inputName: 'Hard boiled eggs sprinkled with chaat masala',
    expectedContainsOrMatch: /Boiled Eggs/i,
  },
  {
    description: 'Fitness: Paneer Bhurji',
    inputName: 'Paneer Bhurji with multigrain roti',
    expectedContainsOrMatch: /Paneer Bhurji/i,
  },
  {
    description: 'Fitness: Soya Chunks Curry',
    inputName: 'Nutrela Soya Chunks Curry with brown rice',
    expectedContainsOrMatch: /Soya Chunks Curry/i,
  },
  {
    description: 'Fitness: Besan Chilla',
    inputName: 'Besan Chilla with onions and green chutney',
    expectedContainsOrMatch: /Besan Chilla/i,
  },
  {
    description: 'Fitness: Sprouted Moong Chaat',
    inputName: 'Sprouted Moong Chaat with lemon and cucumber',
    expectedContainsOrMatch: /Sprouted Moong Chaat/i,
  },

  // --- Additional North & Regional Indian Classics ---
  {
    description: 'North Indian: Kadhi Pakora with Steamed Rice',
    inputName: 'Gram flour pakora in spiced yogurt curry with steamed rice',
    expectedContainsOrMatch: /Kadhi Pakora/i,
  },
  {
    description: 'North Indian: Mutton Rogan Josh',
    inputName: 'Kashmiri Mutton Rogan Josh with fragrant basmati rice',
    expectedContainsOrMatch: /Rogan Josh/i,
  },
  {
    description: 'North Indian: Matar Paneer with Jeera Rice',
    inputName: 'Matar Paneer curry with jeera rice',
    expectedContainsOrMatch: /Matar Paneer/i,
  },
  {
    description: 'North Indian: Jeera Aloo with Phulka',
    inputName: 'Cumin spiced potatoes with hot phulka roti',
    expectedContainsOrMatch: /Jeera Aloo|Aloo/i,
  },
  {
    description: 'North Indian: Butter Garlic Naan',
    inputName: 'Tandoori naan topped with melted butter and roasted garlic',
    expectedContainsOrMatch: /Naan/i,
  },
  {
    description: 'South Indian: Onion Uttapam',
    inputName: 'Thick fermented rice pancake topped with onions and chillies',
    expectedContainsOrMatch: /Uttapam/i,
  },
  {
    description: 'South Indian: Rasam Rice',
    inputName: 'Pepper tomato rasam poured over steamed basmati rice',
    expectedContainsOrMatch: /Rasam/i,
  },
  {
    description: 'South Indian: Sambar Rice',
    inputName: 'Tangy lentil vegetable sambar mixed with hot rice and ghee',
    expectedContainsOrMatch: /Sambar/i,
  },
  {
    description: 'West Indian: Sev Puri',
    inputName: 'Crispy flat puris topped with potatoes, onions, sev and chutneys',
    expectedContainsOrMatch: /Sev Puri/i,
  },
  {
    description: 'West Indian: Gujarati Undhiyu',
    inputName: 'Traditional mixed vegetable Undhiyu with hot puris',
    expectedContainsOrMatch: /Undhiyu/i,
  },
  {
    description: 'Desserts & Sweets: Gajar Ka Halwa',
    inputName: 'Slow cooked grated red carrots with milk, khoya and dry fruits',
    expectedContainsOrMatch: /Gajar.*Halwa/i,
  },
  {
    description: 'Desserts & Sweets: Rice Kheer',
    inputName: 'Fragrant basmati rice pudding simmered with milk, cardamom and pistachios',
    expectedContainsOrMatch: /Kheer/i,
  },
  {
    description: 'Desserts & Sweets: Rasmalai',
    inputName: 'Spongy chhena dumplings soaked in saffron cardamom milk',
    expectedContainsOrMatch: /Rasmalai/i,
  },
  {
    description: 'Beverage: Sweet Mango Lassi',
    inputName: 'Thick churned sweet yogurt blended with alphonso mango pulp',
    expectedContainsOrMatch: /Lassi/i,
  },
  {
    description: 'Ingredient Detection: Potato + Green Peas (Aloo Matar)',
    inputName: 'Daily Sabzi Meal',
    ingredients: [
      { name: 'Potato (Aloo)', weightGrams: 140 },
      { name: 'Green Peas (Matar)', weightGrams: 100 },
      { name: 'Atta Roti', weightGrams: 60 },
    ],
    expectedContainsOrMatch: /Aloo Matar/i,
  },
  {
    description: 'Ingredient Detection: Okra (Bhindi) + Whole Wheat Roti',
    inputName: 'Home Cooked Dinner',
    ingredients: [
      { name: 'Bhindi (Okra)', weightGrams: 180 },
      { name: 'Ghar Ki Roti', weightGrams: 60 },
    ],
    expectedContainsOrMatch: /Bhindi/i,
  },
  {
    description: 'Ingredient Detection: Roasted Eggplant (Baingan) + Phulka',
    inputName: 'Rustic Lunch',
    ingredients: [
      { name: 'Smoked Baingan', weightGrams: 200 },
      { name: 'Phulka Roti', weightGrams: 60 },
    ],
    expectedContainsOrMatch: /Baingan/i,
  },
  {
    description: 'Ingredient Detection: Fresh Paneer + Green Peas + Rice',
    inputName: 'Vegetarian Dinner',
    ingredients: [
      { name: 'Fresh Paneer', weightGrams: 120 },
      { name: 'Matar', weightGrams: 80 },
      { name: 'Basmati Rice', weightGrams: 150 },
    ],
    expectedContainsOrMatch: /Matar Paneer/i,
  },
];

console.log(`\n=== Running Pan-Indian Meal Scanner Test Suite (${TEST_CASES.length} cases) ===\n`);

let passed = 0;
let failed = 0;
const startTimer = Date.now();

for (let i = 0; i < TEST_CASES.length; i++) {
  const tc = TEST_CASES[i];
  const result = toTypicalIndianMealName(tc.inputName, tc.ingredients, tc.inputDesc);

  let isMatch = false;
  if (typeof tc.expectedContainsOrMatch === 'string') {
    isMatch = result.toLowerCase().includes(tc.expectedContainsOrMatch.toLowerCase());
  } else {
    isMatch = tc.expectedContainsOrMatch.test(result);
  }

  if (isMatch) {
    passed++;
    console.log(`[PASS] #${i + 1}: ${tc.description} -> "${result}"`);
  } else {
    failed++;
    console.error(`[FAIL] #${i + 1}: ${tc.description}`);
    console.error(`       Input: "${tc.inputName}"`);
    console.error(`       Output: "${result}"`);
    console.error(`       Expected: ${tc.expectedContainsOrMatch}`);
  }
}

const duration = Date.now() - startTimer;
console.log(`\nNaming Tests Finished: Passed: ${passed}/${TEST_CASES.length}, Failed: ${failed} in ${duration}ms`);

// ==================== 5. ICMR-NIN Nutrition & Macro Calibration Tests ====================
console.log('\n=== Testing ICMR-NIN Nutrition Calibration Engine ===\n');

let macroTestsPassed = 0;
let macroTestsFailed = 0;

const MACRO_TESTS = [
  {
    dish: 'Paneer Butter Masala with Roti',
    rawGrams: 360,
    rawCals: 600,
    rawProtein: 24,
    minCals: 500,
    maxCals: 700,
    minProtein: 20,
    maxProtein: 30,
  },
  {
    dish: 'Tandoori Grilled Chicken Breast',
    rawGrams: 200,
    rawCals: 270,
    rawProtein: 48,
    minCals: 220,
    maxCals: 320,
    minProtein: 40,
    maxProtein: 55,
  },
  {
    dish: 'Dal Tadka with Steamed Rice',
    rawGrams: 350,
    rawCals: 420,
    rawProtein: 16,
    minCals: 360,
    maxCals: 480,
    minProtein: 12,
    maxProtein: 20,
  },
  {
    dish: 'Idli Sambar with Coconut Chutney',
    rawGrams: 300,
    rawCals: 290,
    rawProtein: 11,
    minCals: 240,
    maxCals: 340,
    minProtein: 8,
    maxProtein: 15,
  },
  {
    dish: 'Chole Bhature with Pickled Onions',
    rawGrams: 400,
    rawCals: 680,
    rawProtein: 21,
    minCals: 580,
    maxCals: 780,
    minProtein: 16,
    maxProtein: 26,
  },
];

for (let j = 0; j < MACRO_TESTS.length; j++) {
  const mt = MACRO_TESTS[j];
  const calib = calibrateIndianMealNutrition(
    mt.dish,
    mt.rawGrams,
    mt.rawCals,
    mt.rawProtein,
    45,
    15,
    5
  );

  const calsOk = calib.calories >= mt.minCals && calib.calories <= mt.maxCals;
  const proteinOk = calib.protein >= mt.minProtein && calib.protein <= mt.maxProtein;
  const weightOk = calib.portionGrams === mt.rawGrams;

  if (calsOk && proteinOk && weightOk) {
    macroTestsPassed++;
    console.log(`[PASS] Macro #${j + 1}: ${mt.dish} -> ${calib.portionGrams}g, ${calib.calories} kcal, ${calib.protein}g protein`);
  } else {
    macroTestsFailed++;
    console.error(`[FAIL] Macro #${j + 1}: ${mt.dish} -> ${calib.calories} kcal (expected ${mt.minCals}-${mt.maxCals}), ${calib.protein}g protein (expected ${mt.minProtein}-${mt.maxProtein})`);
  }
}

// ==================== 6. Vegetable Detection Test ====================
console.log('\n=== Testing Vegetable & Ingredient Detection ===\n');

const sampleMealText = 'Steamed rice with yellow dal, spicy aloo gobi sabzi, and chopped pyaz tamatar salad';
const detectedVegs = detectVegetablesAndIngredients(sampleMealText);
console.log('Detected items from text:', detectedVegs.map(v => v.name).join(', '));

const hasAloo = detectedVegs.some(v => v.name.includes('Aloo'));
const hasGobi = detectedVegs.some(v => v.name.includes('Gobi'));
const hasTamatar = detectedVegs.some(v => v.name.includes('Tamatar'));
const hasDal = detectedVegs.some(v => v.name.includes('Dal'));

if (hasAloo && hasGobi && hasTamatar && hasDal) {
  console.log('[PASS] Vegetable detection correctly identified Aloo, Gobi, Tamatar, and Dal.');
} else {
  console.error('[FAIL] Vegetable detection failed to identify some vegetables.');
  process.exit(1);
}

console.log(`\nAll Tests Completed. Total Passed: ${passed + macroTestsPassed}, Total Failed: ${failed + macroTestsFailed}\n`);

if (failed > 0 || macroTestsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
