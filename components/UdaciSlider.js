import React from 'react'
import { View, Text, Slider } from 'react-native'

export default function UdaciSlider ({max, unit, step, value, onChange}) {
  return (
    <View>
      <Slider
          minimumValue={0}
          maximumValue={max}
          step={step}
          value={value}
          onValueChange={onChange}
      />
      <Text>{value}</Text>
      <Text>{unit}</Text>
    </View>
  )
} 

