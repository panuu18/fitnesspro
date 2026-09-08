export type Gender = 'male' | 'female' | 'other';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'extra';

export type FitnessGoal = 'bulk' | 'cut' | 'maintain' | 'recomp';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type HabitCategory = 'Reading' | 'Meditation' | 'Running' | 'Gym' | 'Custom';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  bodyFat?: number; // in %
  activityLevel: ActivityLevel;
  goal: FitnessGoal;
  recompDeficit: number; // 5-10%
  stepGoal: number; // e.g. 10000
  customProteinRatio?: number; // g/kg override if desired
  createdAt: string;
  updatedAt: string;
}

export interface BMRResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinGrams: number;
  fatGrams: number;
  carbGrams: number;
  proteinCalories: number;
  fatCalories: number;
  carbCalories: number;
  fiberGrams: number;
  micros: Micronutrients;
  waterIntake: number; // in liters
  goalExplanation: string;
}

export interface Micronutrients {
  // Vitamins
  vitaminA?: number; // mcg
  vitaminC?: number; // mg
  vitaminD?: number; // mcg
  vitaminE?: number; // mg
  vitaminK?: number; // mcg
  vitaminB12?: number; // mcg
  folate?: number; // mcg
  // Minerals
  calcium?: number; // mg
  iron?: number; // mg
  magnesium?: number; // mg
  potassium?: number; // mg
  sodium?: number; // mg
  zinc?: number; // mg
}

export interface MealItem {
  id: string;
  userId: string;
  name: string;
  mealType: MealType;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber?: number; // grams
  micros?: Micronutrients;
  photoUrl?: string;
  portionGrams: number;
  loggedAt: string; // ISO String or YYYY-MM-DD
  confidenceScore?: number; // 0 to 1 for AI food detection
  isAiDetected?: boolean;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  category: HabitCategory;
  icon: string;
  targetDaysPerWeek: number;
  currentStreak: number;
  bestStreak: number;
  completedDates: string[]; // ['2026-07-26', ...]
  createdAt: string;
}

export interface DailyStepRecord {
  date: string; // YYYY-MM-DD
  steps: number;
  goal: number;
  distanceKm: number;
  caloriesBurned: number;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  avatarUrl: string;
  totalPoints: number;
  dailyPoints: number;
  weeklyPoints: number;
  rank?: number;
  streak: number;
  hitMacrosCount: number;
  hitStepsCount: number;
  habitsCompletedCount: number;
  badge: 'Apex' | 'Titan' | 'Warrior' | 'Challenger' | 'Rookie';
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  userId: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  steps: number;
  completedHabitIds: string[];
  pointsEarned: number;
  isServerVerified: boolean;
}
