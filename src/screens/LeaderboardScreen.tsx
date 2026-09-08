import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Trophy, ShieldCheck, Zap, Info, Award, Flame, CheckCircle } from 'lucide-react-native';
import { LeaderboardEntry } from '../types';
import { LeaderboardCard } from '../components/LeaderboardCard';

interface LeaderboardScreenProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ entries, currentUserId }) => {
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'alltime'>('daily');

  // Sort entries according to selected filter
  const sortedEntries = [...entries].sort((a, b) => {
    if (filter === 'daily') return b.dailyPoints - a.dailyPoints;
    if (filter === 'weekly') return b.weeklyPoints - a.weeklyPoints;
    return b.totalPoints - a.totalPoints;
  });

  // Re-assign ranks dynamically
  const rankedEntries = sortedEntries.map((item, idx) => ({ ...item, rank: idx + 1 }));
  const currentUserEntry = rankedEntries.find((e) => e.displayName.includes('(You)') || e.uid === currentUserId);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Banner */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.title}>Global Leaderboard</Text>
          <Text style={styles.subtitle}>Server-verified rankings recalculated via Cloud Functions</Text>
        </View>
        <View style={styles.verifiedBadge}>
          <ShieldCheck size={18} color="#10B981" />
          <Text style={styles.verifiedBadgeText}>Anti-Spoof</Text>
        </View>
      </View>

      {/* Filter Tabs (Daily / Weekly / All-Time) */}
      <View style={styles.filterRow}>
        {(['daily', 'weekly', 'alltime'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'daily' ? 'Today' : f === 'weekly' ? 'This Week' : 'All Time'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Server Rules Explanation Box */}
      <View style={styles.rulesCard}>
        <View style={styles.rulesHeader}>
          <Zap size={16} color="#F59E0B" />
          <Text style={styles.rulesTitle}>Server Point System (Daily Max ~120+ Pts)</Text>
        </View>

        <View style={styles.rulesGrid}>
          <View style={styles.ruleItem}>
            <CheckCircle size={14} color="#10B981" />
            <Text style={styles.ruleText}>Calorie/Macro Target Hit: <Text style={styles.highlightText}>+50 pts</Text></Text>
          </View>

          <View style={styles.ruleItem}>
            <CheckCircle size={14} color="#3B82F6" />
            <Text style={styles.ruleText}>Pedometer Step Goal Hit: <Text style={styles.highlightText}>+30 pts</Text></Text>
          </View>

          <View style={styles.ruleItem}>
            <CheckCircle size={14} color="#EC4899" />
            <Text style={styles.ruleText}>Each Habit Completed: <Text style={styles.highlightText}>+10 pts</Text></Text>
          </View>
        </View>
      </View>

      {/* Current User Standings Card */}
      {currentUserEntry && (
        <View style={styles.userBanner}>
          <View style={styles.userBannerLeft}>
            <Award size={24} color="#10B981" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.userBannerRank}>Your Rank: #{currentUserEntry.rank}</Text>
              <Text style={styles.userBannerSub}>
                Badge: {currentUserEntry.badge} • {currentUserEntry.streak}d streak
              </Text>
            </View>
          </View>
          <Text style={styles.userBannerPts}>
            {(filter === 'daily'
              ? currentUserEntry.dailyPoints
              : filter === 'weekly'
              ? currentUserEntry.weeklyPoints
              : currentUserEntry.totalPoints
            ).toLocaleString()}{' '}
            pts
          </Text>
        </View>
      )}

      {/* Leaderboard List */}
      <Text style={styles.sectionHeader}>Rankings</Text>
      {rankedEntries.map((entry) => (
        <LeaderboardCard key={entry.uid} entry={entry} activeFilter={filter} />
      ))}

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
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  verifiedBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterChipActive: {
    backgroundColor: '#10B981',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  filterTextActive: {
    color: '#0F172A',
  },
  rulesCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  rulesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rulesTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
    marginLeft: 6,
  },
  rulesGrid: {
    marginTop: 4,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ruleText: {
    fontSize: 12,
    color: '#CBD5E1',
    marginLeft: 6,
  },
  highlightText: {
    color: '#F59E0B',
    fontWeight: '800',
  },
  userBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  userBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userBannerRank: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  userBannerSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  userBannerPts: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10B981',
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 12,
  },
});
