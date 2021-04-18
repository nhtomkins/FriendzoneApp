import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Pressable,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from 'react-native-paper'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Login from './Login'
import Signup from './Signup'

export default function LandingPage({ navigation }) {
  const { colors, icons } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#673ab7', '#ffa726']}
        style={[styles.background, { top: insets.top }]}
      />
      <View style={styles.titleBlock}>
        <Text style={styles.title}>ignite</Text>
        <View style={styles.iconRow}>
          <MaterialIcons
            name={icons.activities}
            size={48}
            color={colors.activities}
          />
          <MaterialIcons
            name={icons.lifestyle}
            size={48}
            color={colors.lifestyle}
          />
          <MaterialIcons name={icons.movies} size={48} color={colors.movies} />
          <MaterialIcons name={icons.music} size={48} color={colors.music} />
          <MaterialIcons name={icons.sports} size={48} color={colors.sports} />
        </View>
      </View>
      <View style={styles.buttonBlock}>
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={[styles.buttonText, { color: 'white' }]}>sign up</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: 'white' }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>sign in</Text>
        </Pressable>
      </View>

      {/* <Login nav={navigation} /> */}
    </SafeAreaView>
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
  titleBlock: {
    flex: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 52,
    fontWeight: '700',
    color: 'white',
  },
  iconRow: {
    flex: 0,
    flexDirection: 'row',
  },
  buttonBlock: {
    flex: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 99,
    paddingVertical: 14,
    paddingHorizontal: 50,
    marginVertical: 4,
  },
  buttonText: {
    fontSize: 16,
  },
})
