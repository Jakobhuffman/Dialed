import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { saveCredentials } from '../../lib/storage'
import authStyles from '../../styles/auth.styles'; // <-- import styles

export default function LoginScreen() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    await saveCredentials(username, password)
    router.replace('/(onboarding)/user_profile')
  }

  return (
    <View style={authStyles.container}>
      <Image
        source={require('../../assets/images/login_img.png')}
        style={[authStyles.image, { tintColor: '#39FF14' }]}
      />
      <Text style={authStyles.title}>Dialed</Text>
      <View style={authStyles.form}>
        <TextInput
          style={authStyles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={authStyles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={authStyles.button} onPress={handleLogin}>
            <Text style={authStyles.buttonText}>Login</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}
