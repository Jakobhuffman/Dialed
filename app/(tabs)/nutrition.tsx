import { Ionicons } from '@expo/vector-icons'
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


export default function NutritionScreen() {
  const [goal, setGoal] = useState<number | null>(null)
  const [logs, setLogs] = useState<FoodLog[]>([])
  const [quickMeals, setQuickMeals] = useState<FoodLog[]>([])
  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    name: '',
    calories: '',
    servingSize: '',
    meal: 'Breakfast',
  })

  const handleSaveQuickMeal = async (log: FoodLog) => {
    await addQuickMeal({
      name: log.name,
      calories: log.calories,
      servingSize: log.servingSize,
      meal: log.meal,
    })
    const updated = await getQuickMeals()
    // Ensure each quick meal has id and time fields
    setQuickMeals(
      updated.map((item, idx) => ({
        ...item,
        id: (item as any).id ?? `quickmeal-${idx}-${item.name}`,
        time: (item as any).time ?? new Date().toISOString(),
      }))
    )
  }

  const handleQuickLog = async (log: FoodLog) => {
    const entry = await addFoodLog(log)
    setLogs((prev) => [...prev, entry])
  }

  const handleDeleteLog = async (id: string) => {
    await removeFoodLog(id)
    setLogs((prev) => prev.filter((l) => l.id !== id))
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
      meal: form.meal,
    })
    setLogs((prev) => [...prev, entry])
    setShowModal(false)
  }

  const handleDeleteQuickMeal = async (meal: FoodLog) => {
    await removeQuickMeal({
      name: meal.name,
      calories: meal.calories,
      servingSize: meal.servingSize,
      meal: meal.meal,
    })
    const updated = await getQuickMeals()
    setQuickMeals(
      updated.map((item, idx) => ({
        ...item,
        id: (item as any).id ?? `quickmeal-${idx}-${item.name}`,
        time: (item as any).time ?? new Date().toISOString(),
      }))
    )
  }

  useEffect(() => {
    const fetch = async () => {
      const profile = await loadUserProfile()
      if (profile) {
        setGoal(calculateCalorieGoal(profile as UserProfile))
      }
      setLogs(await getTodayFoodLogs())
      const quickMealsRaw = await getQuickMeals()
      setQuickMeals(
        quickMealsRaw.map((item, idx) => ({
          ...item,
          id: (item as any).id ?? `quickmeal-${idx}-${item.name}`,
          time: (item as any).time ?? new Date().toISOString(),
        }))
      )
    }
    fetch()
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1A1A' }}>
      <ScrollView contentContainerStyle={authStyles.scrollContainer}>
        <Text style={authStyles.title}>Nutrition</Text>

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
                    {item.meal}: {item.name} - {item.calories} cal ({item.servingSize})
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
                {item.name} {item.calories} kcal ({item.servingSize})
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
