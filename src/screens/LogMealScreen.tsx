import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Camera, Search, Plus, Trash2, Sparkles, Flame, ChevronRight, Activity, Image as ImageIcon } from 'lucide-react-native';
import { MealItem, MealType } from '../types';
import { COMMON_FOOD_DATABASE, FoodAiAnalysisResult, analyzeMealPhoto } from '../services/foodAiService';
import { MealConfirmationModal } from '../components/MealConfirmationModal';
import { getTodayDateString } from '../services/stepTracker';

interface LogMealScreenProps {
  meals: MealItem[];
  onAddMeal: (meal: Omit<MealItem, 'id' | 'userId' | 'loggedAt'>) => void;
  onDeleteMeal: (mealId: string) => void;
}

export const LogMealScreen: React.FC<LogMealScreenProps> = ({ meals, onAddMeal, onDeleteMeal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [activeModalResult, setActiveModalResult] = useState<FoodAiAnalysisResult | null>(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [samplePhotoUrl, setSamplePhotoUrl] = useState<string | undefined>(undefined);

  const todayStr = getTodayDateString();
  const todaysMeals = meals.filter((m) => m.loggedAt === todayStr);

  // Filtered food search results
  const filteredFoods = searchQuery.trim()
    ? COMMON_FOOD_DATABASE.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : COMMON_FOOD_DATABASE.slice(0, 5);

  const handleTriggerAiPhotoScan = (useCamera: boolean) => {
    try {
      if (typeof document !== 'undefined') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        if (useCamera) {
          input.capture = 'environment';
        }
        
        input.onchange = async (e: any) => {
          const file = e.target?.files?.[0];
          if (!file) return;
          
          setIsScanningPhoto(true);
          const reader = new FileReader();
          reader.onload = async (event) => {
            try {
              const base64Url = event.target?.result as string;
              setSamplePhotoUrl(base64Url);
              const result = await analyzeMealPhoto(base64Url);
              setActiveModalResult(result);
              setIsConfirmationModalVisible(true);
            } catch (err) {
              console.error('Photo scan error:', err);
              let errorMsg = err instanceof Error ? err.message : String(err);
              try {
                if (errorMsg.includes('{')) {
                  const jsonStart = errorMsg.indexOf('{');
                  const jsonParsed = JSON.parse(errorMsg.slice(jsonStart));
                  if (jsonParsed?.error?.message) {
                    errorMsg = jsonParsed.error.message;
                  }
                }
              } catch {
                // keep original if parse fails
              }
              alert('Analysis Notice: ' + errorMsg);
            } finally {
              setIsScanningPhoto(false);
            }
          };
          reader.readAsDataURL(file);
        };
        input.click();
      }
    } catch (err) {
      console.error('File picker error:', err);
    }
  };

  const handleSelectSearchResult = (foodItem: (typeof COMMON_FOOD_DATABASE)[0]) => {
    setActiveModalResult({
      name: foodItem.name,
      portionGrams: foodItem.portionGrams,
      calories: foodItem.calories,
      protein: foodItem.protein,
      carbs: foodItem.carbs,
      fat: foodItem.fat,
      fiber: foodItem.fiber,
      confidenceScore: 0.99,
      mealType: 'lunch',
      micros: foodItem.micros,
      description: `Manual database selection: ${foodItem.category}`,
    });
    setSamplePhotoUrl(undefined);
    setIsConfirmationModalVisible(true);
  };

  const handleConfirmMealSave = (confirmedData: Omit<MealItem, 'id' | 'userId' | 'loggedAt'>) => {
    onAddMeal(confirmedData);
  };

  const renderMealGroup = (type: MealType, title: string) => {
    const groupMeals = todaysMeals.filter((m) => m.mealType === type);
    const groupCals = groupMeals.reduce((sum, m) => sum + m.calories, 0);

    return (
      <View key={type} style={styles.groupContainer}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupTitle}>{title}</Text>
          <Text style={styles.groupCalsText}>{groupCals} kcal</Text>
        </View>

        {groupMeals.length === 0 ? (
          <View style={styles.emptyGroupCard}>
            <Text style={styles.emptyGroupText}>No {title.toLowerCase()} logged yet.</Text>
          </View>
        ) : (
          groupMeals.map((meal) => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealLeft}>
                {meal.isAiDetected && (
                  <View style={styles.aiTag}>
                    <Sparkles size={12} color="#10B981" />
                    <Text style={styles.aiTagText}>AI Photo</Text>
                  </View>
                )}
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealPortionText}>
                  {meal.portionGrams}g • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                </Text>
              </View>

              <View style={styles.mealRight}>
                <Text style={styles.mealCalsText}>{meal.calories} kcal</Text>
                <TouchableOpacity onPress={() => onDeleteMeal(meal.id)} style={styles.deleteBtn}>
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Banner */}
      <View style={styles.topHeader}>
        <Text style={styles.title}>Meal Logger & Food Scanner</Text>
        <Text style={styles.subtitle}>Snap a meal photo or search our nutrition database</Text>
      </View>

      {/* AI Photo Camera Button */}
      <TouchableOpacity
        style={[styles.aiPhotoButton, isScanningPhoto && styles.aiPhotoButtonScanning]}
        onPress={() => handleTriggerAiPhotoScan(true)}
        disabled={isScanningPhoto}
        activeOpacity={0.85}
      >
        {isScanningPhoto ? (
          <View style={styles.scanningRow}>
            <Sparkles size={22} color="#0F172A" />
            <Text style={styles.aiPhotoBtnText}>AI Analyzing Meal Vision...</Text>
          </View>
        ) : (
          <View style={styles.scanningRow}>
            <Camera size={22} color="#0F172A" />
            <Text style={styles.aiPhotoBtnText}>Take a Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Gallery Button */}
      <TouchableOpacity
        style={styles.galleryButton}
        onPress={() => handleTriggerAiPhotoScan(false)}
        disabled={isScanningPhoto}
        activeOpacity={0.8}
      >
        <ImageIcon size={18} color="#94A3B8" />
        <Text style={styles.galleryBtnText}>Choose from Gallery</Text>
      </TouchableOpacity>

      {/* Food Search Section */}
      <View style={styles.searchBox}>
        <Search size={18} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search food database (e.g. Paneer Butter Masala, Dal Tadka, Biryani)..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Quick Search Suggestions */}
      <Text style={styles.sectionHeader}>Database Suggestions</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsRow}>
        {filteredFoods.map((food, i) => (
          <TouchableOpacity
            key={i}
            style={styles.foodSuggestionCard}
            onPress={() => handleSelectSearchResult(food)}
          >
            <Text style={styles.foodSugName}>{food.name}</Text>
            <Text style={styles.foodSugMeta}>
              {food.portionGrams}g • {food.calories} kcal
            </Text>
            <View style={styles.foodSugAddBtn}>
              <Plus size={14} color="#10B981" />
              <Text style={styles.foodSugAddText}>Add & Verify</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Daily Food Diary */}
      <View style={styles.diaryHeaderRow}>
        <Text style={styles.sectionHeader}>Today's Food Diary</Text>
        <Text style={styles.totalCalsTag}>
          Total: {todaysMeals.reduce((acc, m) => acc + m.calories, 0)} kcal
        </Text>
      </View>

      {renderMealGroup('breakfast', 'Breakfast')}
      {renderMealGroup('lunch', 'Lunch')}
      {renderMealGroup('dinner', 'Dinner')}
      {renderMealGroup('snack', 'Snacks & Drinks')}

      {/* Confirmation Modal */}
      <MealConfirmationModal
        visible={isConfirmationModalVisible}
        onClose={() => setIsConfirmationModalVisible(false)}
        onConfirm={handleConfirmMealSave}
        aiResult={activeModalResult}
        photoUrl={samplePhotoUrl}
      />

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
  aiPhotoButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 4,
  },
  aiPhotoButtonScanning: {
    backgroundColor: '#38BDF8',
  },
  scanningRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiPhotoBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 10,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  galleryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginLeft: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    marginLeft: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 10,
  },
  suggestionsRow: {
    marginBottom: 20,
  },
  foodSuggestionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    marginRight: 10,
    width: 170,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  foodSugName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  foodSugMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  foodSugAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#0F172A',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  foodSugAddText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 4,
  },
  diaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalCalsTag: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F59E0B',
  },
  groupContainer: {
    marginBottom: 14,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#CBD5E1',
  },
  groupCalsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  emptyGroupCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyGroupText: {
    fontSize: 12,
    color: '#64748B',
  },
  mealCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  mealLeft: {
    flex: 1,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  aiTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 4,
  },
  mealName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  mealPortionText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  mealRight: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  mealCalsText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F59E0B',
    marginRight: 10,
  },
  deleteBtn: {
    padding: 4,
  },
});
