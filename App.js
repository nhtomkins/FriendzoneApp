import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import LandingPage from './app/landing/LandingPage'
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'

import { useAuth, AuthProvider } from './contexts/AuthContext'

const Stack = createStackNavigator()
//const Tab = createBottomTabNavigator()
Tab = createMaterialTopTabNavigator()

function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Home</Text>
    </SafeAreaView>
  )
}

function Lineup() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Lineup</Text>
    </SafeAreaView>
  )
}

function Messages() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Messages</Text>
    </SafeAreaView>
  )
}

function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
    </SafeAreaView>
  )
}

function MainNavigator() {
  const insets = useSafeAreaInsets()

  return (
    <Tab.Navigator
      style={{ paddingTop: insets.top }}
      tabBarOptions={{
        showIcon: true,
        showLabel: false,
        activeTintColor: '#673ab7',
        inactiveTintColor: 'gray',
        indicatorStyle: {
          backgroundColor: '#673ab7',
        },
      }}
      //tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Home') {
            iconName = 'home'
          } else if (route.name === 'Lineup') {
            iconName = 'search'
          } else if (route.name === 'Messages') {
            iconName = 'message'
          } else if (route.name === 'Profile') {
            iconName = 'person'
          }

          return <MaterialIcons name={iconName} size={24} color={color} />
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Lineup" component={Lineup} />
      <Tab.Screen name="Messages" component={Messages} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  )
}

function Main() {
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuth()
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator headerMode={'none'}>
        {currentUser ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Landing" component={LandingPage} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </SafeAreaProvider>
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
