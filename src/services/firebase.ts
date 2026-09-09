import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getAuth, signInAnonymously, onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import type { UserProfile, MealItem, Habit, LeaderboardEntry, DailyLog } from '../types/index.ts';
import { getTodayDateString } from './stepTracker.ts';

// Firebase configuration (Supports live project or demo mode)
const firebaseConfig = {
  apiKey: "AIzaSyDemoKey_FitPulseProApp_2026",
  authDomain: "fitpulse-pro.firebaseapp.com",
  projectId: "fitpulse-pro",
  storageBucket: "fitpulse-pro.appspot.com",
  messagingSenderId: "109823471092",
  appId: "1:109823471092:web:a1b2c3d4e5f67890"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// In development mode with local emulator active, connect emulator
if (typeof import.meta !== 'undefined' && import.meta.env?.DEV && process.env.USE_FIREBASE_EMULATOR === 'true') {
  try {
    connectFunctionsEmulator(functions, window.location.hostname, 5001);
  } catch (e) {
    // Emulator connection optional
  }
}

// Automatically authenticate anonymously if configured with live credentials
if (!firebaseConfig.apiKey.startsWith('AIzaSyDemoKey')) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      signInAnonymously(auth).catch((err) => {
        console.warn('Anonymous auth failed:', err);
      });
    }
  });
}

// Local Storage Keys for offline / demo mode
const STORAGE_KEYS = {
  PROFILE: 'fitpulse_user_profile_v1',
  MEALS: 'fitpulse_meal_items_v1',
  HABITS: 'fitpulse_habits_v1',
  LEADERBOARD: 'fitpulse_leaderboard_v1',
};

// Default Initial Profile
export const DEFAULT_USER_PROFILE: UserProfile = {
  uid: 'user_local_demo_101',
  displayName: 'Alex Rivers',
  email: 'alex.fitness@example.com',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  age: 26,
  gender: 'male',
  height: 180, // cm
  weight: 78, // kg
  activityLevel: 'moderate',
  goal: 'recomp',
  recompDeficit: 7.5,
  stepGoal: 10000,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Default Initial Habits
export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit_1',
    userId: 'user_local_demo_101',
    title: 'Reading (20 mins)',
    category: 'Reading',
    icon: 'book-open',
    targetDaysPerWeek: 7,
    currentStreak: 5,
    bestStreak: 12,
    completedDates: [getTodayDateString()],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit_2',
    userId: 'user_local_demo_101',
    title: 'Mindful Meditation',
    category: 'Meditation',
    icon: 'smile',
    targetDaysPerWeek: 5,
    currentStreak: 3,
    bestStreak: 7,
    completedDates: [getTodayDateString()],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit_3',
    userId: 'user_local_demo_101',
    title: 'Morning 5K Run',
    category: 'Running',
    icon: 'activity',
    targetDaysPerWeek: 4,
    currentStreak: 2,
    bestStreak: 5,
    completedDates: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit_4',
    userId: 'user_local_demo_101',
    title: 'Heavy Gym Workout',
    category: 'Gym',
    icon: 'dumbbell',
    targetDaysPerWeek: 5,
    currentStreak: 4,
    bestStreak: 14,
    completedDates: [getTodayDateString()],
    createdAt: new Date().toISOString(),
  },
];

// Default Initial Meals for today
export const DEFAULT_MEALS: MealItem[] = [
  {
    id: 'meal_101',
    userId: 'user_local_demo_101',
    name: 'Kanda Poha with Boiled Eggs',
    mealType: 'breakfast',
    calories: 420,
    protein: 22,
    carbs: 48,
    fat: 16,
    fiber: 6,
    portionGrams: 280,
    loggedAt: getTodayDateString(),
    confidenceScore: 0.96,
    isAiDetected: true,
  },
  {
    id: 'meal_102',
    userId: 'user_local_demo_101',
    name: 'Dal Tadka with Steamed Basmati Rice & Roti',
    mealType: 'lunch',
    calories: 560,
    protein: 24,
    carbs: 78,
    fat: 15,
    fiber: 10,
    portionGrams: 380,
    loggedAt: getTodayDateString(),
    confidenceScore: 0.98,
    isAiDetected: true,
  },
];

// Global Initial Leaderboard
export const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  {
    uid: 'user_apex_1',
    displayName: 'Sarah Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    totalPoints: 2450,
    dailyPoints: 120,
    weeklyPoints: 780,
    rank: 1,
    streak: 18,
    hitMacrosCount: 18,
    hitStepsCount: 17,
    habitsCompletedCount: 68,
    badge: 'Apex',
  },
  {
    uid: 'user_local_demo_101',
    displayName: 'Alex Rivers (You)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    totalPoints: 2180,
    dailyPoints: 110,
    weeklyPoints: 690,
    rank: 2,
    streak: 12,
    hitMacrosCount: 15,
    hitStepsCount: 14,
    habitsCompletedCount: 52,
    badge: 'Titan',
  },
  {
    uid: 'user_warrior_2',
    displayName: 'Marcus Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    totalPoints: 1940,
    dailyPoints: 90,
    weeklyPoints: 610,
    rank: 3,
    streak: 9,
    hitMacrosCount: 13,
    hitStepsCount: 12,
    habitsCompletedCount: 44,
    badge: 'Warrior',
  },
  {
    uid: 'user_challenger_3',
    displayName: 'Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    totalPoints: 1680,
    dailyPoints: 80,
    weeklyPoints: 520,
    rank: 4,
    streak: 7,
    hitMacrosCount: 11,
    hitStepsCount: 10,
    habitsCompletedCount: 38,
    badge: 'Challenger',
  },
  {
    uid: 'user_rookie_4',
    displayName: 'Jordan Smith',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    totalPoints: 1320,
    dailyPoints: 60,
    weeklyPoints: 410,
    rank: 5,
    streak: 4,
    hitMacrosCount: 8,
    hitStepsCount: 7,
    habitsCompletedCount: 26,
    badge: 'Rookie',
  },
];

// Profile Service Functions
export function getUserProfileKey(uid?: string): string {
  return uid ? `fitpulse_user_profile_${uid}` : STORAGE_KEYS.PROFILE;
}

export function getMealsKey(uid?: string): string {
  return uid ? `fitpulse_meal_items_${uid}` : STORAGE_KEYS.MEALS;
}

export function getHabitsKey(uid?: string): string {
  return uid ? `fitpulse_habits_${uid}` : STORAGE_KEYS.HABITS;
}

export function loadUserProfile(uid?: string, fallbackEmail?: string, fallbackName?: string): UserProfile {
  const key = getUserProfileKey(uid);
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);

    // Also check legacy key if demo user
    if (!uid || uid === DEFAULT_USER_PROFILE.uid) {
      const legacyRaw = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (legacyRaw) return JSON.parse(legacyRaw);
    }
  } catch (e) {
    console.warn('Profile read error:', e);
  }

  // Create initial profile for user
  const initialProfile: UserProfile = {
    ...DEFAULT_USER_PROFILE,
    uid: uid || DEFAULT_USER_PROFILE.uid,
    displayName: fallbackName || (uid === DEFAULT_USER_PROFILE.uid ? DEFAULT_USER_PROFILE.displayName : 'Fitness Pro Member'),
    email: fallbackEmail || (uid === DEFAULT_USER_PROFILE.uid ? DEFAULT_USER_PROFILE.email : 'member@fitnesspro.app'),
    photoURL: uid === DEFAULT_USER_PROFILE.uid ? DEFAULT_USER_PROFILE.photoURL : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveUserProfile(initialProfile);
  return initialProfile;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    const key = getUserProfileKey(profile.uid);
    localStorage.setItem(key, JSON.stringify(profile));
    if (profile.uid === DEFAULT_USER_PROFILE.uid) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    }
  } catch (e) {
    console.warn('Profile write error:', e);
  }
}

// Meals Service Functions
export function loadMealItems(uid?: string): MealItem[] {
  const key = getMealsKey(uid);
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);

    // Legacy fallback for demo user
    if (!uid || uid === DEFAULT_USER_PROFILE.uid) {
      const legacy = localStorage.getItem(STORAGE_KEYS.MEALS);
      if (legacy) return JSON.parse(legacy);
      saveMealItems(DEFAULT_MEALS, uid);
      return DEFAULT_MEALS;
    }
  } catch (e) {
    console.warn('Meals read error:', e);
  }
  // For new users, start with empty meals list
  return [];
}

export function saveMealItems(meals: MealItem[], uid?: string): void {
  try {
    const key = getMealsKey(uid || (meals.length > 0 ? meals[0].userId : undefined));
    localStorage.setItem(key, JSON.stringify(meals));
  } catch (e) {
    console.warn('Meals write error:', e);
  }
}

export function addMealItem(newMeal: MealItem, uid?: string): MealItem[] {
  const userId = uid || newMeal.userId;
  const current = loadMealItems(userId);
  const updated = [newMeal, ...current];
  saveMealItems(updated, userId);
  return updated;
}

export function deleteMealItem(mealId: string, uid?: string): MealItem[] {
  const current = loadMealItems(uid);
  const updated = current.filter((m) => m.id !== mealId);
  saveMealItems(updated, uid);
  return updated;
}

// Habits Service Functions
export function loadHabits(uid?: string): Habit[] {
  const key = getHabitsKey(uid);
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);

    // If demo user, return demo habits
    if (!uid || uid === DEFAULT_USER_PROFILE.uid) {
      const legacy = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (legacy) return JSON.parse(legacy);
      saveHabits(DEFAULT_HABITS, uid);
      return DEFAULT_HABITS;
    }
  } catch (e) {
    console.warn('Habits read error:', e);
  }

  // Personalized starter habits for new registered user
  const effectiveUid = uid || 'user_new';
  const initialHabits: Habit[] = [
    {
      id: `habit_1_${effectiveUid}`,
      userId: effectiveUid,
      title: 'Daily Morning Hydration (1L)',
      category: 'Custom',
      icon: 'activity',
      targetDaysPerWeek: 7,
      currentStreak: 0,
      bestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: `habit_2_${effectiveUid}`,
      userId: effectiveUid,
      title: 'Mindful Meditation (15 mins)',
      category: 'Meditation',
      icon: 'smile',
      targetDaysPerWeek: 5,
      currentStreak: 0,
      bestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: `habit_3_${effectiveUid}`,
      userId: effectiveUid,
      title: 'Gym Workout Session',
      category: 'Gym',
      icon: 'dumbbell',
      targetDaysPerWeek: 4,
      currentStreak: 0,
      bestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    },
  ];
  saveHabits(initialHabits, effectiveUid);
  return initialHabits;
}

export function saveHabits(habits: Habit[], uid?: string): void {
  try {
    const key = getHabitsKey(uid || (habits.length > 0 ? habits[0].userId : undefined));
    localStorage.setItem(key, JSON.stringify(habits));
  } catch (e) {
    console.warn('Habits write error:', e);
  }
}

export function toggleHabitCompletion(
  habitId: string,
  dateStr: string = getTodayDateString(),
  uid?: string
): Habit[] {
  const habits = loadHabits(uid);
  const updated = habits.map((h) => {
    if (h.id === habitId) {
      const isDone = h.completedDates.includes(dateStr);
      let newDates: string[];
      let newStreak = h.currentStreak;

      if (isDone) {
        newDates = h.completedDates.filter((d) => d !== dateStr);
        newStreak = Math.max(0, h.currentStreak - 1);
      } else {
        newDates = [...h.completedDates, dateStr];
        newStreak = h.currentStreak + 1;
      }
      return {
        ...h,
        completedDates: newDates,
        currentStreak: newStreak,
        bestStreak: Math.max(h.bestStreak, newStreak),
      };
    }
    return h;
  });
  saveHabits(updated, uid);
  return updated;
}

// Leaderboard Service Functions
export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Leaderboard read error:', e);
  }
  saveLeaderboard(DEFAULT_LEADERBOARD);
  return DEFAULT_LEADERBOARD;
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(entries));
  } catch (e) {
    console.warn('Leaderboard write error:', e);
  }
}

export function updateLeaderboardProfile(profile: UserProfile): LeaderboardEntry[] {
  const lb = loadLeaderboard();
  let userFound = false;
  const updatedLb = lb.map((entry) => {
    if (entry.uid === profile.uid || entry.displayName.includes('(You)')) {
      userFound = true;
      return {
        ...entry,
        uid: profile.uid,
        displayName: profile.displayName.includes('(You)')
          ? profile.displayName
          : `${profile.displayName} (You)`,
        avatarUrl: profile.photoURL || entry.avatarUrl,
      };
    }
    return entry;
  });

  if (!userFound) {
    updatedLb.push({
      uid: profile.uid,
      displayName: `${profile.displayName} (You)`,
      avatarUrl:
        profile.photoURL ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      totalPoints: 2000,
      dailyPoints: 0,
      weeklyPoints: 600,
      rank: updatedLb.length + 1,
      streak: 1,
      hitMacrosCount: 0,
      hitStepsCount: 0,
      habitsCompletedCount: 0,
      badge: 'Rookie',
    });
  }

  saveLeaderboard(updatedLb);
  return updatedLb;
}
