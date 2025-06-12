import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { loadUserProfile } from '../../lib/storage'
import { calculateCalorieGoal, UserProfile } from '../../lib/calorie'
import authStyles from '../../styles/auth.styles'

export default function NutritionScreen() {
  const [goal, setGoal] = useState<number | null>(null)

  useEffect(() => {
    const fetch = async () => {
      const profile = await loadUserProfile()
      if (profile) {
        setGoal(calculateCalorieGoal(profile as UserProfile))
      }
    }
    fetch()
  }, [])

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>Nutrition</Text>
      {goal ? (
        <Text style={authStyles.goalText}>
          Your daily calorie goal is {goal} kcal
        </Text>
      ) : (
        <Text style={authStyles.goalText}>Add your profile to see goals.</Text>
      )}
    </View>
  )
}