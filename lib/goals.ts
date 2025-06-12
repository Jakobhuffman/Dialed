export type Goal = {
  id: string
  text: string
  done: boolean
  deadline?: Date
  missed?: boolean
}

export const createGoal = (text: string, deadline?: Date): Goal => ({
  id: Date.now().toString(),
  text,
  done: false,
  deadline,
  missed: false,
})

export const isGoalMissed = (goal: Goal): boolean => {
  return !!goal.deadline && !goal.done && new Date() > new Date(goal.deadline)
}
