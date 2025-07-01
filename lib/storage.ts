// lib/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import * as Crypto from 'expo-crypto'

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
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    )
    await SecureStore.setItemAsync(
      'user-credentials',
      JSON.stringify({ username, hash })
    )
  } catch (e) {
    console.error('Error saving credentials:', e)
  }
}

export const loadCredentials = async (): Promise<
  { username: string; hash: string } | null
> => {
  try {
    const json = await SecureStore.getItemAsync('user-credentials')
    return json ? JSON.parse(json) : null
  } catch (e) {
    console.error('Error loading credentials:', e)
    return null
  }
}

export const clearCredentials = async () => {
  try {
    await SecureStore.deleteItemAsync('user-credentials')
  } catch (e) {
    console.error('Error clearing credentials:', e)
  }
}

export const saveToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync('auth-token', token)
  } catch (e) {
    console.error('Error saving token:', e)
  }
}

export const loadToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('auth-token')
  } catch (e) {
    console.error('Error loading token:', e)
    return null
  }
}

export const clearToken = async () => {
  try {
    await SecureStore.deleteItemAsync('auth-token')
  } catch (e) {
    console.error('Error clearing token:', e)
  }
}

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear()
    await clearCredentials()
    await clearToken()
  } catch (e) {
    console.error('Error clearing app data:', e)
  }
}
