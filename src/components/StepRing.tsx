import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Footprints, Flame, Navigation, Plus } from 'lucide-react-native';

interface StepRingProps {
  currentSteps: number;
  stepGoal: number;
  distanceKm: number;
  caloriesBurned: number;
  onAddSimulatedSteps?: (amount: number) => void;
}

export const StepRing: React.FC<StepRingProps> = ({
  currentSteps,
  stepGoal,
  distanceKm,
  caloriesBurned,
  onAddSimulatedSteps,
}) => {
  const percentage = Math.min(100, Math.round((currentSteps / stepGoal) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.ringWrapper}>
        <View style={styles.outerRing}>
          <View style={[styles.innerRingContent, { borderColor: percentage >= 100 ? '#10B981' : '#3B82F6' }]}>
            <Footprints size={28} color={percentage >= 100 ? '#10B981' : '#3B82F6'} />
            <Text style={styles.stepNumberText}>{currentSteps.toLocaleString()}</Text>
            <Text style={styles.stepGoalText}>/ {stepGoal.toLocaleString()} steps</Text>

            <View style={styles.percentageBadge}>
              <Text style={styles.percentageBadgeText}>{percentage}%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Metrics Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Navigation size={18} color="#38BDF8" />
          <Text style={styles.statValue}>{distanceKm} km</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statBox}>
          <Flame size={18} color="#F59E0B" />
          <Text style={styles.statValue}>{caloriesBurned} kcal</Text>
          <Text style={styles.statLabel}>Burned</Text>
        </View>
      </View>

      {/* Simulation Controls for Browser / Live Testing */}
      {onAddSimulatedSteps && (
        <View style={styles.simControls}>
          <Text style={styles.simTitle}>Pedometer Simulator:</Text>
          <View style={styles.simBtnRow}>
            <TouchableOpacity style={styles.simBtn} onPress={() => onAddSimulatedSteps(500)}>
              <Plus size={14} color="#3B82F6" />
              <Text style={styles.simBtnText}>+500 Steps</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.simBtn} onPress={() => onAddSimulatedSteps(1000)}>
              <Plus size={14} color="#10B981" />
              <Text style={styles.simBtnText}>+1,000 Steps</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  ringWrapper: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: '#334155',
  },
  innerRingContent: {
    width: 146,
    height: 146,
    borderRadius: 73,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
  },
  stepNumberText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 4,
  },
  stepGoalText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  percentageBadge: {
    marginTop: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  percentageBadgeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
  },
  simControls: {
    width: '100%',
    marginTop: 14,
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  simTitle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 6,
  },
  simBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  simBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  simBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
    marginLeft: 4,
  },
});
