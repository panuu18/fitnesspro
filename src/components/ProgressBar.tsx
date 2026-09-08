import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MacroProgressBarProps {
  label: string;
  consumed: number;
  target: number;
  unit?: string;
  color: string;
  subtext?: string;
}

export const MacroProgressBar: React.FC<MacroProgressBarProps> = ({
  label,
  consumed,
  target,
  unit = 'g',
  color,
  subtext,
}) => {
  const percentage = Math.min(100, target > 0 ? Math.round((consumed / target) * 100) : 0);
  const remaining = Math.max(0, Math.round(target - consumed));

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.labelGroup}>
          <View style={[styles.dotIndicator, { backgroundColor: color }]} />
          <Text style={styles.labelText}>{label}</Text>
        </View>
        <Text style={styles.valueText}>
          <Text style={[styles.consumedText, { color }]}>{Math.round(consumed)}</Text>
          <Text style={styles.targetText}> / {Math.round(target)}{unit}</Text>
        </Text>
      </View>

      {/* Progress Track */}
      <View style={styles.trackBackground}>
        <View
          style={[
            styles.trackFill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
              shadowColor: color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 6,
            },
          ]}
        />
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.remainingText}>{remaining}{unit} remaining</Text>
        <Text style={[styles.percentageText, { color }]}>{percentage}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
  },
  consumedText: {
    fontWeight: '800',
    fontSize: 15,
  },
  targetText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  trackBackground: {
    height: 10,
    backgroundColor: '#0F172A',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  trackFill: {
    height: '100%',
    borderRadius: 5,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
