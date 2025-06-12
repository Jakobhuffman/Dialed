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
