import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Flame, Trophy, Plus, Camera, Sparkles, ShieldCheck, Zap } from 'lucide-react-native';
import { BMRResult, Habit, LeaderboardEntry, MealItem, UserProfile } from '../types';
import { MacroProgressBar } from '../components/ProgressBar';
import { StepRing } from '../components/StepRing';
import { getTodayDateString } from '../services/stepTracker';

interface HomeScreenProps {
  profile: UserProfile;
  macroTargets: BMRResult;
  todaysMeals: MealItem[];
  todaysSteps: number;
  habits: Habit[];
  pointsData: {
    dailyPoints: number;
    totalPoints: number;
    hitMacroTarget: boolean;
    hitStepGoal: boolean;
    isServerVerified: boolean;
  };
  onNavigateTab: (tab: 'meals' | 'habits' | 'leaderboard' | 'profile') => void;
  onAddSimulatedSteps: (amount: number) => void;
  onToggleHabit: (habitId: string) => void;
  onOpenPhotoScanner: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  macroTargets,
  todaysMeals,
  todaysSteps,
  habits,
  pointsData,
  onNavigateTab,
  onAddSimulatedSteps,
  onToggleHabit,
  onOpenPhotoScanner,
}) => {
  // Aggregate consumed macros for today
  const consumedCalories = todaysMeals.reduce((acc, m) => acc + m.calories, 0);
  const consumedProtein = todaysMeals.reduce((acc, m) => acc + m.protein, 0);
  const consumedCarbs = todaysMeals.reduce((acc, m) => acc + m.carbs, 0);
  const consumedFat = todaysMeals.reduce((acc, m) => acc + m.fat, 0);

  const todayStr = getTodayDateString();
  const completedHabitsCount = habits.filter((h) => h.completedDates.includes(todayStr)).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header Card */}
      <View style={styles.topHeader}>
        <View style={styles.userInfoRow}>
          <TouchableOpacity onPress={() => onNavigateTab('profile')}>
            <Image
              source={{
                uri:
                  profile.photoURL ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View style={styles.greetingGroup}>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.userNameText}>{profile.displayName}</Text>
          </View>
        </View>

        {/* Server Verified Daily Points Badge */}
        <TouchableOpacity style={styles.pointsBadge} onPress={() => onNavigateTab('leaderboard')}>
          <Zap size={18} color="#F59E0B" />
          <View style={styles.pointsColumn}>
            <Text style={styles.pointsValue}>+{pointsData.dailyPoints} pts</Text>
            <Text style={styles.pointsLabel}>Today's Rank Score</Text>
          </View>
          <ShieldCheck size={14} color="#10B981" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      {/* Goal Summary Banner */}
      <View style={styles.goalBanner}>
        <View style={styles.goalTextRow}>
          <Sparkles size={18} color="#10B981" />
          <Text style={styles.goalTitle}>Goal: {profile.goal.toUpperCase()}</Text>
        </View>
        <Text style={styles.goalSubtext}>
          TDEE: {macroTargets.tdee} kcal • Target: {macroTargets.targetCalories} kcal
        </Text>
      </View>

      {/* Quick Action Photo Scan Button */}
      <TouchableOpacity style={styles.scanButtonCard} onPress={onOpenPhotoScanner} activeOpacity={0.85}>
        <View style={styles.scanLeft}>
          <View style={styles.cameraIconCircle}>
            <Camera size={22} color="#10B981" />
          </View>
          <View>
            <Text style={styles.scanBtnTitle}>Snap Meal Photo AI</Text>
            <Text style={styles.scanBtnSubtitle}>Instant calories & macro recognition</Text>
          </View>
        </View>
        <Plus size={20} color="#10B981" />
      </TouchableOpacity>

      {/* Calories & Macro Progress Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Daily Nutrition & Macros</Text>
        <TouchableOpacity onPress={() => onNavigateTab('meals')}>
          <Text style={styles.seeAllText}>Log Meal +</Text>
        </TouchableOpacity>
      </View>

      <MacroProgressBar
        label="Total Calories"
        consumed={consumedCalories}
        target={macroTargets.targetCalories}
        unit=" kcal"
        color="#F59E0B"
      />

      <MacroProgressBar
        label="Protein"
        consumed={consumedProtein}
        target={macroTargets.proteinGrams}
        unit="g"
        color="#10B981"
      />

      <View style={styles.macroSplitRow}>
        <View style={{ flex: 1, marginRight: 6 }}>
          <MacroProgressBar
            label="Carbs"
            consumed={consumedCarbs}
            target={macroTargets.carbGrams}
            unit="g"
            color="#3B82F6"
          />
        </View>
        <View style={{ flex: 1, marginLeft: 6 }}>
          <MacroProgressBar
            label="Fat"
            consumed={consumedFat}
            target={macroTargets.fatGrams}
            unit="g"
            color="#EC4899"
          />
        </View>
      </View>

      {/* Steps Progress Ring & Simulator */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Step Counter & Pedometer</Text>
      </View>

      <StepRing
        currentSteps={todaysSteps}
        stepGoal={profile.stepGoal}
        distanceKm={Math.round((todaysSteps * 0.00078) * 10) / 10}
        caloriesBurned={Math.round(todaysSteps * 0.04)}
        onAddSimulatedSteps={onAddSimulatedSteps}
      />

      {/* Daily Habits Quick Checklist */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.titleWithBadge}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {completedHabitsCount}/{habits.length}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => onNavigateTab('habits')}>
          <Text style={styles.seeAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {habits.slice(0, 3).map((habit) => {
        const isDone = habit.completedDates.includes(todayStr);
        return (
          <TouchableOpacity
            key={habit.id}
            style={[styles.habitQuickCard, isDone && styles.habitQuickCardDone]}
            onPress={() => onToggleHabit(habit.id)}
          >
            <View style={styles.habitLeftGroup}>
              <View style={[styles.habitStatusDot, isDone && styles.habitStatusDotDone]} />
              <Text style={[styles.habitTitleText, isDone && styles.habitTitleTextDone]}>
                {habit.title}
              </Text>
            </View>
            <View style={styles.habitRightGroup}>
              <Flame size={14} color="#F59E0B" />
              <Text style={styles.habitStreakText}>{habit.currentStreak}d</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={{ height: 90 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  greetingGroup: {
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  pointsColumn: {
    marginLeft: 6,
  },
  pointsValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F59E0B',
  },
  pointsLabel: {
    fontSize: 9,
    color: '#94A3B8',
  },
  goalBanner: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  goalTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    marginLeft: 6,
  },
  goalSubtext: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  scanButtonCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  scanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  scanBtnTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  scanBtnSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
  macroSplitRow: {
    flexDirection: 'row',
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  habitQuickCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  habitQuickCardDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  habitLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#475569',
    marginRight: 10,
  },
  habitStatusDotDone: {
    backgroundColor: '#10B981',
  },
  habitTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  habitTitleTextDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  habitRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitStreakText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
    marginLeft: 4,
  },
});
