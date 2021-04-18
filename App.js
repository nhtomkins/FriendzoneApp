import { StatusBar } from 'expo-status-bar'
import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
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
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import {
  DefaultTheme,
  Provider as PaperProvider,
  useTheme,
} from 'react-native-paper'

import { Lineup, LineupExpanded } from './app/lineup/Lineup'
import {
  Profile,
  MyProfile,
  EditProfile,
  EditInterests,
} from './app/profile/Profile'

import { Messages, OpenFriend } from './app/messages/Messages'
import Signup from './app/landing/Signup'
import Login from './app/landing/Login'

const MainStack = createStackNavigator()
const LandingStack = createStackNavigator()
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
  icons: {
    activities: 'local-activity',
    lifestyle: 'local-bar',
    movies: 'movie',
    music: 'music-note',
    sports: 'fitness-center',
  },
}

function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Home</Text>
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
        keyboardHidesTabBar: Platform.OS == 'ios' ? false : true,
        indicatorStyle: {
          backgroundColor: '#673ab7',
        },
        style: {
          backgroundColor: 'white',
        },
      }}
      tabBarPosition="bottom"
      backBehavior="firstRoute"
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="light" backgroundColor={colors.primary} />
      {currentUser ? (
        <MainStack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: 'white',
          }}
        >
          <MainStack.Screen
            name="Main"
            component={MainNavigator}
            options={{ headerShown: false }}
          />
          <MainStack.Screen name="LineupExpanded" component={LineupExpanded} />
          <MainStack.Screen
            name="MyProfile"
            component={MyProfile}
            options={{ title: 'My Profile' }}
          />
          <MainStack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ title: 'Edit Profile' }}
          />
          <MainStack.Screen
            name="EditInterests"
            component={EditInterests}
            options={{ title: 'Edit Interests' }}
          />
          <MainStack.Screen name="OpenFriend" component={OpenFriend} />
        </MainStack.Navigator>
      ) : (
        <LandingStack.Navigator
          mode="modal"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'transparent' },
            cardOverlayEnabled: true,
            cardStyleInterpolator: ({ current: { progress } }) => ({
              cardStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 0.5, 0.9, 1],
                  outputRange: [0, 0.25, 0.7, 1],
                }),
              },
              overlayStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                  extrapolate: 'clamp',
                }),
              },
            }),
          }}
        >
          <LandingStack.Screen name="Main" component={LandingPage} />
          <LandingStack.Screen name="Signup" component={Signup} />
          <LandingStack.Screen name="Login" component={Login} />
        </LandingStack.Navigator>
      )}
    </KeyboardAvoidingView>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <Main />
          </NavigationContainer>
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
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
