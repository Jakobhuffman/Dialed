// app/(tabs)/profile.tsx
import React, { useEffect, useState } from 'react'
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useRouter } from 'expo-router'
import {
  loadUserProfile,
  saveUserProfile,
  clearAllData,
} from '../../lib/storage'
import authStyles from '../../styles/auth.styles'

export default function ProfileScreen() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [editing, setEditing] = useState(false)

  const [form, setForm] = useState({
    name: '',
    age: '',
    sex: '',
    height: '',
    weight: '',
    goal: '',
    activity: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadUserProfile()
      if (data) {
        setProfile(data)
        setForm(data)
      }
    }
    fetchData()
  }, [])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    await saveUserProfile(form)
    setProfile(form)
    setEditing(false)
    Alert.alert('Profile Saved')
  }

  return (
    <ScrollView contentContainerStyle={authStyles.scrollContainer}>
      <Text style={authStyles.title}>Your Profile</Text>

      {editing ? (
        <View style={authStyles.form}>
          <TextInput
            style={authStyles.input}
            value={form.name}
            placeholder="Name"
            placeholderTextColor="#aaa"
            onChangeText={(text) => handleChange('name', text)}
          />
          <TextInput
            style={authStyles.input}
            value={form.age}
            placeholder="Age"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            onChangeText={(text) => handleChange('age', text)}
          />
          <Text style={authStyles.label}>Sex</Text>
          <View style={authStyles.pickerWrapper}>
            <Picker
              selectedValue={form.sex}
              onValueChange={(val) => handleChange('sex', val)}
              style={authStyles.picker}
              dropdownIconColor="#39FF14"
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          <TextInput
            style={authStyles.input}
            value={form.height}
            placeholder="Height"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            onChangeText={(text) => handleChange('height', text)}
          />
          <TextInput
            style={authStyles.input}
            value={form.weight}
            placeholder="Weight"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            onChangeText={(text) => handleChange('weight', text)}
          />
          <Text style={authStyles.label}>Activity Level</Text>
          <View style={authStyles.pickerWrapper}>
            <Picker
              selectedValue={form.activity}
              onValueChange={(val) => handleChange('activity', val)}
              style={authStyles.picker}
              dropdownIconColor="#39FF14"
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
              selectedValue={form.goal}
              onValueChange={(val) => handleChange('goal', val)}
              style={authStyles.picker}
              dropdownIconColor="#39FF14"
            >
              <Picker.Item label="Lose Weight" value="Lose" />
              <Picker.Item label="Maintain Weight" value="Maintain" />
              <Picker.Item label="Gain Weight" value="Gain" />
            </Picker>
          </View>
          <TouchableOpacity style={authStyles.button} onPress={handleSave}>
            <Text style={authStyles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        profile && (
          <View style={authStyles.sectionBox}>
            <Text style={authStyles.goalText}>Name: {profile.name}</Text>
            <Text style={authStyles.goalText}>Age: {profile.age}</Text>
            <Text style={authStyles.goalText}>Sex: {profile.sex}</Text>
            <Text style={authStyles.goalText}>Height: {profile.height}</Text>
            <Text style={authStyles.goalText}>Weight: {profile.weight}</Text>
            <Text style={authStyles.goalText}>Activity: {profile.activity}</Text>
            <Text style={authStyles.goalText}>Goal: {profile.goal}</Text>

          <TouchableOpacity style={authStyles.button} onPress={() => setEditing(true)}>
            <Text style={authStyles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={authStyles.button}
            onPress={async () => {
              await clearAllData()
              Alert.alert('Signed Out')
              router.replace('/(auth)')
            }}
          >
            <Text style={authStyles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        )
      )}
    </ScrollView>
  )
}
