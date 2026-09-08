import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Trophy, ShieldCheck, Flame, Zap, Award } from 'lucide-react-native';
import { LeaderboardEntry } from '../types';

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  activeFilter: 'daily' | 'weekly' | 'alltime';
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ entry, activeFilter }) => {
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Apex':
        return '#F59E0B'; // Gold amber
      case 'Titan':
        return '#10B981'; // Emerald
      case 'Warrior':
        return '#3B82F6'; // Blue
      case 'Challenger':
        return '#8B5CF6'; // Purple
      default:
        return '#64748B'; // Slate
    }
  };

  const getRankBadge = (rank?: number) => {
    if (rank === 1) return <Trophy size={20} color="#F59E0B" />;
    if (rank === 2) return <Award size={20} color="#CBD5E1" />;
    if (rank === 3) return <Award size={20} color="#D97706" />;
    return <Text style={styles.rankNumberText}>#{rank}</Text>;
  };

  const displayedPoints =
    activeFilter === 'daily'
      ? entry.dailyPoints
      : activeFilter === 'weekly'
      ? entry.weeklyPoints
      : entry.totalPoints;

  const isCurrentUser = entry.displayName.includes('(You)');

  return (
    <View style={[styles.card, isCurrentUser && styles.currentUserCard]}>
      {/* Rank Indicator */}
      <View style={styles.rankContainer}>{getRankBadge(entry.rank)}</View>

      {/* User Avatar */}
      <Image source={{ uri: entry.avatarUrl }} style={styles.avatar} />

      {/* User Information */}
      <View style={styles.infoSection}>
        <View style={styles.nameRow}>
          <Text style={[styles.displayName, isCurrentUser && styles.currentUserText]}>
            {entry.displayName}
          </Text>
          <View style={{ marginLeft: 4 }}>
            <ShieldCheck size={14} color="#10B981" />
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={[styles.tierTag, { backgroundColor: `${getBadgeColor(entry.badge)}20` }]}>
            <Text style={[styles.tierTagText, { color: getBadgeColor(entry.badge) }]}>
              {entry.badge}
            </Text>
          </View>

          <View style={styles.metaStat}>
            <Flame size={12} color="#F59E0B" />
            <Text style={styles.metaStatText}>{entry.streak}d streak</Text>
          </View>
        </View>
      </View>

      {/* Points Display */}
      <View style={styles.pointsContainer}>
        <View style={styles.pointsRow}>
          <Zap size={16} color="#F59E0B" />
          <Text style={styles.pointsText}>{displayedPoints.toLocaleString()}</Text>
        </View>
        <Text style={styles.ptsSublabel}>Points</Text>
      </View>
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  currentUserCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: '#10B981',
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumberText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#94A3B8',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginHorizontal: 10,
    backgroundColor: '#334155',
  },
  infoSection: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  currentUserText: {
    color: '#10B981',
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  tierTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  tierTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  metaStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaStatText: {
    fontSize: 11,
    color: '#94A3B8',
    marginLeft: 3,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginLeft: 4,
  },
  ptsSublabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
});
