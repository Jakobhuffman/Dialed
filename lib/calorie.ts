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
  const height = parseFloat(profile.height)
  const weight = parseFloat(profile.weight)

  // determine basal metabolic rate using US measurements
  const isFemale = profile.sex.toLowerCase() === 'female'
  const bmr = isFemale
    ? 655 + 4.35 * weight + 4.7 * height - 4.7 * age
    : 66 + 6.23 * weight + 12.7 * height - 6.8 * age

  // currently assume a sedentary lifestyle
  const activityMultiplier = 1.2
  let daily = bmr * activityMultiplier

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
