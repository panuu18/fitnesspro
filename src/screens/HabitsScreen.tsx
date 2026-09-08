import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Flame, Plus, CheckCircle, Calendar, Sparkles, X, Target } from 'lucide-react-native';
import { Habit, HabitCategory } from '../types';
import { HabitItem } from '../components/HabitItem';
import { getTodayDateString } from '../services/stepTracker';

interface HabitsScreenProps {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
  onAddCustomHabit: (title: string, category: HabitCategory) => void;
}

export const HabitsScreen: React.FC<HabitsScreenProps> = ({
  habits,
  onToggleHabit,
  onAddCustomHabit,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HabitCategory>('Custom');

  const todayStr = getTodayDateString();
  const completedTodayCount = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const totalStreakSum = habits.reduce((acc, h) => acc + h.currentStreak, 0);

  const handleCreateHabit = () => {
    if (!newTitle.trim()) return;
    onAddCustomHabit(newTitle.trim(), newCategory);
    setNewTitle('');
    setIsAddModalOpen(false);
  };

  // Generate 28-day streak heatmap grid
  const heatmapDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const dateStr = d.toISOString().split('T')[0];
    const habitsCompletedOnDate = habits.filter((h) => h.completedDates.includes(dateStr)).length;
    return { dateStr, habitsCompletedOnDate };
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Banner */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.title}>Daily Habits & Streaks</Text>
          <Text style={styles.subtitle}>Build consistency to earn server-verified ranking points</Text>
        </View>
        <TouchableOpacity style={styles.addHabitBtn} onPress={() => setIsAddModalOpen(true)}>
          <Plus size={18} color="#0F172A" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Streak & Stats Overview Cards */}
      <View style={styles.statsCardsRow}>
        <View style={styles.statCard}>
          <Flame size={22} color="#F59E0B" />
          <Text style={styles.statCardValue}>{totalStreakSum} Days</Text>
          <Text style={styles.statCardLabel}>Active Combined Streaks</Text>
        </View>

        <View style={styles.statCard}>
          <CheckCircle size={22} color="#10B981" />
          <Text style={styles.statCardValue}>
            {completedTodayCount}/{habits.length}
          </Text>
          <Text style={styles.statCardLabel}>Today's Completion</Text>
        </View>
      </View>

      {/* 28-Day Consistency Heatmap */}
      <View style={styles.heatmapCard}>
        <View style={styles.heatmapHeader}>
          <Calendar size={18} color="#3B82F6" />
          <Text style={styles.heatmapTitle}>28-Day Consistency Map</Text>
        </View>
        <View style={styles.heatmapGrid}>
          {heatmapDays.map((item, idx) => {
            const count = item.habitsCompletedOnDate;
            let bgColor = '#0F172A';
            if (count === 1) bgColor = 'rgba(16, 185, 129, 0.3)';
            if (count === 2) bgColor = 'rgba(16, 185, 129, 0.6)';
            if (count >= 3) bgColor = '#10B981';

            return <View key={idx} style={[styles.heatmapTile, { backgroundColor: bgColor }]} />;
          })}
        </View>
        <Text style={styles.heatmapLegend}>Darker green indicates higher habit completions</Text>
      </View>

      {/* Habit Checklist Section */}
      <Text style={styles.sectionHeader}>Habit Checklist</Text>
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} onToggle={onToggleHabit} />
      ))}

      {/* Modal to Add Custom Habit */}
      <Modal visible={isAddModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Habit</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <X size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Habit Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Drink 3L Water, 10k Steps, Cold Shower"
              placeholderTextColor="#64748B"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.catGrid}>
              {(['Reading', 'Meditation', 'Running', 'Gym', 'Custom'] as HabitCategory[]).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, newCategory === cat && styles.catChipActive]}
                  onPress={() => setNewCategory(cat)}
                >
                  <Text style={[styles.catText, newCategory === cat && styles.catTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.createBtn} onPress={handleCreateHabit}>
              <Plus size={18} color="#0F172A" />
              <Text style={styles.createBtnText}>Save Habit (+10 Pts/day)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  addHabitBtn: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addBtnText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 13,
    marginLeft: 4,
  },
  statsCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statCardValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 6,
  },
  statCardLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  heatmapCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  heatmapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  heatmapTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    marginLeft: 8,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  heatmapTile: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginBottom: 6,
  },
  heatmapLegend: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    color: '#F8FAFC',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  catChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  catChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  catText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  catTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  createBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 6,
  },
});
