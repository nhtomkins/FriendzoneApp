import React, { useState, useEffect, useLayoutEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../../contexts/AuthContext'
import { Avatar } from 'react-native-paper'
import { Chip, useTheme, Title } from 'react-native-paper'
import LineupProfile from './LineupProfile'
import { FlatList } from 'react-native-gesture-handler'

export const LineupExpanded = ({ route, navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      title: route.params.firstname,
    })
  }, [route])

  return (
    <ScrollView>
      <LineupProfile expanded={true} {...route.params} />
    </ScrollView>
  )
}

export const Lineup = ({ navigation }) => {
  const { userData, getAllUsers } = useAuth()
  const { colors } = useTheme()
  const [lineup, setLineup] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let profiles = []
    userData &&
      getAllUsers()
        .then((users) => {
          users.forEach((user) => {
            let data = user.data()
            data.userId !== userData.userId && profiles.push(data)
          })
        })
        .then(() => {
          setLineup(profiles)
          setLoading(false)
        })
  }, [userData])

  return (
    <SafeAreaView style={styles.container}>
      {userData && !loading ? (
        <FlatList
          data={lineup}
          renderItem={(item) => (
            <View style={styles.profileCard}>
              <LineupProfile navigation={navigation} {...item.item} />
            </View>
          )}
          keyExtractor={(item) => item.userId}
        />
      ) : (
        <ActivityIndicator />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  topImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    //aspectRatio: 1,
  },
  similaritiesChip: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 8,
    margin: 2,
  },
  profileCard: {
    margin: '5%',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
  },
})
