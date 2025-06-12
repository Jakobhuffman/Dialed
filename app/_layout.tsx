import { Redirect, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { loadUserProfile } from '../lib/storage'

export default function RootLayout() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null)

  useEffect(() => {
    const checkUserStatus = async () => {
      const profile = await loadUserProfile()
      if (profile) {
        setInitialRoute('/(tabs)/home')
      } else {
        setInitialRoute('/(auth)')
      }
    }
    checkUserStatus()
  }, [])

  if (!initialRoute) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#1A1A1A',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#39FF14" />
      </View>
    )
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Redirect href={initialRoute} />
    </>
  )
}
