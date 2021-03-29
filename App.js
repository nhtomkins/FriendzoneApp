import { StatusBar } from 'expo-status-bar'
import React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Login from './app/home/Login'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function Home() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#673ab7', '#ffa726']}
        style={styles.background}
      />
      <Text>Ignite</Text>
      <MaterialIcons name="local-activity" size={48} color="black" />
      <Login />
    </View>
  )
}

function Lineup() {
  return (
    <View style={styles.container}>
      <Text>Lineup</Text>
    </View>
  )
}

function Messages() {
  return (
    <View style={styles.container}>
      <Text>Messages</Text>
    </View>
  )
}

function Profile() {
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
    </View>
  )
}

function MainNavigator() {
  return (
    <Tab.Navigator
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

          // You can return any component that you like here!
          return <MaterialIcons name={iconName} size={size} color={color} />
        },
      })}
      tabBarOptions={{
        activeTintColor: '#673ab7',
        inactiveTintColor: 'gray',
        showLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Lineup" component={Lineup} />
      <Tab.Screen name="Messages" component={Messages} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator headerMode={'none'}>
          <Stack.Screen name="Main" component={MainNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
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
})
