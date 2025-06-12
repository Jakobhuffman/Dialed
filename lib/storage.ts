// lib/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage'

export const saveUserProfile = async (data: any) => {
  try {
    await AsyncStorage.setItem('user-profile', JSON.stringify(data))
  } catch (e) {
    console.error('Error saving user profile:', e)
  }
}

export const loadUserProfile = async (): Promise<any | null> => {
  try {
    const json = await AsyncStorage.getItem('user-profile')
    return json ? JSON.parse(json) : null
  } catch (e) {
    console.error('Error loading user profile:', e)
    return null
  }
}

export const saveCredentials = async (username: string, password: string) => {
  try {
    await AsyncStorage.setItem(
      'user-credentials',
      JSON.stringify({ username, password })
    )
  } catch (e) {
    console.error('Error saving credentials:', e)
  }
}

export const loadCredentials = async (): Promise<
  { username: string; password: string } | null
> => {
  try {
    const json = await AsyncStorage.getItem('user-credentials')
    return json ? JSON.parse(json) : null
  } catch (e) {
    console.error('Error loading credentials:', e)
    return null
  }
}

export const clearCredentials = async () => {
  try {
    await AsyncStorage.removeItem('user-credentials')
  } catch (e) {
    console.error('Error clearing credentials:', e)
  }
}
