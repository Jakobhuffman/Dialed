export type UserProfile = {
  age: string
  sex: string
  height: string
  weight: string
  goal: string
  activity?: string
}

/**
 * Calculate daily calorie goal based on the Mifflin-St Jeor equation.
 * Height should be in inches, weight in pounds.
 */
export const calculateCalorieGoal = (profile: UserProfile): number => {
  const age = parseFloat(profile.age)
  const heightIn = parseFloat(profile.height)
  const weightLb = parseFloat(profile.weight)

  const isFemale = profile.sex.toLowerCase() === 'female'

  const bmr = isFemale
    ? 655 + 4.35 * weightLb + 4.7 * heightIn - 4.7 * age
    : 66 + 6.23 * weightLb + 12.7 * heightIn - 6.8 * age

  const activityMultiplierMap: Record<string, number> = {
    Sedentary: 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725,
    'Super Active': 1.9,
  }

  const multiplier = profile.activity
    ? activityMultiplierMap[profile.activity] || 1.2
    : 1.2

  let daily = bmr * multiplier

  switch (profile.goal.toLowerCase()) {
    case 'lose':
      daily -= 500
      break
    case 'gain':
      daily += 500
      break
  }

  return Math.round(daily)
}
