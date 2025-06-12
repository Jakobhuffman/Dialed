export type UserProfile = {
  age: string
  sex: string
  height: string
  weight: string
  goal: string
}

/**
 * Calculate daily calorie goal based on the Mifflin-St Jeor equation.
 * Height should be in inches, weight in pounds.
 */
export const calculateCalorieGoal = (profile: UserProfile): number => {
  const age = parseFloat(profile.age)
  const heightCm = parseFloat(profile.height) * 2.54
  const weightKg = parseFloat(profile.weight) / 2.205

  // default to male formula if sex is not Male or Female
  const isFemale = profile.sex.toLowerCase() === 'female'

  const bmr =
    10 * weightKg + 6.25 * heightCm - 5 * age + (isFemale ? -161 : 5)

  // assume sedentary activity level
  let daily = bmr * 1.2

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
