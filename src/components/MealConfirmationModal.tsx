import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Check, X, Sparkles, Scale, Flame, Activity, Minus, Plus } from 'lucide-react-native';
import { MealItem, MealType } from '../types';
import { FoodAiAnalysisResult, scaleMealItemByPortion } from '../services/foodAiService';

interface MealConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (confirmedMeal: Omit<MealItem, 'id' | 'userId' | 'loggedAt'>) => void;
  aiResult: FoodAiAnalysisResult | null;
  photoUrl?: string;
}

export const MealConfirmationModal: React.FC<MealConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  aiResult,
  photoUrl,
}) => {
  const [name, setName] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [portionGrams, setPortionGrams] = useState(250);
  const [calories, setCalories] = useState(450);
  const [protein, setProtein] = useState(30);
  const [carbs, setCarbs] = useState(40);
  const [fat, setFat] = useState(15);
  const [fiber, setFiber] = useState(5);

  useEffect(() => {
    if (aiResult) {
      setName(aiResult.name);
      setMealType(aiResult.mealType || 'lunch');
      setPortionGrams(aiResult.portionGrams);
      setCalories(aiResult.calories);
      setProtein(aiResult.protein);
      setCarbs(aiResult.carbs);
      setFat(aiResult.fat);
      setFiber(aiResult.fiber || 0);
    }
  }, [aiResult]);

  const handlePortionChange = (newPortion: number) => {
    if (newPortion < 10) newPortion = 10;
    setPortionGrams(newPortion);
    if (aiResult) {
      const scaled = scaleMealItemByPortion(aiResult, newPortion);
      setCalories(scaled.calories);
      setProtein(scaled.protein);
      setCarbs(scaled.carbs);
      setFat(scaled.fat);
      setFiber(scaled.fiber);
    }
  };

  const handleSave = () => {
    onConfirm({
      name: name || 'Logged Meal',
      mealType,
      portionGrams: Math.round(portionGrams),
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      fiber: Math.round(fiber),
      photoUrl,
      confidenceScore: aiResult?.confidenceScore || 0.95,
      isAiDetected: !!aiResult,
      micros: aiResult?.micros,
    });
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badgeRow}>
              <Sparkles size={18} color="#10B981" />
              <Text style={styles.headerTitle}>Confirm Meal Details</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <Text style={styles.disclaimerText}>
            Photo estimates are AI generated. Verify and edit your portion or macros below before saving to your log.
          </Text>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Meal Name Input */}
            <Text style={styles.fieldLabel}>Dish / Food Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Grilled Chicken & Rice"
              placeholderTextColor="#64748B"
            />

            {/* Meal Category Selection */}
            <Text style={styles.fieldLabel}>Meal Category</Text>
            <View style={styles.mealTypeRow}>
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.mealTypeChip, mealType === type && styles.mealTypeChipActive]}
                  onPress={() => setMealType(type)}
                >
                  <Text style={[styles.mealTypeText, mealType === type && styles.mealTypeTextActive]}>
                    {type.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Portion Control Box */}
            <View style={styles.portionBox}>
              <View style={styles.portionHeader}>
                <View style={styles.iconLabelGroup}>
                  <Scale size={18} color="#3B82F6" />
                  <Text style={styles.portionTitle}>Portion Weight</Text>
                </View>
                <Text style={styles.portionValueDisplay}>{portionGrams} g</Text>
              </View>

              <View style={styles.portionControlButtons}>
                <TouchableOpacity style={styles.quickStepBtn} onPress={() => handlePortionChange(portionGrams - 50)}>
                  <Minus size={16} color="#F8FAFC" />
                  <Text style={styles.stepBtnText}>-50g</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickStepBtn} onPress={() => handlePortionChange(portionGrams - 10)}>
                  <Minus size={16} color="#F8FAFC" />
                  <Text style={styles.stepBtnText}>-10g</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickStepBtn} onPress={() => handlePortionChange(portionGrams + 10)}>
                  <Plus size={16} color="#F8FAFC" />
                  <Text style={styles.stepBtnText}>+10g</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickStepBtn} onPress={() => handlePortionChange(portionGrams + 50)}>
                  <Plus size={16} color="#F8FAFC" />
                  <Text style={styles.stepBtnText}>+50g</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Detected Vegetables & Ingredients */}
            {aiResult?.ingredients && aiResult.ingredients.length > 0 && (
              <View style={styles.ingredientsContainer}>
                <View style={styles.ingredientsHeaderRow}>
                  <Sparkles size={14} color="#10B981" />
                  <Text style={styles.ingredientsTitle}>Detected Vegetables & Ingredients</Text>
                </View>
                <View style={styles.ingredientsList}>
                  {aiResult.ingredients.map((ing, idx) => (
                    <View key={idx} style={styles.ingredientBadge}>
                      <Text style={styles.ingredientNameText}>{ing.name}</Text>
                      <Text style={styles.ingredientWeightText}>{ing.weightGrams}g</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Editable Macro Grid */}
            <Text style={styles.fieldLabel}>Nutritional Breakdown (Editable)</Text>

            <View style={styles.macroGrid}>
              <View style={[styles.macroItemCard, { borderColor: '#F59E0B' }]}>
                <Flame size={16} color="#F59E0B" />
                <Text style={styles.macroCardLabel}>Calories</Text>
                <TextInput
                  style={styles.macroInput}
                  keyboardType="numeric"
                  value={String(calories)}
                  onChangeText={(v) => setCalories(Number(v) || 0)}
                />
                <Text style={styles.macroUnit}>kcal</Text>
              </View>

              <View style={[styles.macroItemCard, { borderColor: '#10B981' }]}>
                <Activity size={16} color="#10B981" />
                <Text style={styles.macroCardLabel}>Protein</Text>
                <TextInput
                  style={styles.macroInput}
                  keyboardType="numeric"
                  value={String(protein)}
                  onChangeText={(v) => setProtein(Number(v) || 0)}
                />
                <Text style={styles.macroUnit}>grams</Text>
              </View>

              <View style={[styles.macroItemCard, { borderColor: '#3B82F6' }]}>
                <Activity size={16} color="#3B82F6" />
                <Text style={styles.macroCardLabel}>Carbs</Text>
                <TextInput
                  style={styles.macroInput}
                  keyboardType="numeric"
                  value={String(carbs)}
                  onChangeText={(v) => setCarbs(Number(v) || 0)}
                />
                <Text style={styles.macroUnit}>grams</Text>
              </View>

              <View style={[styles.macroItemCard, { borderColor: '#EC4899' }]}>
                <Activity size={16} color="#EC4899" />
                <Text style={styles.macroCardLabel}>Fat</Text>
                <TextInput
                  style={styles.macroInput}
                  keyboardType="numeric"
                  value={String(fat)}
                  onChangeText={(v) => setFat(Number(v) || 0)}
                />
                <Text style={styles.macroUnit}>grams</Text>
              </View>
            </View>

            {/* Micronutrients Pill Badges */}
            {aiResult?.micros && (
              <View style={styles.microsContainer}>
                <Text style={styles.microsTitle}>Detected Micronutrients</Text>
                <View style={styles.microsList}>
                  {aiResult.micros.iron && <Text style={styles.microTag}>Iron: {aiResult.micros.iron}mg</Text>}
                  {aiResult.micros.calcium && <Text style={styles.microTag}>Calcium: {aiResult.micros.calcium}mg</Text>}
                  {aiResult.micros.vitaminC && <Text style={styles.microTag}>Vit C: {aiResult.micros.vitaminC}mg</Text>}
                  {aiResult.micros.potassium && <Text style={styles.microTag}>Potassium: {aiResult.micros.potassium}mg</Text>}
                  {aiResult.micros.sodium && <Text style={styles.microTag}>Sodium: {aiResult.micros.sodium}mg</Text>}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Discard</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmBtn} onPress={handleSave}>
              <Check size={18} color="#0F172A" />
              <Text style={styles.confirmBtnText}>Save to Diary (+50 Pts)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 16,
  },
  scrollBody: {
    marginBottom: 16,
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
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  mealTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mealTypeChip: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 3,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  mealTypeChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  mealTypeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  mealTypeTextActive: {
    color: '#0F172A',
  },
  portionBox: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  portionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    marginLeft: 8,
  },
  portionValueDisplay: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3B82F6',
  },
  portionControlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  stepBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
    marginLeft: 4,
  },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  macroItemCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  macroCardLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  macroInput: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    marginVertical: 4,
  },
  macroUnit: {
    fontSize: 10,
    color: '#64748B',
  },
  ingredientsContainer: {
    marginTop: 10,
    marginBottom: 12,
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  ingredientsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 6,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ingredientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  ingredientNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F8FAFC',
    marginRight: 6,
  },
  ingredientWeightText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
  },
  microsContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    padding: 10,
    borderRadius: 12,
  },
  microsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
  },
  microsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  microTag: {
    backgroundColor: '#334155',
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  actionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelBtnText: {
    color: '#94A3B8',
    fontWeight: '700',
    fontSize: 14,
  },
  confirmBtn: {
    flex: 2,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 14,
    marginLeft: 6,
  },
});
