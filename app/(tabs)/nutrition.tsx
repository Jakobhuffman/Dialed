import React, { useEffect, useState } from 'react'
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { loadUserProfile } from '../../lib/storage'
import { calculateCalorieGoal, UserProfile } from '../../lib/calorie'
import {
  addFoodLog,
  FoodLog,
  getTodayFoodLogs,
  addQuickMeal,
} from '../../lib/food'
import authStyles from '../../styles/auth.styles'

export default function NutritionScreen() {
  const [goal, setGoal] = useState<number | null>(null)
  const [logs, setLogs] = useState<FoodLog[]>([])
  const handleSaveQuickMeal = async (log: FoodLog) => {
    await addQuickMeal({
      name: log.name,
      calories: log.calories,
      servingSize: log.servingSize,
      meal: log.meal,
    })
  }
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    name: '',
    calories: '',
    servingSize: '',
    meal: 'Breakfast',
  })

  useEffect(() => {
    const fetch = async () => {
      const profile = await loadUserProfile()
      if (profile) {
        setGoal(calculateCalorieGoal(profile as UserProfile))
      }
      const todayLogs = await getTodayFoodLogs()
      setLogs(todayLogs)
    }
    fetch()
  }, [])

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
    setForm({ name: '', calories: '', servingSize: '', meal: 'Breakfast' })
    setShowModal(false)
  }

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>Nutrition</Text>
      {goal ? (
        <View style={authStyles.goalBox}>
          <Text style={authStyles.goalText}>
            Your daily calorie goal is {goal} kcal
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

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        style={authStyles.list}
        renderItem={({ item }) => (
          <View style={authStyles.goalBox}>
            <Text style={authStyles.goalText}>
              {item.meal}: {item.name} - {item.calories} cal ({item.servingSize})
            </Text>
            <TouchableOpacity
              onPress={() => handleSaveQuickMeal(item)}
              style={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Text>✅</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={[authStyles.container, { backgroundColor: '#000000cc' }]}>
          <View style={authStyles.form}>
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
          </View>
        </View>
      </Modal>
    </View>
  )
}