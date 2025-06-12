import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { loadCredentials, loadUserProfile } from '../lib/storage'

export default function RootLayout() {
  const router = useRouter()

  useEffect(() => {
    const checkUserStatus = async () => {
      const credentials = await loadCredentials()
      if (!credentials) {
        router.replace('/(auth)')
        return
      }

      const profile = await loadUserProfile()
      if (profile) {
        router.replace('/(tabs)/home')
      } else {
        router.replace('/(onboarding)/user_profile')
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
