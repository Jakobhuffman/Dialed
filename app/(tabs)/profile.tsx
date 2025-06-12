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
import { useRouter } from 'expo-router'
import {
  clearCredentials,
  loadUserProfile,
  saveUserProfile,
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
    <ScrollView contentContainerStyle={authStyles.container}>
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
          <TextInput
            style={authStyles.input}
            value={form.sex}
            placeholder="Sex"
            placeholderTextColor="#aaa"
            onChangeText={(text) => handleChange('sex', text)}
          />
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
          <TextInput
            style={authStyles.input}
            value={form.activity}
            placeholder="Activity Level"
            placeholderTextColor="#aaa"
            onChangeText={(text) => handleChange('activity', text)}
          />
          <TextInput
            style={authStyles.input}
            value={form.goal}
            placeholder="Goal"
            placeholderTextColor="#aaa"
            onChangeText={(text) => handleChange('goal', text)}
          />
          <TouchableOpacity style={authStyles.button} onPress={handleSave}>
            <Text style={authStyles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        profile && (
          <View>
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
              await clearCredentials()
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
