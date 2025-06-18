import AsyncStorage from '@react-native-async-storage/async-storage'

export type FoodLog = {
  id: string
  name: string
  calories: number
  servingSize: string
  meal: string
  time: string
}

const getKeyForDate = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `food-logs-${y}-${m}-${d}`
}

export const addFoodLog = async (
  log: Omit<FoodLog, 'id' | 'time'>
): Promise<FoodLog> => {
  const entry: FoodLog = {
    id: Date.now().toString(),
    time: new Date().toISOString(),
    ...log,
  }
  const key = getKeyForDate(new Date())
  const existing = await AsyncStorage.getItem(key)
  const list: FoodLog[] = existing ? JSON.parse(existing) : []
  list.push(entry)
  await AsyncStorage.setItem(key, JSON.stringify(list))
  return entry
}

export const getTodayFoodLogs = async (): Promise<FoodLog[]> => {
  const key = getKeyForDate(new Date())
  const json = await AsyncStorage.getItem(key)
  return json ? JSON.parse(json) : []
}

export const getTodaysCalories = async (): Promise<number> => {
  const logs = await getTodayFoodLogs()
  return logs.reduce((sum, item) => sum + item.calories, 0)
}

export const removeFoodLog = async (id: string): Promise<void> => {
  const key = getKeyForDate(new Date())
  const existing = await AsyncStorage.getItem(key)
  if (!existing) return
  const list: FoodLog[] = JSON.parse(existing)
  const updated = list.filter((item) => item.id !== id)
  await AsyncStorage.setItem(key, JSON.stringify(updated))
}

const QUICK_KEY = 'quick-meals'

export const addQuickMeal = async (
  meal: Omit<FoodLog, 'id' | 'time'>
): Promise<void> => {
  const existing = await AsyncStorage.getItem(QUICK_KEY)
  const list: Omit<FoodLog, 'id' | 'time'>[] = existing ? JSON.parse(existing) : []
  const exists = list.some(
    (m) =>
      m.name === meal.name &&
      m.calories === meal.calories &&
      m.servingSize === meal.servingSize &&
      m.meal === meal.meal
  )
  if (!exists) {
    list.push(meal)
    await AsyncStorage.setItem(QUICK_KEY, JSON.stringify(list))
  }
}

export const getQuickMeals = async (): Promise<
  Omit<FoodLog, 'id' | 'time'>[]
> => {
  const json = await AsyncStorage.getItem(QUICK_KEY)
  return json ? JSON.parse(json) : []
}
