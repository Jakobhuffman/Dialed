import React from 'react'
import { View, Text } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import { Ionicons } from '@expo/vector-icons'

export type DropdownProps = {
  label?: string
  options: string[]
  value: string
  onChange: (val: string) => void
}

export default function Dropdown({ label, options, value, onChange }: DropdownProps) {
  return (
    <>
      {label && <Text style={{ color: '#aaa', marginTop: 12, marginBottom: 6 }}>{label}</Text>}
      <SelectDropdown
        data={options}
        onSelect={(selected) => onChange(selected)}
        defaultValue={value}
        renderButton={(selectedItem, isOpen) => (
          <View
            style={{
              backgroundColor: '#2C2C2C',
              borderRadius: 8,
              paddingHorizontal: 12,
              height: 40,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ color: '#fff' }}>{selectedItem || 'Select'}</Text>
            <Ionicons
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#39FF14"
            />
          </View>
        )}
        renderItem={(item, index, isSelected) => (
          <View
            style={{
              padding: 10,
              backgroundColor: isSelected ? '#39FF1433' : '#2C2C2C',
            }}
          >
            <Text style={{ color: '#fff' }}>{item}</Text>
          </View>
        )}
        dropdownStyle={{ backgroundColor: '#2C2C2C', borderRadius: 8 }}
        dropdownOverlayColor="rgba(0,0,0,0.7)"
      />
    </>
  )
}
