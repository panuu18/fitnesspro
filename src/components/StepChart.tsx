import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailyStepRecord } from '../types';
import { getDayAbbreviation } from '../services/stepTracker';

interface StepChartProps {
  records: DailyStepRecord[];
  stepGoal: number;
}

export const StepChart: React.FC<StepChartProps> = ({ records, stepGoal }) => {
  const maxSteps = Math.max(...records.map((r) => r.steps), stepGoal, 12000);

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>7-Day Activity History</Text>
      <Text style={styles.chartSubtitle}>Step goal: {stepGoal.toLocaleString()} steps/day</Text>

      <View style={styles.chartArea}>
        {/* Goal Indicator Line */}
        <View
          style={[
            styles.goalLine,
            { bottom: `${Math.min(90, Math.max(10, (stepGoal / maxSteps) * 100))}%` },
          ]}
        />

        <View style={styles.barsRow}>
          {records.map((rec, index) => {
            const heightPercent = Math.min(100, Math.round((rec.steps / maxSteps) * 100));
            const isGoalHit = rec.steps >= stepGoal;
            const isToday = index === records.length - 1;

            return (
              <View key={rec.date} style={styles.barColumn}>
                <Text style={styles.barValueText}>
                  {rec.steps >= 1000 ? `${(rec.steps / 1000).toFixed(1)}k` : rec.steps}
                </Text>

                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${heightPercent}%`,
                        backgroundColor: isGoalHit ? '#10B981' : isToday ? '#3B82F6' : '#64748B',
                      },
                    ]}
                  />
                </View>

                <Text style={[styles.dayText, isToday && styles.todayText]}>
                  {getDayAbbreviation(rec.date)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 16,
  },
  chartArea: {
    height: 150,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F59E0B',
    borderStyle: 'dashed',
    zIndex: 2,
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 130,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barValueText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: '#0F172A',
    borderRadius: 7,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  dayText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 6,
    fontWeight: '600',
  },
  todayText: {
    color: '#3B82F6',
    fontWeight: '800',
  },
});
