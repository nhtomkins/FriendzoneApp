import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../../contexts/AuthContext'
import { Avatar, useTheme } from 'react-native-paper'
import { createStackNavigator } from '@react-navigation/stack'
import LineupProfile from '../lineup/LineupProfile'

const ProfileStack = createStackNavigator()

function ProfileHome({ navigation }) {
  const { userData } = useAuth()
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Pressable onPress={() => navigation.navigate('Profile')}>
          <Image
            style={styles.avatar}
            source={{ uri: userData.profileImgUrl }}
          />
        </Pressable>

        <Text>{userData.firstname}</Text>
      </View>
      <View style={styles.bottomContainer}></View>
    </SafeAreaView>
  )
}

function MyProfile() {
  const { userData } = useAuth()
  return (
    <ScrollView>
      <LineupProfile expanded={true} {...userData} />
    </ScrollView>
  )
}

function Profile() {
  const { userData } = useAuth()
  const { colors } = useTheme()

  return (
    <>
      {userData ? (
        <ProfileStack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: 'white',
          }}
        >
          <ProfileStack.Screen
            name="Home"
            component={ProfileHome}
            options={{ headerShown: false }}
          />
          <ProfileStack.Screen
            name="Profile"
            component={MyProfile}
            options={{ title: 'My Profile' }}
          />
        </ProfileStack.Navigator>
      ) : (
        <ActivityIndicator />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    height: 120,
    width: 120,
    borderRadius: 120 / 2,
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

export default Profile
