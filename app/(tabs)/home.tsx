// app/(tabs)/home.tsx
import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useEffect, useState, useCallback } from 'react'
import {
  Alert,
  Button,
  FlatList,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { useFocusEffect } from '@react-navigation/native'
import { loadUserProfile } from '../../lib/storage'
import { calculateCalorieGoal, UserProfile } from '../../lib/calorie'
import { getTodaysCalories } from '../../lib/food'
import authStyles from '../../styles/auth.styles'

export default function HomeScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [miniGoals, setMiniGoals] = useState<{
    id: string
    text: string
    done: boolean
    deadline?: Date
    missed?: boolean
  }[]>([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoalText, setNewGoalText] = useState('')
  const [deadline, setDeadline] = useState<Date | undefined>()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [caloriesEaten, setCaloriesEaten] = useState(0)
  const [waterCount, setWaterCount] = useState(0)

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        const profile = await loadUserProfile()
        if (profile) {
          setUserProfile(profile)
        }
        const eaten = await getTodaysCalories()
        setCaloriesEaten(eaten)
      }
      fetchProfile()
    }, [])
  )

  useEffect(() => {
    const interval = setInterval(checkDeadlines, 60000) // check every 60 sec
    return () => clearInterval(interval)
  }, [])

  const calorieGoal = userProfile
    ? calculateCalorieGoal(userProfile)
    : 2000
  const fillPercent = calorieGoal
    ? Math.min(100, (caloriesEaten / calorieGoal) * 100)
    : 0

  const toggleGoal = (id: string) => {
    setMiniGoals((goals) =>
      goals.map((goal) =>
        goal.id === id ? { ...goal, done: !goal.done } : goal
      )
    )
  }

  const checkDeadlines = () => {
    const now = new Date()
    setMiniGoals((goals) =>
      goals.map((goal) => {
        if (!goal.done && goal.deadline && now > new Date(goal.deadline)) {
          if (!goal.missed) {
            Alert.alert('Goal Missed', `You missed: ${goal.text}`)
          }
          return { ...goal, missed: true }
        }
        return goal
      })
    )
  }

  const addGoal = () => {
    if (!newGoalText.trim()) return
    const newGoal = {
      id: Date.now().toString(),
      text: newGoalText,
      done: false,
      deadline,
      missed: false,
    }
    setMiniGoals((prev) => [...prev, newGoal])
    setNewGoalText('')
    setDeadline(undefined)
    setShowAddGoal(false)
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1A1A' }}>
      <FlatList
        data={miniGoals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleGoal(item.id)} style={authStyles.goalItem}>
            {item.done ? (
              <Ionicons name="checkmark" size={20} color="#39FF14" style={authStyles.goalIcon} />
            ) : item.missed ? (
              <Ionicons name="alarm" size={20} color="#FF6347" style={authStyles.goalIcon} />
            ) : (
              <Ionicons name="square-outline" size={20} color="white" style={authStyles.goalIcon} />
            )}
            <Text
              style={[
                authStyles.goalText,
                item.done && authStyles.goalDone,
                item.missed && { color: 'red' },
              ]}
            >
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <>
            <View style={[authStyles.goalBox, { justifyContent: 'center' }]}>
              <Text style={authStyles.title}>Daily Calorie Goal</Text>
            </View>

            <View style={authStyles.ringCard}>
              <AnimatedCircularProgress
                size={200}
                width={16}
                fill={fillPercent}
                tintColor="#39FF14"
                backgroundColor="#2C2C2C"
                lineCap="round"
                rotation={0}
                duration={1000}
              >
                {() => (
                  <Text style={authStyles.progressText}>
                    {caloriesEaten} / {calorieGoal} cal
                  </Text>
                )}
              </AnimatedCircularProgress>
            </View>

            <View style={authStyles.sectionBox}>
              <Text style={authStyles.miniGoalTitle}>Today&apos;s Goals</Text>
            </View>
          </>
        }
        ListFooterComponent={
          <>
            <View style={authStyles.sectionBox}>
              <TouchableOpacity style={authStyles.button} onPress={() => setShowAddGoal(true)}>
                <Text style={authStyles.buttonText}>+ Add Goal</Text>
              </TouchableOpacity>
            </View>

            <View style={authStyles.waterBox}>
              <Text style={authStyles.waterText}>Water Intake: {waterCount} glasses</Text>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <TouchableOpacity
                  style={authStyles.button}
                  onPress={() => setWaterCount((c) => Math.max(0, c - 1))}
                >
                  <Text style={authStyles.buttonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity style={authStyles.button} onPress={() => setWaterCount((c) => c + 1)}>
                  <Text style={authStyles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        contentContainerStyle={authStyles.scrollContainer}
      />

      <Modal visible={showAddGoal} animationType="slide" transparent>
        <View style={[authStyles.container, { backgroundColor: '#000000cc' }]}>
          <View style={authStyles.form}>
            <TextInput
              style={authStyles.input}
              placeholder="New goal"
              placeholderTextColor="#aaa"
              value={newGoalText}
              onChangeText={setNewGoalText}
            />
            <TouchableOpacity
              style={authStyles.button}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={authStyles.buttonText}>
                {deadline ? `Deadline: ${deadline.toLocaleString()}` : 'Set Deadline'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={deadline || new Date()}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(
                  event: import('@react-native-community/datetimepicker').DateTimePickerEvent,
                  date?: Date | undefined
                ) => {
                  setShowDatePicker(false)
                  if (date) setDeadline(date)
                }}
              />
            )}
            <Button title="Add Goal" color="#5cb85c" onPress={addGoal} />
            <Button title="Cancel" color="#666" onPress={() => setShowAddGoal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  )
}
