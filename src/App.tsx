import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Pedometer } from 'expo-sensors';
import { LogOut, User as UserIcon } from 'lucide-react-native';

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
  saveStepRecordsToStorage,
  setTodaySteps,
} from './services/stepTracker';
import { calculateDailyPointsServerVerified } from './services/cloudFunctions';
import { AuthUser, getCurrentUser, onAuthStateChange, signOutUser } from './services/authService';

import { TabBar, TabType } from './components/TabBar';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LogMealScreen } from './screens/LogMealScreen';
import { HabitsScreen } from './screens/HabitsScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { ProfileScreen } from './screens/ProfileScreen';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [profile, setProfile] = useState<UserProfile>(() =>
    loadUserProfile(currentUser?.uid, currentUser?.email, currentUser?.displayName)
  );
  const [meals, setMeals] = useState<MealItem[]>(() => loadMealItems(currentUser?.uid));
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits(currentUser?.uid));
  const [stepRecords, setStepRecords] = useState(() =>
    loadStepRecordsFromStorage(profile.stepGoal, currentUser?.uid)
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => loadLeaderboard());
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Authentication State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);

      if (user) {
        const userProf = loadUserProfile(user.uid, user.email, user.displayName);
        setProfile(userProf);
        setMeals(loadMealItems(user.uid));
        setHabits(loadHabits(user.uid));
        setStepRecords(loadStepRecordsFromStorage(userProf.stepGoal, user.uid));
        setLeaderboard(updateLeaderboardProfile(userProf));

        // Check if user is a freshly created account needing onboarding
        const hasExistingProfile = !!localStorage.getItem(`fitpulse_user_profile_${user.uid}`);
        if (!hasExistingProfile && !user.isDemo) {
          setIsEditMode(false);
          setIsOnboardingOpen(true);
        }
      }
    });
    return unsubscribe;
  }, []);

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
          setStepRecords((prev) => {
            const updated = setTodaySteps(prev, result.steps, profile.stepGoal);
            saveStepRecordsToStorage(updated, profile.uid);
            return updated;
          });
        }
      } catch (e) {
        console.warn('Could not fetch daily steps:', e);
      }

      // Also listen for live foreground updates
      subscription = Pedometer.watchStepCount((result) => {
        setStepRecords((prev) => {
          const currentRec = prev.find((r) => r.date === getTodayDateString());
          const baseline = currentRec ? currentRec.steps : 0;
          const updated = setTodaySteps(prev, baseline + result.steps, profile.stepGoal);
          saveStepRecordsToStorage(updated, profile.uid);
          return updated;
        });
      });
    };

    if (Platform.OS !== 'web' && currentUser) {
      subscribePedometer();
    }

    return () => {
      if (subscription) subscription.remove();
    };
  }, [profile.stepGoal, currentUser, profile.uid]);

  // Profile Update Handler
  const handleSaveProfile = (updated: Partial<UserProfile>) => {
    const newProfile: UserProfile = {
      ...profile,
      ...updated,
      uid: profile.uid,
      updatedAt: new Date().toISOString(),
    };
    setProfile(newProfile);
    saveUserProfile(newProfile);
    const updatedLeaderboard = updateLeaderboardProfile(newProfile);
    setLeaderboard(updatedLeaderboard);
    setIsOnboardingOpen(false);
  };

  // Step Simulation / Sensor Handler
  const handleAddSteps = (amount: number) => {
    const updatedRecords = addStepsToToday(stepRecords, amount, profile.stepGoal);
    setStepRecords(updatedRecords);
    saveStepRecordsToStorage(updatedRecords, profile.uid);
  };

  // Meal Log Handlers
  const handleAddMeal = (mealData: Omit<MealItem, 'id' | 'userId' | 'loggedAt'>) => {
    const newMeal: MealItem = {
      ...mealData,
      id: `meal_${Date.now()}`,
      userId: profile.uid,
      loggedAt: todayStr,
    };
    const updatedMeals = addMealItem(newMeal, profile.uid);
    setMeals(updatedMeals);
  };

  const handleDeleteMeal = (mealId: string) => {
    const updatedMeals = deleteMealItem(mealId, profile.uid);
    setMeals(updatedMeals);
  };

  // Habit Handlers
  const handleToggleHabit = (habitId: string) => {
    const updatedHabits = toggleHabitCompletion(habitId, todayStr, profile.uid);
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
    saveHabits(updated, profile.uid);
  };

  // Step Goal Update Handler
  const handleUpdateStepGoal = (newGoal: number) => {
    const updatedProfile = { ...profile, stepGoal: newGoal };
    setProfile(updatedProfile);
    saveUserProfile(updatedProfile);
    setStepRecords(loadStepRecordsFromStorage(newGoal, profile.uid));
  };

  // User Logout Handler
  const handleLogout = async () => {
    await signOutUser();
    setCurrentUser(null);
    setActiveTab('home');
  };

  // 1. Loading Splash while reading auth session
  if (isAuthLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="light-content" backgroundColor="#090D16" />
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading FitPulse Pro...</Text>
      </SafeAreaView>
    );
  }

  // 2. Unauthenticated: Show AuthScreen
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#090D16" />
        <AuthScreen onAuthSuccess={(user) => setCurrentUser(user)} />
      </SafeAreaView>
    );
  }

  // 3. Authenticated: Render Main App Screens
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
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Top Account Indicator Bar */}
      <View style={styles.topAccountBar}>
        <View style={styles.accountInfoCol}>
          <Text style={styles.accountGreeting}>
            Signed in as <Text style={styles.accountEmail}>{currentUser.displayName || currentUser.email}</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={styles.quickLogoutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={13} color="#EF4444" />
          <Text style={styles.quickLogoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  topAccountBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0B1120',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  accountInfoCol: {
    flex: 1,
  },
  accountGreeting: {
    fontSize: 11,
    color: '#64748B',
  },
  accountEmail: {
    color: '#10B981',
    fontWeight: '700',
  },
  quickLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  quickLogoutText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: '#090D16',
  },
});
