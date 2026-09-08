import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Utensils, Target, Trophy, User } from 'lucide-react-native';

export type TabType = 'home' | 'meals' | 'habits' | 'leaderboard' | 'profile';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'meals' as TabType, label: 'Log Meal', icon: Utensils },
    { id: 'habits' as TabType, label: 'Habits', icon: Target },
    { id: 'leaderboard' as TabType, label: 'Ranking', icon: Trophy },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
              <IconComponent
                size={22}
                color={isActive ? '#10B981' : '#64748B'}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
            </View>
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    position: 'relative',
    minWidth: 64,
  },
  activeTabButton: {
    transform: [{ translateY: -2 }],
  },
  iconWrapper: {
    padding: 6,
    borderRadius: 12,
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#10B981',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 3,
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
});
