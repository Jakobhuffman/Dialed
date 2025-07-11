// app/(onboarding)/user_profile.tsx
import Dropdown from '../../components/Dropdown'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity } from 'react-native'
import { saveUserProfile } from '../../lib/storage'
import authStyles from '../../styles/auth.styles'

export default function UserProfile() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [sex, setSex] = useState('Male')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [goal, setGoal] = useState('Lose')
  const [activity, setActivity] = useState('Sedentary')

  const handleSubmit = async () => {
    console.log({ name, age, sex, height, weight, goal, activity })
    await saveUserProfile({ name, age, sex, height, weight, goal, activity })
    router.replace('/(tabs)/home')
  }
  return (
    <ScrollView contentContainerStyle={authStyles.scrollContainer}>
      <Text style={authStyles.title}>Let’s Get to Know You</Text>

      <TextInput style={authStyles.input} placeholder="Name" placeholderTextColor="#aaa" value={name} onChangeText={setName} />
      <TextInput style={authStyles.input} placeholder="Age" placeholderTextColor="#aaa" keyboardType="numeric" value={age} onChangeText={setAge} />
      <TextInput style={authStyles.input} placeholder="Height (inches)" placeholderTextColor="#aaa" keyboardType="numeric" value={height} onChangeText={setHeight} />
      <TextInput style={authStyles.input} placeholder="Weight (lbs)" placeholderTextColor="#aaa" keyboardType="numeric" value={weight} onChangeText={setWeight} />

      <Dropdown
        label="Sex"
        options={["Male", "Female", "Other"]}
        value={sex}
        onChange={setSex}
      />

      <Dropdown
        label="Activity Level"
        options={[
          'Sedentary',
          'Lightly Active',
          'Moderately Active',
          'Very Active',
          'Super Active',
        ]}
        value={activity}
        onChange={setActivity}
      />

      <Dropdown
        label="Goal"
        options={['Lose', 'Maintain', 'Gain']}
        value={goal}
        onChange={setGoal}
      />

     <TouchableOpacity style={authStyles.button} onPress={handleSubmit}>
            <Text style={authStyles.buttonText}>Login</Text>
    </TouchableOpacity>
    </ScrollView>
  )
}
