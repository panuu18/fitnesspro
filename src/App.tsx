import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Text, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';

import { Habit, HabitCategory, LeaderboardEntry, MealItem, UserProfile } from './types';
import { calculateMacros } from './services/nutritionCalculator';
import {
  loadUserProfile,
  saveUserProfile,
  loadMealItems,
  addMealItem,
  deleteMealItem,
  loadHabits,
  toggleHabitCompletion,
  saveHabits,
  loadLeaderboard,
  updateLeaderboardProfile,
  DEFAULT_HABITS,
} from './services/firebase';
import {
  addStepsToToday,
  getTodayDateString,
  loadStepRecordsFromStorage,
  setTodaySteps,
} from './services/stepTracker';
import { calculateDailyPointsServerVerified } from './services/cloudFunctions';

import { TabBar, TabType } from './components/TabBar';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeScreen } from './screens/HomeScreen';
import { LogMealScreen } from './screens/LogMealScreen';
import { HabitsScreen } from './screens/HabitsScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { ProfileScreen } from './screens/ProfileScreen';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile());
  const [meals, setMeals] = useState<MealItem[]>(() => loadMealItems());
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());
  const [stepRecords, setStepRecords] = useState(() => loadStepRecordsFromStorage(profile.stepGoal));
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => loadLeaderboard());
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Dynamic Mifflin-St Jeor Macro Targets
  const macroTargets = calculateMacros(profile);

  // Get Today's Step Count
  const todayStr = getTodayDateString();
  const todayStepRec = stepRecords.find((r) => r.date === todayStr);
  const todaysSteps = todayStepRec ? todayStepRec.steps : 0;

  // Real-time Cloud Function Server Verified Points
  const pointsData = useMemo(() => {
    return calculateDailyPointsServerVerified(
      profile,
      meals,
      todaysSteps,
      habits,
      macroTargets.targetCalories
    );
  }, [profile, meals, todaysSteps, habits, macroTargets.targetCalories]);

  // Refresh Leaderboard whenever points update
  useEffect(() => {
    setLeaderboard(loadLeaderboard());
  }, [pointsData.dailyPoints]);

  // Native Pedometer Integration
  useEffect(() => {
    let subscription: Pedometer.Subscription | null = null;
    
    const subscribePedometer = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) return;
      
      const { status } = await Pedometer.requestPermissionsAsync();
      if (status !== 'granted') return;

      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      
      try {
        const result = await Pedometer.getStepCountAsync(start, end);
        if (result && result.steps > 0) {
          setStepRecords(prev => setTodaySteps(prev, result.steps, profile.stepGoal));
        }
      } catch (e) {
        console.warn('Could not fetch daily steps:', e);
      }

      // Also listen for live foreground updates
      subscription = Pedometer.watchStepCount(result => {
        setStepRecords(prev => {
          const currentRec = prev.find(r => r.date === getTodayDateString());
          const baseline = currentRec ? currentRec.steps : 0;
          return setTodaySteps(prev, baseline + result.steps, profile.stepGoal);
        });
      });
    };
    
    if (Platform.OS !== 'web') {
      subscribePedometer();
    }
    
    return () => {
      if (subscription) subscription.remove();
    };
  }, [profile.stepGoal]);

  // Profile Update Handler
  const handleSaveProfile = (updated: Partial<UserProfile>) => {
    const newProfile: UserProfile = {
      ...profile,
      ...updated,
      updatedAt: new Date().toISOString(),
    };
    setProfile(newProfile);
    saveUserProfile(newProfile);
    const updatedLeaderboard = updateLeaderboardProfile(newProfile);
    setLeaderboard(updatedLeaderboard);
    setIsOnboardingOpen(false);
    triggerCelebration();
  };

  // Step Simulation / Sensor Handler
  const handleAddSteps = (amount: number) => {
    const updatedRecords = addStepsToToday(stepRecords, amount, profile.stepGoal);
    setStepRecords(updatedRecords);
    if (todaysSteps + amount >= profile.stepGoal && todaysSteps < profile.stepGoal) {
      triggerCelebration();
    }
  };

  // Meal Log Handlers
  const handleAddMeal = (mealData: Omit<MealItem, 'id' | 'userId' | 'loggedAt'>) => {
    const newMeal: MealItem = {
      ...mealData,
      id: `meal_${Date.now()}`,
      userId: profile.uid,
      loggedAt: todayStr,
    };
    const updatedMeals = addMealItem(newMeal);
    setMeals(updatedMeals);
    triggerCelebration();
  };

  const handleDeleteMeal = (mealId: string) => {
    const updatedMeals = deleteMealItem(mealId);
    setMeals(updatedMeals);
  };

  // Habit Handlers
  const handleToggleHabit = (habitId: string) => {
    const updatedHabits = toggleHabitCompletion(habitId, todayStr);
    setHabits(updatedHabits);
  };

  const handleAddCustomHabit = (title: string, category: HabitCategory) => {
    const newHabit: Habit = {
      id: `habit_${Date.now()}`,
      userId: profile.uid,
      title,
      category,
      icon: 'star',
      targetDaysPerWeek: 7,
      currentStreak: 1,
      bestStreak: 1,
      completedDates: [todayStr],
      createdAt: new Date().toISOString(),
    };
    const updated = [newHabit, ...habits];
    setHabits(updated);
    saveHabits(updated);
    triggerCelebration();
  };

  // Step Goal Update Handler
  const handleUpdateStepGoal = (newGoal: number) => {
    const updatedProfile = { ...profile, stepGoal: newGoal };
    setProfile(updatedProfile);
    saveUserProfile(updatedProfile);
    setStepRecords(loadStepRecordsFromStorage(newGoal));
  };

  const triggerCelebration = () => {
    try {
      // Confetti removed for native compatibility
    } catch (e) {
      // Ignored if confetti not available in native
    }
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            profile={profile}
            macroTargets={macroTargets}
            todaysMeals={meals}
            todaysSteps={todaysSteps}
            habits={habits}
            pointsData={pointsData}
            onNavigateTab={setActiveTab}
            onAddSimulatedSteps={handleAddSteps}
            onToggleHabit={handleToggleHabit}
            onOpenPhotoScanner={() => setActiveTab('meals')}
          />
        );
      case 'meals':
        return (
          <LogMealScreen
            meals={meals}
            onAddMeal={handleAddMeal}
            onDeleteMeal={handleDeleteMeal}
          />
        );
      case 'habits':
        return (
          <HabitsScreen
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onAddCustomHabit={handleAddCustomHabit}
          />
        );
      case 'leaderboard':
        return (
          <LeaderboardScreen
            entries={leaderboard}
            currentUserId={profile.uid}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            profile={profile}
            macroTargets={macroTargets}
            onOpenEditModal={() => {
              setIsEditMode(true);
              setIsOnboardingOpen(true);
            }}
            onUpdateStepGoal={handleUpdateStepGoal}
            onLogout={() => {
              setIsEditMode(false);
              setIsOnboardingOpen(true);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Active Tab Screen */}
      <View style={styles.screenWrapper}>{renderActiveScreen()}</View>

      {/* Bottom Tab Navigation */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Onboarding & Profile Edit Modal */}
      <OnboardingModal
        visible={isOnboardingOpen}
        initialProfile={profile}
        isEditMode={isEditMode}
        onSave={handleSaveProfile}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: '#090D16',
  },
});
