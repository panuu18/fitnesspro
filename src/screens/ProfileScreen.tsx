import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Edit3, User, Scale, Flame, Activity, Target, Settings, LogOut, Check, ShieldCheck } from 'lucide-react-native';
import { BMRResult, UserProfile } from '../types';
import { ACTIVITY_LABELS } from '../services/nutritionCalculator';

interface ProfileScreenProps {
  profile: UserProfile;
  macroTargets: BMRResult;
  onOpenEditModal: () => void;
  onUpdateStepGoal: (newGoal: number) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  macroTargets,
  onOpenEditModal,
  onUpdateStepGoal,
  onLogout,
}) => {
  const [stepGoalInput, setStepGoalInput] = useState(String(profile.stepGoal || 10000));
  const [isSavedGoal, setIsSavedGoal] = useState(false);

  const handleSaveStepGoal = () => {
    const val = Number(stepGoalInput) || 10000;
    onUpdateStepGoal(val);
    setIsSavedGoal(true);
    setTimeout(() => setIsSavedGoal(false), 2000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Card Header */}
      <View style={styles.profileHeaderCard}>
        <Image
          source={{
            uri:
              profile.photoURL ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          }}
          style={styles.avatar}
        />
        <Text style={styles.displayName}>{profile.displayName}</Text>
        <Text style={styles.emailText}>{profile.email}</Text>

        <TouchableOpacity style={styles.editProfileBtn} onPress={onOpenEditModal}>
          <Edit3 size={16} color="#0F172A" />
          <Text style={styles.editBtnText}>Edit Profile & Metrics</Text>
        </TouchableOpacity>
      </View>

      {/* Body Metrics Grid */}
      <Text style={styles.sectionHeader}>Body Metrics & Activity</Text>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Age</Text>
          <Text style={styles.metricVal}>{profile.age} yrs</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Gender</Text>
          <Text style={styles.metricVal}>{profile.gender.toUpperCase()}</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Height</Text>
          <Text style={styles.metricVal}>{profile.height} cm</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Weight</Text>
          <Text style={styles.metricVal}>{profile.weight} kg</Text>
        </View>
      </View>

      <View style={styles.activityInfoCard}>
        <View style={styles.activityInfoRow}>
          <Activity size={18} color="#3B82F6" />
          <Text style={styles.activityInfoTitle}>Activity Level</Text>
        </View>
        <Text style={styles.activityInfoValue}>
          {ACTIVITY_LABELS[profile.activityLevel]?.label || profile.activityLevel}
        </Text>
        <Text style={styles.activityInfoDesc}>
          {ACTIVITY_LABELS[profile.activityLevel]?.desc}
        </Text>
      </View>

      {/* BMR, TDEE & Macro Engine Summary */}
      <Text style={styles.sectionHeader}>Calorie & Macro Engine (Mifflin-St Jeor)</Text>

      <View style={styles.engineCard}>
        <View style={styles.engineHeader}>
          <Target size={18} color="#10B981" />
          <Text style={styles.engineGoalTitle}>Goal: {profile.goal.toUpperCase()}</Text>
        </View>

        <View style={styles.engineRow}>
          <View style={styles.engineCol}>
            <Text style={styles.engineLabel}>BMR</Text>
            <Text style={styles.engineVal}>{macroTargets.bmr} kcal</Text>
          </View>

          <View style={styles.engineDivider} />

          <View style={styles.engineCol}>
            <Text style={styles.engineLabel}>TDEE</Text>
            <Text style={styles.engineVal}>{macroTargets.tdee} kcal</Text>
          </View>

          <View style={styles.engineDivider} />

          <View style={styles.engineCol}>
            <Text style={styles.engineLabel}>Daily Target</Text>
            <Text style={[styles.engineVal, { color: '#10B981' }]}>
              {macroTargets.targetCalories} kcal
            </Text>
          </View>
        </View>

        {/* Macro targets breakdown */}
        <View style={styles.macroPillGrid}>
          <View style={[styles.macroPillItem, { borderColor: '#10B981' }]}>
            <Text style={styles.macroPillLabel}>Protein</Text>
            <Text style={styles.macroPillVal}>{macroTargets.proteinGrams}g</Text>
            <Text style={styles.macroPillSub}>~{(profile.goal === 'cut' ? 2.2 : 2.0)}g / kg</Text>
          </View>

          <View style={[styles.macroPillItem, { borderColor: '#3B82F6' }]}>
            <Text style={styles.macroPillLabel}>Carbs</Text>
            <Text style={styles.macroPillVal}>{macroTargets.carbGrams}g</Text>
            <Text style={styles.macroPillSub}>Energy remainder</Text>
          </View>

          <View style={[styles.macroPillItem, { borderColor: '#EC4899' }]}>
            <Text style={styles.macroPillLabel}>Fat</Text>
            <Text style={styles.macroPillVal}>{macroTargets.fatGrams}g</Text>
            <Text style={styles.macroPillSub}>25% Calories</Text>
          </View>
        </View>

        <Text style={styles.engineExplanation}>{macroTargets.goalExplanation}</Text>
      </View>

      {/* Editable Step Goal Setting */}
      <Text style={styles.sectionHeader}>Pedometer Preferences</Text>

      <View style={styles.stepGoalBox}>
        <Text style={styles.stepGoalLabel}>Daily Step Target</Text>
        <View style={styles.stepInputRow}>
          <TextInput
            style={styles.stepInput}
            keyboardType="numeric"
            value={stepGoalInput}
            onChangeText={setStepGoalInput}
          />
          <TouchableOpacity style={styles.stepSaveBtn} onPress={handleSaveStepGoal}>
            {isSavedGoal ? <Check size={16} color="#0F172A" /> : <Text style={styles.stepSaveText}>Save</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout / Account Option */}
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <LogOut size={18} color="#EF4444" />
        <Text style={styles.logoutText}>Log Out Account</Text>
      </TouchableOpacity>

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
  profileHeaderCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#10B981',
    marginBottom: 12,
  },
  displayName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  emailText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 14,
  },
  editProfileBtn: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  editBtnText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 13,
    marginLeft: 6,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 4,
  },
  activityInfoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  activityInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityInfoTitle: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 6,
    fontWeight: '600',
  },
  activityInfoValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 4,
  },
  activityInfoDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  engineCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  engineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  engineGoalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
    marginLeft: 8,
  },
  engineRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    marginBottom: 14,
  },
  engineCol: {
    alignItems: 'center',
  },
  engineLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  engineVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 4,
  },
  engineDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#334155',
  },
  macroPillGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  macroPillItem: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 3,
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  macroPillLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  macroPillVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
    marginVertical: 2,
  },
  macroPillSub: {
    fontSize: 9,
    color: '#64748B',
  },
  engineExplanation: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  stepGoalBox: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  stepGoalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 8,
  },
  stepInputRow: {
    flexDirection: 'row',
  },
  stepInput: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 10,
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: '#334155',
  },
  stepSaveBtn: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  stepSaveText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 13,
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 14,
    marginLeft: 8,
  },
});
