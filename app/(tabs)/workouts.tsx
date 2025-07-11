import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import authStyles from '../../styles/auth.styles'

export default function WorkoutsScreen() {
  const [muscle, setMuscle] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])

  const fetchSuggestions = async () => {
    if (!muscle) return
    setLoading(true)
    try {
      const res = await fetch(
        `https://api.api-ninjas.com/v1/exercises?muscle=${encodeURIComponent(
          muscle
        )}`,
        {
          headers: {
            'X-Api-Key': 'YOUR_API_KEY',
          },
        }
      )
      if (res.ok) {
        const data = await res.json()
        setSuggestions(data)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1A1A' }}>
      <FlatList
        data={suggestions}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={authStyles.goalBox}>
            <Text style={authStyles.goalText}>{item.name}</Text>
            {item.instructions && (
              <Text style={[authStyles.goalText, { fontSize: 12 }]}> 
                {item.instructions}
              </Text>
            )}
          </View>
        )}
        ListHeaderComponent={
          <View style={authStyles.form}>
            <TextInput
              style={authStyles.input}
              placeholder="Target muscle"
              placeholderTextColor="#aaa"
              value={muscle}
              onChangeText={setMuscle}
            />
            <TouchableOpacity style={authStyles.button} onPress={fetchSuggestions}>
              <Text style={authStyles.buttonText}>
                {loading ? 'Loading...' : 'Get Suggestions'}
              </Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={authStyles.scrollContainer}
      />
    </View>
  )
}
