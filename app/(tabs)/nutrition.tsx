import { Ionicons } from '@expo/vector-icons'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { Picker } from '@react-native-picker/picker'
import React, { useEffect, useState } from 'react'
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { calculateCalorieGoal, UserProfile } from '../../lib/calorie'
import {
  addFoodLog,
  addQuickMeal,
  FoodLog,
  getQuickMeals,
  getTodayFoodLogs,
  removeQuickMeal,
  removeFoodLog,
} from '../../lib/food'
import { loadUserProfile } from '../../lib/storage'
import authStyles from '../../styles/auth.styles'
import { useRouter, useLocalSearchParams } from 'expo-router'


export default function NutritionScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ scannedItem?: string }>()

  const [goal, setGoal] = useState<number | null>(null)
  const [proteinGoal, setProteinGoal] = useState<number | null>(null)
  const [proteinEaten, setProteinEaten] = useState(0)
  const [logs, setLogs] = useState<FoodLog[]>([])
  const [quickMeals, setQuickMeals] = useState<FoodLog[]>([])
  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    name: '',
    calories: '',
    servingSize: '',
    protein: '',
    carbs: '',
    fat: '',
    meal: 'Breakfast',
  })

  useEffect(() => {
    if (params.scannedItem) {
      try {
        const item = JSON.parse(params.scannedItem as string)
        setForm({
          name: item.name,
          calories: String(item.calories),
          servingSize: item.servingSize,
          protein: String(item.protein ?? ''),
          carbs: String(item.carbs ?? ''),
          fat: String(item.fat ?? ''),
          meal: 'Breakfast',
        })
        setShowModal(true)
      } catch {}
    }
  }, [params.scannedItem])

  const handleSaveQuickMeal = async (log: FoodLog) => {
    await addQuickMeal({
      name: log.name,
      calories: log.calories,
      servingSize: log.servingSize,
      protein: log.protein,
      carbs: log.carbs,
      fat: log.fat,
      meal: log.meal,
    })
    const updated = await getQuickMeals()
    setQuickMeals(updated)
  }

  const handleQuickLog = async (log: FoodLog) => {
    const entry = await addFoodLog(log)
    setLogs((prev) => [...prev, entry])
    setProteinEaten((prev) => prev + (entry.protein ?? 0))
  }

  const handleDeleteLog = async (id: string) => {
    await removeFoodLog(id)
    setLogs((prev) => {
      const updated = prev.filter((l) => l.id !== id)
      const removed = prev.find((l) => l.id === id)
      if (removed) {
        setProteinEaten((p) => p - (removed.protein ?? 0))
      }
      return updated
    })
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAdd = async () => {
    if (!form.name || !form.calories) return
    const entry = await addFoodLog({
      name: form.name,
      calories: parseFloat(form.calories),
      servingSize: form.servingSize,
      protein: parseFloat(form.protein) || 0,
      carbs: parseFloat(form.carbs) || 0,
      fat: parseFloat(form.fat) || 0,
      meal: form.meal,
    })
    setLogs((prev) => [...prev, entry])
    setProteinEaten((prev) => prev + (entry.protein ?? 0))
    setShowModal(false)
  }

  const handleDeleteQuickMeal = async (meal: FoodLog) => {
    await removeQuickMeal(meal)
    const updated = await getQuickMeals()
    setQuickMeals(updated)
  }

  useEffect(() => {
    const fetch = async () => {
      const profile = await loadUserProfile()
      if (profile) {
        setGoal(calculateCalorieGoal(profile as UserProfile))
        setProteinGoal(calculateProteinGoal(profile as UserProfile))
      }
      const todays = await getTodayFoodLogs()
      setLogs(todays)
      setProteinEaten(
        todays.reduce((sum, l) => sum + (l.protein ?? 0), 0)
      )
      const quickMealsRaw = await getQuickMeals()
      setQuickMeals(quickMealsRaw)
    }
    fetch()
  }, [])

  const proteinFill = proteinGoal
    ? Math.min((proteinEaten / proteinGoal) * 100, 100)
    : 0

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1A1A' }}>
      <ScrollView contentContainerStyle={authStyles.scrollContainer}>
        <Text style={authStyles.title}>Nutrition</Text>

        {proteinGoal !== null && (
          <View style={authStyles.ringCard}>
            <AnimatedCircularProgress
              size={200}
              width={16}
              fill={proteinFill}
              tintColor="#c71585"
              backgroundColor="#2C2C2C"
              lineCap="round"
              rotation={0}
              duration={1000}
            >
              {() => (
                <Text style={authStyles.progressText}>
                  {proteinEaten} / {proteinGoal} g
                </Text>
              )}
            </AnimatedCircularProgress>
          </View>
        )}

        {goal ? (
          <View style={authStyles.goalBox}>
            <Text style={authStyles.goalText}>
              Stay strong! Aim for {goal} kcal today.
            </Text>
          </View>
        ) : (
          <Text style={authStyles.goalText}>Add your profile to see goals.</Text>
        )}

        <TouchableOpacity
          style={authStyles.button}
          onPress={() => setShowModal(true)}
        >
          <Text style={authStyles.buttonText}>Log Food</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={authStyles.button}
          onPress={() => router.push('/scanner')}
        >
          <Text style={authStyles.buttonText}>Scan Barcode</Text>
        </TouchableOpacity>

        {quickMeals.length > 0 && (
          <View style={authStyles.sectionBox}>
            <Text style={[authStyles.title, { marginBottom: 12 }]}>Quick Meals</Text>
            {quickMeals.map((item) => (
              <View key={item.id} style={authStyles.goalBox}>
                <TouchableOpacity
                  style={{ flex: 1, marginRight: 10 }}
                  onPress={() => handleQuickLog(item)}
                >
                  <Text style={authStyles.goalText}>
                    {item.meal}: {item.name} - {item.calories} cal ({item.servingSize}) P:{item.protein ?? 0}g C:{item.carbs ?? 0}g F:{item.fat ?? 0}g
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteQuickMeal(item)}>
                  <Ionicons name="trash" size={20} color="#39FF14" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={authStyles.sectionBox}>
          <Text style={[authStyles.title, { marginBottom: 12 }]}>History</Text>
          {logs.map((item) => (
            <View key={item.id} style={authStyles.goalBox}>
              <Text style={[authStyles.goalText, { flex: 1, marginRight: 10 }]}>
                {item.name} {item.calories} kcal ({item.servingSize}) P:{item.protein ?? 0}g C:{item.carbs ?? 0}g F:{item.fat ?? 0}g
              </Text>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <TouchableOpacity onPress={() => handleSaveQuickMeal(item)}>
                  <Ionicons name="save-outline" size={20} color="#39FF14" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteLog(item.id)}>
                  <Ionicons name="trash" size={20} color="#39FF14" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={[authStyles.container, { backgroundColor: '#000000cc' }]}>
          <ScrollView contentContainerStyle={authStyles.form}>
            <TextInput
              style={authStyles.input}
              placeholder="Food name"
              placeholderTextColor="#aaa"
              value={form.name}
              onChangeText={(t) => handleChange('name', t)}
            />
            <TextInput
              style={authStyles.input}
              placeholder="Calories"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={form.calories}
              onChangeText={(t) => handleChange('calories', t)}
            />
            <TextInput
              style={authStyles.input}
              placeholder="Serving size"
              placeholderTextColor="#aaa"
              value={form.servingSize}
              onChangeText={(t) => handleChange('servingSize', t)}
            />
            <TextInput
              style={authStyles.input}
              placeholder="Protein (g)"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={form.protein}
              onChangeText={(t) => handleChange('protein', t)}
            />
            <TextInput
              style={authStyles.input}
              placeholder="Carbs (g)"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={form.carbs}
              onChangeText={(t) => handleChange('carbs', t)}
            />
            <TextInput
              style={authStyles.input}
              placeholder="Fat (g)"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={form.fat}
              onChangeText={(t) => handleChange('fat', t)}
            />
            <Text style={authStyles.label}>Meal</Text>
            <View style={authStyles.pickerWrapper}>
              <Picker
                selectedValue={form.meal}
                onValueChange={(v) => handleChange('meal', v)}
                style={authStyles.picker}
                dropdownIconColor="#39FF14"
              >
                <Picker.Item label="Breakfast" value="Breakfast" />
                <Picker.Item label="Lunch" value="Lunch" />
                <Picker.Item label="Dinner" value="Dinner" />
                <Picker.Item label="Snack" value="Snack" />
              </Picker>
            </View>
            <TouchableOpacity style={authStyles.button} onPress={handleAdd}>
              <Text style={authStyles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={authStyles.button}
              onPress={() => setShowModal(false)}
            >
              <Text style={authStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}
