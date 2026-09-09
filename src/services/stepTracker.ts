import type { DailyStepRecord } from '../types/index.ts';

const STEP_STORAGE_KEY = 'fitpulse_daily_steps_v1';

export function getTodayDateString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function getPast7DaysDates(): string[] {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export function getDayAbbreviation(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
}

/**
 * Generates initial 7-day step history if none exists in storage.
 */
export function getInitial7DayStepHistory(targetGoal: number = 10000): DailyStepRecord[] {
  const dates = getPast7DaysDates();
  const sampleSteps = [8420, 10250, 9150, 11400, 7800, 12300, 6400];

  return dates.map((date, idx) => {
    const isToday = idx === 6;
    const steps = isToday ? (sampleSteps[6] || 6400) : sampleSteps[idx];
    const distanceKm = Math.round((steps * 0.00078) * 10) / 10;
    const caloriesBurned = Math.round(steps * 0.04);
    return {
      date,
      steps,
      goal: targetGoal,
      distanceKm,
      caloriesBurned,
    };
  });
}

export function getStepStorageKey(uid?: string): string {
  return uid ? `fitpulse_daily_steps_${uid}` : STEP_STORAGE_KEY;
}

/**
 * Loads step records from local storage or initializes defaults.
 */
export function loadStepRecordsFromStorage(targetGoal: number = 10000, uid?: string): DailyStepRecord[] {
  const key = getStepStorageKey(uid);
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed: DailyStepRecord[] = JSON.parse(data);
      
      // Prevent duplicates: keep only the latest entry per date
      const uniqueRecords = Array.from(new Map(parsed.map(item => [item.date, item])).values());
      
      // Sort chronologically
      uniqueRecords.sort((a, b) => a.date.localeCompare(b.date));

      // Ensure today's date exists in records
      const todayStr = getTodayDateString();
      const hasToday = uniqueRecords.some((r) => r.date === todayStr);
      if (!hasToday) {
        uniqueRecords.push({
          date: todayStr,
          steps: uid && uid !== 'user_local_demo_101' ? 0 : 4200,
          goal: targetGoal,
          distanceKm: uid && uid !== 'user_local_demo_101' ? 0 : 3.2,
          caloriesBurned: uid && uid !== 'user_local_demo_101' ? 0 : 168,
        });
      }
      
      const finalRecords = uniqueRecords.slice(-7);
      saveStepRecordsToStorage(finalRecords, uid);
      return finalRecords;
    }
  } catch (err) {
    console.warn('Step storage read error:', err);
  }
  const initial = getInitial7DayStepHistory(targetGoal);
  saveStepRecordsToStorage(initial, uid);
  return initial;
}

/**
 * Saves step records to local storage.
 */
export function saveStepRecordsToStorage(records: DailyStepRecord[], uid?: string) {
  try {
    const key = getStepStorageKey(uid);
    localStorage.setItem(key, JSON.stringify(records));
  } catch (err) {
    console.warn('Step storage write error:', err);
  }
}

/**
 * Increment today's step count (for pedometer sensor updates or simulation).
 */
export function addStepsToToday(records: DailyStepRecord[], delta: number, goal: number): DailyStepRecord[] {
  const todayStr = getTodayDateString();
  let updated = false;

  const newRecords = records.map((rec) => {
    if (rec.date === todayStr) {
      updated = true;
      const newSteps = Math.max(0, rec.steps + delta);
      return {
        ...rec,
        steps: newSteps,
        goal,
        distanceKm: Math.round((newSteps * 0.00078) * 10) / 10,
        caloriesBurned: Math.round(newSteps * 0.04),
      };
    }
    return rec;
  });

  if (!updated) {
    newRecords.push({
      date: todayStr,
      steps: delta,
      goal,
      distanceKm: Math.round((delta * 0.00078) * 10) / 10,
      caloriesBurned: Math.round(delta * 0.04),
    });
  }

  const finalRecords = newRecords.slice(-7);
  saveStepRecordsToStorage(finalRecords);
  return finalRecords;
}

/**
 * Set today's exact step count (for native pedometer daily total).
 */
export function setTodaySteps(records: DailyStepRecord[], steps: number, goal: number): DailyStepRecord[] {
  const todayStr = getTodayDateString();
  let updated = false;

  const newRecords = records.map((rec) => {
    if (rec.date === todayStr) {
      updated = true;
      return {
        ...rec,
        steps: Math.max(rec.steps, steps), // Keep the max to avoid reverting if pedometer restarts
        goal,
        distanceKm: Math.round((Math.max(rec.steps, steps) * 0.00078) * 10) / 10,
        caloriesBurned: Math.round(Math.max(rec.steps, steps) * 0.04),
      };
    }
    return rec;
  });

  if (!updated) {
    newRecords.push({
      date: todayStr,
      steps,
      goal,
      distanceKm: Math.round((steps * 0.00078) * 10) / 10,
      caloriesBurned: Math.round(steps * 0.04),
    });
  }

  const finalRecords = newRecords.slice(-7);
  saveStepRecordsToStorage(finalRecords);
  return finalRecords;
}
