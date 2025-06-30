import React, { useEffect, useState } from 'react'
import { Alert, Button, Text, View } from 'react-native'
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner'
import { useRouter } from 'expo-router'
import authStyles from '../styles/auth.styles'
import { fetchFoodByUPC } from '../lib/nutritionix'

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const request = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    }
    request()
  }, [])

  const handleBarCodeScanned = async (result: BarCodeScannerResult) => {
    setScanned(true)
    try {
      const item = await fetchFoodByUPC(result.data)
      router.push({
        pathname: '/(tabs)/nutrition',
        params: { scannedItem: JSON.stringify(item) },
      })
    } catch {
      Alert.alert('Error', 'Failed to fetch item data')
      router.back()
    }
  }

  if (hasPermission === null) {
    return (
      <View style={authStyles.loadingContainer}>
        <Text style={authStyles.goalText}>Requesting camera permission...</Text>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={authStyles.loadingContainer}>
        <Text style={authStyles.goalText}>No access to camera</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ flex: 1 }}
      />
      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
      <Button title="Close" onPress={() => router.back()} />
    </View>
  )
}
