import React, { useEffect, useState } from 'react'
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { calculateCalorieGoal, UserProfile } from '../../lib/calorie'
import {
  addFoodLog,
  addQuickMeal,
  FoodLog,
  getQuickMeals,
  getTodayFoodLogs,
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
    await addQuickMeal(log)
    const updated = await getQuickMeals()
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

  useEffect(() => {
    const fetch = async () => {
      const profile = await loadUserProfile()
      if (profile) setGoal(calculateCalorieGoal(profile as UserProfile))

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
    <FlatList
      data={logs}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={authStyles.container}>
          <Text style={authStyles.title}>Nutrition</Text>

          {goal ? (
            <View style={authStyles.goalBox}>
              <Text style={authStyles.goalText}>
                Your daily calorie goal is {goal} kcal
              </Text>
            </View>
          ) : (
            <Text style={authStyles.goalText}>
              Add your profile to see goals.
            </Text>
          )}

          <TouchableOpacity
            style={authStyles.button}
            onPress={() => setShowModal(true)}
          >
            <Text style={authStyles.buttonText}>Log Food</Text>
          </TouchableOpacity>

          {quickMeals.length > 0 && (
            <View>
              <Text style={authStyles.title}>Quick Meals</Text>
              {quickMeals.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={authStyles.goalBox}
                  onPress={() => handleQuickLog(item)}
                >
                  <Text style={authStyles.goalText}>
                    {item.meal}: {item.name} - {item.calories} cal ({item.servingSize})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      }
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
    >
    </FlatList>
  )
}
