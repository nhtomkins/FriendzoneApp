import React from 'react'
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import Login from './Login'

export default function LandingPage({ navigation }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#673ab7', '#ffa726']}
        style={styles.background}
      />
      <Text>Ignite</Text>
      <MaterialIcons name="local-activity" size={48} color="black" />
      <Login nav={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    height: '100%',
    left: 0,
    right: 0,
    top: 0,
    zIndex: -1,
  },
})
