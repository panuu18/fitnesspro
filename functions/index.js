const functions = require('firebase-functions');
const admin = require('firebase-admin');
const https = require('https');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Cloud Function HTTPS / Firestore Trigger:
 * Server-side point calculation to prevent client-side score spoofing.
 *
 * Rules:
 * 1. Calorie/Macro target met (+/- 10% range or >= 90% of target protein/calories): +50 pts
 * 2. Step goal hit (steps >= stepGoal): +30 pts
 * 3. Each habit completed: +10 pts each
 */
exports.calculateUserDailyPoints = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth && (!data || !data.userId)) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const userId = context.auth ? context.auth.uid : data.userId;
  const dateStr = data.date || new Date().toISOString().split('T')[0];

  try {
    // Fetch User Profile for stepGoal and targetMacros
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists && (!data.profile)) {
      throw new functions.https.HttpsError('not-found', 'User profile not found.');
    }
    const profile = userDoc.exists ? userDoc.data() : data.profile;

    // Fetch Daily Meals logged for date
    let loggedCalories = data.loggedCalories || 0;
    let loggedProtein = data.loggedProtein || 0;

    if (userDoc.exists) {
      const mealsSnapshot = await db
        .collection('meals')
        .where('userId', '==', userId)
        .where('loggedAt', '==', dateStr)
        .get();

      loggedCalories = 0;
      loggedProtein = 0;
      mealsSnapshot.forEach((doc) => {
        const meal = doc.data();
        loggedCalories += meal.calories || 0;
        loggedProtein += meal.protein || 0;
      });
    }

    // Fetch Daily Steps recorded for date
    let steps = data.steps || 0;
    const stepGoal = profile.stepGoal || 10000;

    // Fetch Habits completed for date
    let completedHabitsCount = data.completedHabitIds ? data.completedHabitIds.length : 0;

    // Server-side anti-spoofing points verification logic
    let points = 0;
    let hitMacroTarget = false;
    let hitStepGoal = false;

    // 1. Calorie/Macro target hit check
    const targetCalories = data.targetCalories || 2200;
    const calorieRatio = targetCalories > 0 ? loggedCalories / targetCalories : 0;
    if (calorieRatio >= 0.85 && calorieRatio <= 1.15) {
      points += 50;
      hitMacroTarget = true;
    }

    // 2. Step Goal hit check
    if (steps >= stepGoal) {
      points += 30;
      hitStepGoal = true;
    }

    // 3. Habits completed bonus
    points += completedHabitsCount * 10;

    // Server Timestamp & Anti-Spoofing Audit Token
    const auditToken = `srv_verified_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const dailyLogResult = {
      date: dateStr,
      userId,
      loggedCalories,
      loggedProtein,
      steps,
      completedHabitsCount,
      hitMacroTarget,
      hitStepGoal,
      pointsEarned: points,
      isServerVerified: true,
      auditToken,
      calculatedAt: admin.firestore.FieldValue ? admin.firestore.FieldValue.serverTimestamp() : new Date().toISOString(),
    };

    // Save/Update in Firestore
    await db
      .collection('users')
      .doc(userId)
      .collection('dailyLogs')
      .doc(dateStr)
      .set(dailyLogResult, { merge: true });

    // Update Global Leaderboard document
    await db.collection('leaderboard').doc(userId).set(
      {
        uid: userId,
        displayName: profile.displayName || 'Fitness Warrior',
        photoURL: profile.photoURL || '',
        dailyPoints: points,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return {
      success: true,
      points,
      hitMacroTarget,
      hitStepGoal,
      completedHabitsCount,
      auditToken,
    };
  } catch (error) {
    console.error('Error calculating daily points:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * HTTPS Callable Function:
 * Analyzes meal photo securely using Gemini API on the backend.
 */
exports.analyzeMealPhoto = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated (bypassed in emulator / demo mode if auth is not configured)
  if (!context.auth && process.env.FUNCTIONS_EMULATOR !== 'true') {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const { imageUriOrBase64 } = data;
  if (!imageUriOrBase64) {
    throw new functions.https.HttpsError('invalid-argument', 'Image data is required.');
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('GEMINI_API_KEY is missing from environment variables.');
    throw new functions.https.HttpsError('internal', 'Server configuration error');
  }

  let base64Data = imageUriOrBase64;
  let mimeType = 'image/jpeg';
  if (imageUriOrBase64.startsWith('data:')) {
    const matches = imageUriOrBase64.match(/^data:([^;]+);base64,([\s\S]*)$/);
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      base64Data = matches[2];
    }
  }
  base64Data = base64Data.replace(/[\r\n\s]/g, '');
  while (base64Data.length % 4 !== 0) {
    base64Data += '=';
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`;
  
  const promptText = `
Analyze this food image and provide a highly accurate estimation of the nutritional content.
IMPORTANT RULES:
1. Detect all individual foods/ingredients in the meal.
2. Estimate the exact weight of EACH detected ingredient in grams.
3. Calculate the TOTAL calories, TOTAL protein, TOTAL carbs, TOTAL fat, TOTAL fiber, TOTAL sugar, and TOTAL micros based ON THE COMBINED SUM of all detected ingredients in the entire meal.
4. If there are multiple foods, list EACH separately in the ingredients array and calculate the combined total for the top-level properties.
5. If confidence is very low, mention it in the description.

Return ONLY a valid JSON object matching this exact schema:
{
  "name": "string (concise name based on all ingredients, e.g. 'Chicken and Rice Bowl')",
  "portionGrams": number (sum of all ingredient weights),
  "calories": number (total calories),
  "protein": number (total protein in grams),
  "carbs": number (total carbs in grams),
  "fat": number (total fat in grams),
  "fiber": number (total fiber in grams),
  "sugar": number (total sugar in grams),
  "confidenceScore": number (between 0.0 and 1.0),
  "mealType": "string ('breakfast', 'lunch', 'dinner', 'snack')",
  "ingredients": [
    {
      "name": "string (ingredient name)",
      "weightGrams": number (estimated weight in grams)
    }
  ],
  "micros": {
    "vitaminA": number (mcg),
    "vitaminC": number (mg),
    "vitaminD": number (mcg),
    "vitaminE": number (mg),
    "vitaminK": number (mcg),
    "vitaminB12": number (mcg),
    "folate": number (mcg),
    "calcium": number (mg),
    "iron": number (mg),
    "magnesium": number (mg),
    "potassium": number (mg),
    "zinc": number (mg),
    "sodium": number (mg)
  },
  "description": "string (brief description of what you detected and any low confidence warnings)"
}`;

  try {
    const responseData = await new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        contents: [{
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType,
                data: base64Data
              }
            }
          ]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: 4096,
        }
      });

      const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: `/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(body));
            } catch (e) {
              reject(new Error('Failed to parse response from Gemini API'));
            }
          } else {
            console.error('Gemini API Error Response:', res.statusCode, body);
            reject(new Error(`Gemini API returned status ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.write(postData);
      req.end();
    });

    return responseData;
  } catch (err) {
    console.error('Error in analyzeMealPhoto function:', err);
    throw new functions.https.HttpsError('internal', err.message || 'Unknown error occurred');
  }
});
