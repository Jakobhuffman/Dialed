// app/(onboarding)/user_profile.tsx
import { Picker } from '@react-native-picker/picker'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
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

      <Text style={authStyles.label}>Sex</Text>
      <View style={authStyles.pickerWrapper}>
        <Picker
          selectedValue={sex}
          onValueChange={(itemValue) => setSex(itemValue)}
          style={authStyles.picker}
          itemStyle={{ color: 'black' }} // 👈 fixes white-on-white issue
          dropdownIconColor="#39FF14"
        >
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      <Text style={authStyles.label}>Activity Level</Text>
      <View style={authStyles.pickerWrapper}>
        <Picker
          selectedValue={activity}
          onValueChange={(itemValue) => setActivity(itemValue)}
          style={authStyles.picker}
        >
          <Picker.Item label="Sedentary" value="Sedentary" />
          <Picker.Item label="Lightly Active" value="Lightly Active" />
          <Picker.Item label="Moderately Active" value="Moderately Active" />
          <Picker.Item label="Very Active" value="Very Active" />
          <Picker.Item label="Super Active" value="Super Active" />
        </Picker>
      </View>

      <Text style={authStyles.label}>Goal</Text>
      <View style={authStyles.pickerWrapper}>
        <Picker
          selectedValue={goal}
          onValueChange={(itemValue) => setGoal(itemValue)}
          style={authStyles.picker}
        >
          <Picker.Item label="Lose Weight" value="Lose" />
          <Picker.Item label="Maintain Weight" value="Maintain" />
          <Picker.Item label="Gain Weight" value="Gain" />
        </Picker>
      </View>

     <TouchableOpacity style={authStyles.button} onPress={handleSubmit}>
            <Text style={authStyles.buttonText}>Login</Text>
    </TouchableOpacity>
    </ScrollView>
  )
}
