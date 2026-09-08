import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Sparkles, ChevronRight, Activity, Target, User, Scale, Camera, Image as ImageIcon } from 'lucide-react-native';
import { ActivityLevel, FitnessGoal, Gender, UserProfile } from '../types';
import { ACTIVITY_LABELS, calculateBMR, calculateMacros, calculateTDEE } from '../services/nutritionCalculator';

interface OnboardingModalProps {
  visible: boolean;
  onSave: (profile: Partial<UserProfile>) => void;
  initialProfile?: UserProfile;
  isEditMode?: boolean;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  onSave,
  initialProfile,
  isEditMode = false,
  onClose,
}) => {
  const [displayName, setDisplayName] = useState(initialProfile?.displayName || '');
  const [photoURL, setPhotoURL] = useState(initialProfile?.photoURL || '');
  const [age, setAge] = useState(String(initialProfile?.age || 26));
  const [gender, setGender] = useState<Gender>(initialProfile?.gender || 'male');
  const [height, setHeight] = useState(String(initialProfile?.height || 180));
  const [weight, setWeight] = useState(String(initialProfile?.weight || 78));
  const [bodyFat, setBodyFat] = useState(initialProfile?.bodyFat !== undefined ? String(initialProfile.bodyFat) : '');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(initialProfile?.activityLevel || 'moderate');
  const [goal, setGoal] = useState<FitnessGoal>(initialProfile?.goal || 'recomp');
  const [recompDeficit, setRecompDeficit] = useState(initialProfile?.recompDeficit || 7.5);

  const numAge = Number(age) || 25;
  const numHeight = Number(height) || 175;
  const numWeight = Number(weight) || 75;
  const numBodyFat = bodyFat ? Number(bodyFat) : undefined;

  useEffect(() => {
    if (visible && initialProfile) {
      setDisplayName(initialProfile.displayName || '');
      setPhotoURL(initialProfile.photoURL || '');
      setAge(String(initialProfile.age || 26));
      setGender(initialProfile.gender || 'male');
      setHeight(String(initialProfile.height || 180));
      setWeight(String(initialProfile.weight || 78));
      setBodyFat(initialProfile.bodyFat !== undefined ? String(initialProfile.bodyFat) : '');
      setActivityLevel(initialProfile.activityLevel || 'moderate');
      setGoal(initialProfile.goal || 'recomp');
      setRecompDeficit(initialProfile.recompDeficit || 7.5);
    }
  }, [visible, initialProfile]);

  const handleTriggerPhotoUpload = (useCamera: boolean) => {
    try {
      if (typeof document !== 'undefined') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        if (useCamera) {
          input.capture = 'environment';
        }
        
        input.onchange = (e: any) => {
          const file = e.target?.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64Url = event.target?.result as string;
            if (base64Url) setPhotoURL(base64Url);
          };
          reader.readAsDataURL(file);
        };
        input.click();
      }
    } catch (err) {
      console.error('File picker error:', err);
    }
  };

  // Real-time calculation preview
  const calculatedBmr = Math.round(calculateBMR(numWeight, numHeight, numAge, gender, numBodyFat));
  const calculatedTdee = calculateTDEE(calculatedBmr, activityLevel);
  const macroSummary = calculateMacros({
    age: numAge,
    gender,
    height: numHeight,
    weight: numWeight,
    bodyFat: numBodyFat,
    activityLevel,
    goal,
    recompDeficit,
  });

  const handleSubmit = () => {
    onSave({
      displayName: displayName.trim() || undefined,
      photoURL: photoURL || undefined,
      age: numAge,
      gender,
      height: numHeight,
      weight: numWeight,
      bodyFat: numBodyFat,
      activityLevel,
      goal,
      recompDeficit,
    });
    if (onClose) onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Sparkles size={24} color="#10B981" />
            <Text style={styles.headerTitle}>
              {isEditMode ? 'Edit Fitness Profile' : 'Welcome to Fitchamp'}
            </Text>
          </View>
          <Text style={styles.headerSubtitle}>
            {isEditMode
              ? 'Update your body metrics and fitness goals below.'
              : 'Let us personalize your daily caloric and macronutrient targets.'}
          </Text>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Profile Photo and Name */}
            <View style={styles.profileEditSection}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' }}
                  style={styles.avatarImage}
                />
              </View>
              
              <View style={styles.photoButtonsRow}>
                <TouchableOpacity style={styles.photoBtn} onPress={() => handleTriggerPhotoUpload(true)}>
                  <Camera size={16} color="#0F172A" />
                  <Text style={styles.photoBtnText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.photoBtn, styles.photoBtnSecondary]} onPress={() => handleTriggerPhotoUpload(false)}>
                  <ImageIcon size={16} color="#94A3B8" />
                  <Text style={styles.photoBtnSecondaryText}>Gallery</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputGroupFull}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="e.g. John Doe"
                  placeholderTextColor="#64748B"
                />
              </View>
            </View>

            <Text style={styles.sectionHeader}>Body Metrics</Text>
            {/* Age & Gender */}
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Age (years)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                  placeholder="25"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1.2 }]}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderRow}>
                  {(['male', 'female'] as Gender[]).map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.genderChip, gender === g && styles.genderChipActive]}
                      onPress={() => setGender(g)}
                    >
                      <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                        {g.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Height & Weight */}
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                  placeholder="180"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="78"
                  placeholderTextColor="#64748B"
                />
              </View>
            </View>

            {/* Body Fat % */}
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Body Fat % (Optional)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={bodyFat}
                  onChangeText={setBodyFat}
                  placeholder="e.g. 15"
                  placeholderTextColor="#64748B"
                />
              </View>
            </View>

            {/* Activity Level Selector */}
            <Text style={styles.sectionHeader}>Activity Level</Text>
            {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((level) => {
              const item = ACTIVITY_LABELS[level];
              const isSelected = activityLevel === level;
              return (
                <TouchableOpacity
                  key={level}
                  style={[styles.activityCard, isSelected && styles.activityCardSelected]}
                  onPress={() => setActivityLevel(level)}
                >
                  <View style={styles.activityTextGroup}>
                    <Text style={[styles.activityLabel, isSelected && styles.activityLabelSelected]}>
                      {item.label}
                    </Text>
                    <Text style={styles.activityDesc}>{item.desc}</Text>
                  </View>
                  {isSelected && <Sparkles size={16} color="#10B981" />}
                </TouchableOpacity>
              );
            })}

            {/* Fitness Goal Selector */}
            <Text style={styles.sectionHeader}>Primary Fitness Goal</Text>
            <View style={styles.goalGrid}>
              {[
                { id: 'bulk' as FitnessGoal, label: 'Bulk', desc: 'Surplus (+15%)' },
                { id: 'cut' as FitnessGoal, label: 'Cut', desc: 'Deficit (-20%)' },
                { id: 'maintain' as FitnessGoal, label: 'Maintain', desc: 'TDEE (0%)' },
                { id: 'recomp' as FitnessGoal, label: 'Recomp', desc: 'Muscle & Fat (-7.5%)' },
              ].map((g) => {
                const isSelected = goal === g.id;
                return (
                  <TouchableOpacity
                    key={g.id}
                    style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                    onPress={() => setGoal(g.id)}
                  >
                    <Text style={[styles.goalTitle, isSelected && styles.goalTitleSelected]}>
                      {g.label}
                    </Text>
                    <Text style={styles.goalDesc}>{g.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Recomp Deficit Slider / Options */}
            {goal === 'recomp' && (
              <View style={styles.recompBox}>
                <Text style={styles.recompTitle}>Recomp Deficit Adjustment</Text>
                <View style={styles.recompBtnRow}>
                  {[5, 7.5, 10].map((val) => (
                    <TouchableOpacity
                      key={val}
                      style={[styles.recompChip, recompDeficit === val && styles.recompChipActive]}
                      onPress={() => setRecompDeficit(val)}
                    >
                      <Text style={[styles.recompChipText, recompDeficit === val && styles.recompChipTextActive]}>
                        -{val}% Deficit
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Live Calculation Preview Card */}
            <View style={styles.previewCard}>
              <Text style={styles.previewHeader}>Calculated Macro Targets</Text>

              <View style={styles.previewMetricsRow}>
                <View style={styles.previewStat}>
                  <Text style={styles.previewStatLabel}>BMR</Text>
                  <Text style={styles.previewStatValue}>{calculatedBmr} kcal</Text>
                </View>

                <View style={styles.previewStat}>
                  <Text style={styles.previewStatLabel}>TDEE</Text>
                  <Text style={styles.previewStatValue}>{calculatedTdee} kcal</Text>
                </View>

                <View style={styles.previewStat}>
                  <Text style={styles.previewStatLabel}>Daily Target</Text>
                  <Text style={[styles.previewStatValue, { color: '#10B981' }]}>
                    {macroSummary.targetCalories} kcal
                  </Text>
                </View>

                <View style={styles.previewStat}>
                  <Text style={styles.previewStatLabel}>Water</Text>
                  <Text style={[styles.previewStatValue, { color: '#38BDF8' }]}>
                    {macroSummary.waterIntake} L
                  </Text>
                </View>
              </View>

              <View style={styles.macroPillsRow}>
                <View style={[styles.macroPill, { borderColor: '#10B981' }]}>
                  <Text style={styles.macroPillLabel}>Protein</Text>
                  <Text style={styles.macroPillVal}>{macroSummary.proteinGrams}g</Text>
                </View>

                <View style={[styles.macroPill, { borderColor: '#3B82F6' }]}>
                  <Text style={styles.macroPillLabel}>Carbs</Text>
                  <Text style={styles.macroPillVal}>{macroSummary.carbGrams}g</Text>
                </View>

                <View style={[styles.macroPill, { borderColor: '#EC4899' }]}>
                  <Text style={styles.macroPillLabel}>Fat</Text>
                  <Text style={styles.macroPillVal}>{macroSummary.fatGrams}g</Text>
                </View>
              </View>

              <Text style={styles.explanationText}>{macroSummary.goalExplanation}</Text>
            </View>
          </ScrollView>

          {/* Footer Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>
              {isEditMode ? 'Update Profile' : 'Save & Calculate Targets'}
            </Text>
            <ChevronRight size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '92%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    marginLeft: 8,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 16,
  },
  scrollBody: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  inputGroup: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    color: '#F8FAFC',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  genderRow: {
    flexDirection: 'row',
    height: 46,
  },
  genderChip: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  genderChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  genderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  genderTextActive: {
    color: '#0F172A',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 14,
    marginBottom: 8,
  },
  activityCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  activityCardSelected: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  activityTextGroup: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  activityLabelSelected: {
    color: '#10B981',
  },
  activityDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  goalCardSelected: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  goalTitleSelected: {
    color: '#10B981',
  },
  goalDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  recompBox: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  recompTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 6,
  },
  recompBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recompChip: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    marginHorizontal: 3,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  recompChipActive: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  recompChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  recompChipTextActive: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  previewCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  previewHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 10,
  },
  previewMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  previewStat: {
    alignItems: 'center',
  },
  previewStatLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  previewStatValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 2,
  },
  macroPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  macroPill: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 8,
    marginHorizontal: 3,
    alignItems: 'center',
    borderLeftWidth: 3,
  },
  macroPillLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  macroPillVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 2,
  },
  explanationText: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 6,
  },
  profileEditSection: {
    marginBottom: 20,
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  photoButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  photoBtn: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  photoBtnText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 6,
  },
  photoBtnSecondary: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  photoBtnSecondaryText: {
    color: '#94A3B8',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 6,
  },
  inputGroupFull: {
    marginBottom: 8,
  },
});
