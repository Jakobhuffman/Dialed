import { useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { saveCredentials, saveToken } from '../../lib/storage'
import authStyles from '../../styles/auth.styles'; // <-- import styles

export default function LoginScreen() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  WebBrowser.maybeCompleteAuthSession()
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      '727174777516-1sqgpe2l41cahds0h61hqp0g32e00j48.apps.googleusercontent.com',
  })

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      saveToken(response.authentication.accessToken)
      router.replace('/(tabs)/home')
    }
  }, [response, router])

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
        <TouchableOpacity
          style={[authStyles.button, { marginTop: 10 }]}
          disabled={!request}
          onPress={() => promptAsync()}
        >
          <Text style={authStyles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}
