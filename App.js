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
import Profile from './app/profile/Profile'
import LineupProfile from './app/lineup/LineupProfile'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import {
  DefaultTheme,
  Provider as PaperProvider,
  useTheme,
} from 'react-native-paper'

import Lineup from './app/lineup/Lineup'

const Stack = createStackNavigator()
//const Tab = createBottomTabNavigator()
const Tab = createMaterialTopTabNavigator()
//Tab = createMaterialBottomTabNavigator()

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#673ab7',
    secondary: '#ffa726',
    accent: '#ffb851',
    activities: '#a47aff',
    lifestyle: '#ff8c3b',
    movies: '#ffd333',
    music: '#61cdff',
    sports: '#07e6a0',
    background: '#f0f0f0',
  },
}

function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Home</Text>
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

function MainNavigator() {
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()

  return (
    <Tab.Navigator
      //style={{ paddingTop: insets.top }}
      tabBarOptions={{
        labeled: false,
        showIcon: true,
        showLabel: false,
        activeTintColor: colors.primary,
        inactiveTintColor: 'gray',
        indicatorStyle: {
          backgroundColor: '#673ab7',
        },
        style: {
          backgroundColor: 'white',
        },
      }}
      tabBarPosition="bottom"
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Lineup"
        component={Lineup}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="search" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="message" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

function Main() {
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuth()
  const { colors } = useTheme()

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={colors.primary} />
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
        <PaperProvider theme={theme}>
          <Main />
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
