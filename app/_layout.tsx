import { Redirect, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { loadUserProfile } from '../lib/storage'
import authStyles from '../styles/auth.styles'

// 1. Define the RootHref union type
type RootHref = '/(tabs)/home' | '/(auth)'

export default function RootLayout() {
  // 2. Use RootHref type for initialRoute
  const [initialRoute, setInitialRoute] = useState<RootHref | null>(null)

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
      <View style={authStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#39FF14" />
      </View>
    )
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {/* 3. initialRoute is now guaranteed to be a valid RootHref */}
      <Redirect href={initialRoute} />
    </>
  )
}
