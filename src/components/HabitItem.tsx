import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, Flame, BookOpen, Smile, Activity, Dumbbell, Star } from 'lucide-react-native';
import { Habit } from '../types';
import { getTodayDateString } from '../services/stepTracker';

interface HabitItemProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggle }) => {
  const todayStr = getTodayDateString();
  const isCompletedToday = habit.completedDates.includes(todayStr);

  const getCategoryIcon = () => {
    switch (habit.category) {
      case 'Reading':
        return <BookOpen size={20} color="#3B82F6" />;
      case 'Meditation':
        return <Smile size={20} color="#EC4899" />;
      case 'Running':
        return <Activity size={20} color="#F59E0B" />;
      case 'Gym':
        return <Dumbbell size={20} color="#10B981" />;
      default:
        return <Star size={20} color="#8B5CF6" />;
    }
  };

  return (
    <View style={[styles.card, isCompletedToday && styles.completedCard]}>
      <View style={styles.leftSection}>
        <View style={styles.iconCircle}>{getCategoryIcon()}</View>
        <View style={styles.textGroup}>
          <Text style={[styles.title, isCompletedToday && styles.completedTitle]}>
            {habit.title}
          </Text>
          <View style={styles.streakBadge}>
            <Flame size={14} color="#F59E0B" />
            <Text style={styles.streakText}>{habit.currentStreak} day streak</Text>
            <Text style={styles.bestText}>(Best: {habit.bestStreak})</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.checkbox, isCompletedToday && styles.checkedBox]}
        onPress={() => onToggle(habit.id)}
        activeOpacity={0.7}
      >
        {isCompletedToday ? (
          <Check size={18} color="#0F172A" strokeWidth={3} />
        ) : (
          <View style={styles.uncheckedInner} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  completedCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
    marginLeft: 4,
  },
  bestText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 6,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  checkedBox: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  uncheckedInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
});
