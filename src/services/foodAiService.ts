import { MealItem, MealType, Micronutrients } from '../types';
import { toTypicalIndianMealName } from './indianMealNames';
import {
  PAN_INDIAN_DISH_DATABASE,
  calibrateIndianMealNutrition,
  findIndianReferenceDish,
} from './indianNutritionData';
import * as ImageManipulator from 'expo-image-manipulator';

export interface FoodAiAnalysisResult {
  name: string;
  portionGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  confidenceScore: number;
  mealType: MealType;
  micros: Micronutrients;
  description: string;
  ingredients?: Array<{
    name: string;
    weightGrams: number;
  }>;
}

/**
 * Comprehensive Pan-Indian Food Database for manual search and fallback matching.
 * Populated from authoritative ICMR-NIN data covering North, South, West, East, and Central India.
 */
export const COMMON_FOOD_DATABASE: Array<{
  name: string;
  category: string;
  portionGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  micros: Micronutrients;
}> = PAN_INDIAN_DISH_DATABASE.map((dish) => {
  const factor = dish.standardPortionGrams / 100;
  return {
    name: dish.name,
    category: `${dish.category} / Authentic`,
    portionGrams: dish.standardPortionGrams,
    calories: Math.round(dish.caloriesPer100g * factor),
    protein: Math.round(dish.proteinPer100g * factor * 10) / 10,
    carbs: Math.round(dish.carbsPer100g * factor * 10) / 10,
    fat: Math.round(dish.fatPer100g * factor * 10) / 10,
    fiber: Math.round(dish.fiberPer100g * factor * 10) / 10,
    micros: dish.micros || {},
  };
});

/**
 * Compresses meal image to maximum 512px with 60% JPEG quality for ultra-fast scanning.
 */
async function compressImage(base64: string): Promise<string> {
  if (typeof document !== 'undefined') {
    // Web Canvas compression
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_SIZE = 512;
        if (width > MAX_SIZE || height > MAX_SIZE) {
          if (width > height) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        } else {
          resolve(base64);
        }
      };
      img.onerror = () => resolve(base64);
      img.src = base64;
    });
  } else {
    // Native compression using expo-image-manipulator
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        base64,
        [{ resize: { width: 512 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      return `data:image/jpeg;base64,${manipResult.base64}`;
    } catch (e) {
      console.warn('Native compression failed, sending original.', e);
      return base64;
    }
  }
}

/**
 * Ordered by response latency and throughput for fast meal recognition.
 * gemini-3.1-flash-lite delivers the lowest latency for quick scans.
 */
const GEMINI_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.6-flash',
  'gemini-flash-lite-latest',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
];

/**
 * Robustly parses AI JSON output, repairing unclosed strings/brackets or extracting fields via regex fallback.
 */
function parseAndRepairFoodJson(rawText: string): any {
  if (!rawText || !rawText.trim()) {
    throw new Error('Empty AI response');
  }

  let cleaned = rawText.trim();

  // Strip Markdown code fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  cleaned = cleaned.trim();

  // 1. Try direct JSON.parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // Continue to next recovery steps
  }

  // 2. Try extracting substring between first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidateJson = cleaned.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidateJson);
    } catch {
      // Continue to next recovery steps
    }
  }

  // 3. Attempt structural repair for truncated JSON
  let repaired = firstBrace !== -1 ? cleaned.substring(firstBrace) : cleaned;

  // If quote count is odd, close open quote
  const quoteCount = (repaired.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    repaired += '"';
  }

  // Close unclosed arrays
  const openBrackets = (repaired.match(/\[/g) || []).length;
  const closeBrackets = (repaired.match(/\]/g) || []).length;
  for (let i = 0; i < openBrackets - closeBrackets; i++) {
    repaired += ']';
  }

  // Close unclosed objects
  const openBraces = (repaired.match(/\{/g) || []).length;
  const closeBraces = (repaired.match(/\}/g) || []).length;
  for (let i = 0; i < openBraces - closeBraces; i++) {
    repaired += '}';
  }

  try {
    return JSON.parse(repaired);
  } catch {
    // Continue to fallback
  }

  // 4. Regex fallback extraction
  const extractNum = (key: string, defVal: number) => {
    const match = rawText.match(new RegExp(`"${key}"\\s*:\\s*([0-9.]+)`, 'i'));
    return match ? parseFloat(match[1]) : defVal;
  };
  const extractStr = (key: string, defVal: string) => {
    const match = rawText.match(new RegExp(`"${key}"\\s*:\\s*"([^"]*)"?`, 'i'));
    return match ? match[1] : defVal;
  };

  return {
    name: toTypicalIndianMealName(extractStr('name', 'Ghar Ka Khana')),
    portionGrams: extractNum('portionGrams', 300),
    calories: extractNum('calories', 380),
    protein: extractNum('protein', 16),
    carbs: extractNum('carbs', 48),
    fat: extractNum('fat', 12),
    fiber: extractNum('fiber', 4),
    confidenceScore: extractNum('confidenceScore', 0.9),
    mealType: extractStr('mealType', 'lunch'),
    description: extractStr('description', 'AI analyzed meal photo'),
    micros: {},
  };
}

/**
 * Calls Gemini Vision API directly to analyze an uploaded meal photo with high accuracy and speed.
 * Detects vegetables, flours, pulses, and ingredients, maps to authentic Indian dish name,
 * and calibrates macros against ICMR-NIN standards.
 */
export async function analyzeMealPhoto(
  imageUriOrBase64: string,
  retries = 1
): Promise<FoodAiAnalysisResult> {
  try {
    let optimizedImage = imageUriOrBase64;
    if (imageUriOrBase64.startsWith('data:image')) {
      optimizedImage = await compressImage(imageUriOrBase64);
    }

    const apiKey =
      (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
      '';

    let base64Data = optimizedImage;
    let mimeType = 'image/jpeg';
    if (optimizedImage.startsWith('data:')) {
      const matches = optimizedImage.match(/^data:([^;]+);base64,([\s\S]*)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        base64Data = matches[2];
      }
    }
    base64Data = base64Data.replace(/[\r\n\s]/g, '');
    while (base64Data.length % 4 !== 0) {
      base64Data += '=';
    }

    const promptText = `
You are an expert Indian Clinical Dietitian and AI Food Vision Engine.
Analyze this meal photo with maximum precision for authentic Indian cuisine and ingredients.

STEP-BY-STEP ANALYSIS:
1. DETECT EVERY VEGETABLE, GRAIN, PULSE, DAIRY, MEAT & INGREDIENT:
   - Identify all individual vegetables present (e.g., Aloo, Gobi, Palak, Bhindi, Baingan, Tamatar, Pyaz, Matar, Shimla Mirch, Gajar, Methi, Sarson, Lauki, Karela, Turai, Arbi, Sahjan/Drumstick, etc.).
   - Identify all grains/flours (e.g., Atta Roti/Phulka, Basmati Rice, Naan, Bhatura, Paratha, Poha, Rava, Besan).
   - Identify all lentils/pulses (e.g., Toor Dal, Moong Dal, Urad Dal, Chana Dal, Rajma, Chole).
   - Identify all proteins and dairy (e.g., Paneer, Dahi, Chicken, Mutton, Egg, Fish, Prawns, Soya Chunks).
   - Estimate the realistic cooked weight in grams for EACH detected ingredient.

2. AUTHENTIC PAN-INDIAN DISH NAMING:
   - From the detected ingredients and visual presentation, name the authentic, everyday Indian dish (e.g., 'Dal Tadka with Steamed Rice', 'Paneer Butter Masala with Roti', 'Chole Bhature with Pickled Onions', 'Rajma Chawal', 'Idli Sambar with Coconut Chutney', 'Masala Dosa with Sambar & Chutney', 'Aloo Gobi with Roti', 'Palak Paneer with Phulka Roti', 'Pav Bhaji with Buttered Pav', 'Kanda Poha with Peanuts', 'Sarson Ka Saag with Makki Di Roti', 'Chicken Dum Biryani with Raita', 'North Indian Thali', etc.).
   - NEVER use Latin/scientific botanical names (NEVER say 'Lens culinaris', 'Oryza sativa', 'Solanum', etc.).
   - NEVER use sterile mechanical descriptions (do NOT say 'Steamed rice cakes', say 'Idli Sambar'; do NOT say 'Chickpea stew with fried bread', say 'Chole Bhature').

3. NUTRITIONAL CALCULATIONS:
   - Calculate the sum of portion grams from detected ingredients.
   - Accurately calculate total calories (kcal), protein (g), carbs (g), fat (g), fiber (g), and micronutrients (iron, calcium, vitamin C, potassium, sodium) reflecting typical Indian culinary preparation (including tadka/oil/ghee).

Return ONLY valid JSON matching this schema:
{
  "name": "string (typical authentic Indian dish name)",
  "portionGrams": number (total combined meal weight in grams),
  "calories": number (total calories in kcal),
  "protein": number (total protein in grams),
  "carbs": number (total carbs in grams),
  "fat": number (total fat in grams),
  "fiber": number (total fiber in grams),
  "sugar": number (total sugar in grams),
  "confidenceScore": number (0.0 to 1.0),
  "mealType": "string ('breakfast' | 'lunch' | 'dinner' | 'snack')",
  "ingredients": [
    {
      "name": "string (ingredient name, e.g. 'Aloo (Potato)', 'Cauliflower (Gobi)', 'Whole Wheat Roti', 'Ghee')",
      "weightGrams": number (estimated weight in grams)
    }
  ],
  "micros": {
    "iron": number (mg),
    "calcium": number (mg),
    "vitaminC": number (mg),
    "potassium": number (mg),
    "sodium": number (mg),
    "vitaminA": number (mcg)
  },
  "description": "string (summary of detected vegetables, ingredients, and preparation)"
}`;

    const postData = JSON.stringify({
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 3000,
        temperature: 0.2,
      },
    });

    let lastError: Error | null = null;

    for (const model of GEMINI_MODELS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s fast timeout

        // Prioritize direct endpoint for speed, with Vite proxy fallback
        const endpoints = [
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          `/api/gemini/v1beta/models/${model}:generateContent?key=${apiKey}`,
        ];

        let response: Response | null = null;
        for (const ep of endpoints) {
          try {
            const res = await fetch(ep, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
              },
              body: postData,
              signal: controller.signal,
            });
            if (res.ok) {
              response = res;
              break;
            } else if (res.status === 404 && ep.startsWith('/api')) {
              continue;
            } else {
              response = res;
              break;
            }
          } catch (fetchErr: any) {
            if (ep.startsWith('/api')) continue;
            throw fetchErr;
          }
        }

        clearTimeout(timeoutId);

        if (!response || !response.ok) {
          const errBody = response ? await response.text().catch(() => '') : 'No response';
          let detailedMsg = `Status ${response?.status}`;
          try {
            const parsedErr = JSON.parse(errBody);
            if (parsedErr?.error?.message) {
              detailedMsg = parsedErr.error.message;
            }
          } catch {
            detailedMsg = errBody || detailedMsg;
          }
          console.warn(`Gemini model ${model} failed with status:`, response?.status, detailedMsg);
          lastError = new Error(detailedMsg);

          if (response?.status === 503 || response?.status === 429) {
            await new Promise((r) => setTimeout(r, 400));
          }
          continue;
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];

        if (candidate?.finishReason === 'SAFETY') {
          throw new Error('Image blocked by safety filters.');
        }

        const parts = candidate?.content?.parts || [];
        const contentPart = parts.find((p: any) => p.text && !p.thought) || parts.find((p: any) => p.text) || parts[0];
        const textResult = contentPart?.text;
        if (!textResult) {
          console.warn(`Model ${model} returned empty content parts`);
          continue;
        }

        const parsed = parseAndRepairFoodJson(textResult);

        // Guarantee authentic Indian meal naming
        const rawDishName = parsed.name || 'Ghar Ka Khana';
        const indianMealName = toTypicalIndianMealName(
          rawDishName,
          Array.isArray(parsed.ingredients) ? parsed.ingredients : undefined,
          parsed.description
        );

        // Calibrate macros and nutrition against ICMR-NIN Indian food standards
        const calibrated = calibrateIndianMealNutrition(
          indianMealName,
          Number(parsed.portionGrams) || 300,
          Number(parsed.calories) || 380,
          Number(parsed.protein) || 16,
          Number(parsed.carbs) || 48,
          Number(parsed.fat) || 12,
          Number(parsed.fiber) || 4,
          Array.isArray(parsed.ingredients) ? parsed.ingredients : undefined
        );

        const result: FoodAiAnalysisResult = {
          name: indianMealName,
          portionGrams: calibrated.portionGrams,
          calories: calibrated.calories,
          protein: calibrated.protein,
          carbs: calibrated.carbs,
          fat: calibrated.fat,
          fiber: calibrated.fiber,
          confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 0.95,
          mealType: ['breakfast', 'lunch', 'dinner', 'snack'].includes(parsed.mealType)
            ? parsed.mealType
            : 'lunch',
          micros: { ...(parsed.micros || {}), ...calibrated.micros },
          description: parsed.description || 'AI analyzed meal photo',
          ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : undefined,
        };

        return result;
      } catch (err: any) {
        const errorMsg = err?.name === 'AbortError' ? 'AI request timed out.' : (err?.message || String(err));
        console.warn(`Attempt with ${model} encountered error:`, errorMsg);
        lastError = new Error(errorMsg);
      }
    }

    if (lastError) {
      throw lastError;
    }

    throw new Error('AI analysis service was unable to process the image.');
  } catch (err: any) {
    if (retries > 0) {
      console.warn(`analyzeMealPhoto failed, retrying... (${retries} retries left)`);
      return analyzeMealPhoto(imageUriOrBase64, retries - 1);
    }
    console.error('Error in analyzeMealPhoto:', err);
    throw err;
  }
}

/**
 * Scale meal macros based on user adjusted weight/portion size.
 */
export function scaleMealItemByPortion(baseItem: FoodAiAnalysisResult, newPortionGrams: number): FoodAiAnalysisResult {
  if (baseItem.portionGrams <= 0 || newPortionGrams <= 0) return baseItem;

  const ratio = newPortionGrams / baseItem.portionGrams;
  return {
    ...baseItem,
    portionGrams: Math.round(newPortionGrams),
    calories: Math.round(baseItem.calories * ratio),
    protein: Math.round(baseItem.protein * ratio * 10) / 10,
    carbs: Math.round(baseItem.carbs * ratio * 10) / 10,
    fat: Math.round(baseItem.fat * ratio * 10) / 10,
    fiber: Math.round(baseItem.fiber * ratio * 10) / 10,
    micros: {
      iron: baseItem.micros.iron ? Math.round(baseItem.micros.iron * ratio * 10) / 10 : undefined,
      calcium: baseItem.micros.calcium ? Math.round(baseItem.micros.calcium * ratio) : undefined,
      vitaminC: baseItem.micros.vitaminC ? Math.round(baseItem.micros.vitaminC * ratio) : undefined,
      potassium: baseItem.micros.potassium ? Math.round(baseItem.micros.potassium * ratio) : undefined,
      sodium: baseItem.micros.sodium ? Math.round(baseItem.micros.sodium * ratio) : undefined,
      vitaminA: baseItem.micros.vitaminA ? Math.round(baseItem.micros.vitaminA * ratio) : undefined,
    },
  };
}
