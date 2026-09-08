import { ActivityLevel, BMRResult, FitnessGoal, Gender, UserProfile } from '../types';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  extra: 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, { label: string; desc: string }> = {
  sedentary: { label: 'Sedentary', desc: 'Little to no exercise, desk job' },
  light: { label: 'Lightly Active', desc: '1-3 days/week light exercise or sports' },
  moderate: { label: 'Moderately Active', desc: '3-5 days/week moderate exercise' },
  active: { label: 'Very Active', desc: '6-7 days/week hard exercise/sports' },
  extra: { label: 'Extra Active', desc: 'Very physical job or 2x/day training' },
};

/**
 * Calculates BMR using the Mifflin-St Jeor formula:
 * Male: 10 * weight + 6.25 * height - 5 * age + 5
 * Female: 10 * weight + 6.25 * height - 5 * age - 161
 */
export function calculateBMR(weightKg: number, heightCm: number, ageYears: number, gender: Gender, bodyFat?: number): number {
  if (!weightKg || !heightCm || !ageYears) return 2000;
  
  if (bodyFat !== undefined && bodyFat > 0) {
    const lbm = weightKg * (1 - bodyFat / 100);
    return 370 + (21.6 * lbm);
  }
  
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  if (gender === 'male') {
    return base + 5;
  } else if (gender === 'female') {
    return base - 161;
  } else {
    return base - 78; // average offset for gender-neutral
  }
}

/**
 * Calculates TDEE based on BMR and Activity Level.
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
}

/**
 * Calculates Target Calories and Macro Split (Protein, Fat, Carbs) based on user goal and parameters.
 */
export function calculateMacros(profile: Partial<UserProfile>): BMRResult {
  const weight = profile.weight || 70;
  const height = profile.height || 175;
  const age = profile.age || 25;
  const gender = profile.gender || 'male';
  const activity = profile.activityLevel || 'moderate';
  const goal: FitnessGoal = profile.goal || 'recomp';
  const recompDeficit = profile.recompDeficit ?? 7.5;
  const bodyFat = profile.bodyFat;

  const bmr = Math.round(calculateBMR(weight, height, age, gender, bodyFat));
  const tdee = calculateTDEE(bmr, activity);

  let calorieAdjustmentMultiplier = 1.0;
  let proteinRatio = 2.0; // grams per kg
  let goalExplanation = '';

  switch (goal) {
    case 'bulk':
      calorieAdjustmentMultiplier = 1.15; // +15%
      proteinRatio = profile.customProteinRatio || 1.8; // 1.8 g/kg
      goalExplanation = 'Caloric surplus of +15% to support clean muscle hypertrophy.';
      break;
    case 'cut':
      calorieAdjustmentMultiplier = 0.80; // -20%
      proteinRatio = profile.customProteinRatio || 2.2; // 2.2 g/kg
      goalExplanation = 'Caloric deficit of -20% for fat loss while preserving lean mass.';
      break;
    case 'maintain':
      calorieAdjustmentMultiplier = 1.0; // 0%
      proteinRatio = profile.customProteinRatio || 1.8;
      goalExplanation = 'Maintenance calories to preserve current body weight and composition.';
      break;
    case 'recomp':
      // Recomp: maintenance calories (TDEE * 1.00)
      calorieAdjustmentMultiplier = 1.0;
      proteinRatio = profile.customProteinRatio || 2.0; // 2.0 g/kg
      goalExplanation = `Body Recomposition: Maintenance calories with high protein (2.0g/kg) to build muscle while shedding fat.`;
      break;
  }

  const targetCalories = Math.round(tdee * calorieAdjustmentMultiplier);

  // Protein calculation
  const proteinGrams = Math.round(weight * proteinRatio);
  const proteinCalories = proteinGrams * 4;

  // Fat calculation (25% of goal calories)
  const fatCalories = Math.round(targetCalories * 0.25);
  const fatGrams = Math.round(fatCalories / 9);

  // Carbs calculation (remainder)
  const carbCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
  const carbGrams = Math.round(carbCalories / 4);

  // Fiber calculation (14g per 1000 kcal)
  const fiberGrams = Math.round((targetCalories / 1000) * 14);

  // Micros targets
  const micros = {
    vitaminA: 900, // mcg
    vitaminC: 90,  // mg
    vitaminD: 20,  // mcg
    vitaminE: 15,  // mg
    vitaminK: 120, // mcg
    vitaminB12: 2.4, // mcg
    folate: 400, // mcg
    calcium: 1000, // mg
    iron: 10,      // mg
    magnesium: 400, // mg
    potassium: 3400, // mg
    zinc: 11,      // mg
    sodium: 2300,  // mg (limit)
  };

  // Water calculation (liters)
  let waterIntake = weight * 0.033; // roughly 33ml per kg
  if (activity === 'active' || activity === 'extra') {
    waterIntake += 0.5; // add 500ml for high activity
  }
  waterIntake = Math.round(waterIntake * 10) / 10;

  return {
    bmr,
    tdee,
    targetCalories,
    proteinGrams,
    fatGrams,
    carbGrams,
    proteinCalories,
    fatCalories,
    carbCalories,
    fiberGrams,
    micros,
    waterIntake,
    goalExplanation,
  };
}

/**
 * Formats macro progress numbers for UI displays
 */
export function getMacroPercentage(consumed: number, target: number): number {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((consumed / target) * 100));
}
