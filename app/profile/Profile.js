import React, { useState, useEffect } from 'react'
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
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import LineupProfile from '../lineup/LineupProfile'
import InterestsSelect from './InterestsSelect'

const InterestTab = createMaterialTopTabNavigator()

export function EditProfile({ navigation }) {
  const { userData } = useAuth()

  return (
    <ScrollView>
      <Pressable>
        <Image
          style={styles.topImage}
          source={{
            uri:
              userData.profileImgUrl ||
              'https://firebasestorage.googleapis.com/v0/b/friendzone-dev-1c6af.appspot.com/o/no-user-tall.png?alt=media&token=d01e48ef-4e74-4022-a3ae-abe43be5fd91',
          }}
        />
      </Pressable>
    </ScrollView>
  )
}

const InterestsTab = ({ route, navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <InterestsSelect {...route.params} />
    </View>
  )
}

export function EditInterests({ navigation }) {
  const { userData, getInterestsData } = useAuth()
  const [interestData, setInterestData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { colors, icons } = useTheme()

  useEffect(() => {
    let interests = []
    getInterestsData()
      .then((snap) => {
        snap.forEach((doc) => {
          doc.data().items && interests.push(doc.data())
        })
      })
      .then(() => {
        setInterestData(interests)
        setLoading(false)
      })
  }, [])
  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <InterestTab.Navigator
          tabBarOptions={{
            labeled: false,
            showIcon: true,
            showLabel: false,
            indicatorStyle: {
              backgroundColor: colors.primary,
            },
          }}
        >
          {interestData?.map((cat, i) => (
            <InterestTab.Screen
              key={i}
              name={cat.id}
              component={InterestsTab}
              initialParams={cat}
              options={{
                tabBarIcon: ({ focused }) => (
                  <MaterialIcons
                    name={icons[cat.id]}
                    size={24}
                    color={focused ? colors[cat.id] : 'gray'}
                  />
                ),
              }}
            />
          ))}
        </InterestTab.Navigator>
      )}
    </View>
  )
}

export function MyProfile() {
  const { userData } = useAuth()
  return (
    <ScrollView>
      <LineupProfile expanded={true} {...userData} />
    </ScrollView>
  )
}

export function Profile({ navigation }) {
  const { userData } = useAuth()

  return (
    <SafeAreaView>
      {userData ? (
        <ScrollView>
          <View style={styles.topContainer}>
            <Pressable onPress={() => navigation.navigate('MyProfile')}>
              <Image
                style={styles.avatar}
                source={{ uri: userData.profileImgUrl }}
              />
            </Pressable>

            <Text>{userData.firstname}</Text>
          </View>
          <View style={styles.bottomContainer}>
            <Pressable
              style={styles.bigButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <MaterialIcons name="image" size={24} color="black" />
              <Text>Edit Profile</Text>
            </Pressable>
            <Pressable
              style={styles.bigButton}
              onPress={() => navigation.navigate('EditInterests')}
            >
              <MaterialIcons name="image" size={24} color="black" />
              <Text>Edit Interests</Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <ActivityIndicator />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '25%',
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
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
  bigButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'white',
    height: 50,
    width: '50%',
    elevation: 4,
  },
  topImage: {
    width: '85%',
    aspectRatio: 3 / 4,
    borderRadius: 8,
  },
})
