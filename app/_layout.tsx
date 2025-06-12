import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { loadUserProfile } from '../lib/storage'

export default function RootLayout() {
  const router = useRouter()

  useEffect(() => {
    const checkUserStatus = async () => {
      const profile = await loadUserProfile()
      if (profile) {
        router.replace('/(tabs)/home')
      } else {
        router.replace('/(auth)') // ✅ redirect to login screen
      }
    }

    checkUserStatus()
  }, [])

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
