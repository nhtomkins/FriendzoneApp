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

function FriendsListItem({ firstname, profileImgUrl, message, sentAt }) {
  return (
    <View style={styles.friendsListItem}>
      <Image
        style={styles.avatar}
        source={{
          uri:
            profileImgUrl ||
            'https://firebasestorage.googleapis.com/v0/b/friendzone-dev-1c6af.appspot.com/o/no-user-tall.png?alt=media&token=d01e48ef-4e74-4022-a3ae-abe43be5fd91',
        }}
      />
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text style={styles.name}>{firstname}</Text>
        <Text style={styles.messagePreview}>{message || 'New friend!'}</Text>
      </View>
    </View>
  )
}

function MessageBubble(props) {
  const { colors } = useTheme()

  return (
    <View
      style={{
        flex: 0.7,
        //flexDirection: 'row',
        alignItems: props.side === 'left' ? 'flex-start' : 'flex-end',
      }}
    >
      <Text
        style={[
          styles.bubble,
          props.side === 'left'
            ? {
                backgroundColor: 'lightgrey',
              }
            : {
                backgroundColor: colors.primary,
                color: 'white',
              },
        ]}
      >
        {props.message}
      </Text>
      <Text style={styles.sentAtBubble}>
        {props.sentAt.toDate().toLocaleString('en-AU')}
      </Text>
    </View>
  )
}

export function OpenMessageTitle({ firstname, profileImgUrl }) {
  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      <Image
        style={styles.avatarSmall}
        source={{
          uri:
            profileImgUrl ||
            'https://firebasestorage.googleapis.com/v0/b/friendzone-dev-1c6af.appspot.com/o/no-user-tall.png?alt=media&token=d01e48ef-4e74-4022-a3ae-abe43be5fd91',
        }}
      />
      <Text style={{ color: 'white', fontSize: 22, fontWeight: '700' }}>
        {firstname}
      </Text>
    </View>
  )
}

export function OpenMessage({ route, navigation }) {
  const { userData, messages } = useAuth()
  const [openUserMessages, setOpenUserMessages] = useState([])
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <OpenMessageTitle
          firstname={route.params.firstname}
          profileImgUrl={route.params.profileImgUrl}
        />
      ),
    })
    const filtMessages = messages.filter((value) => {
      return (
        value.toUserId === route.params.userId ||
        value.fromUserId === route.params.userId
      )
    })
    setOpenUserMessages(filtMessages)
    return () => {
      setOpenUserMessages([])
    }
  }, [route])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, flexGrow: 1 }}>
        <View style={{ flex: 1, marginVertical: 10, marginHorizontal: 10 }}>
          {openUserMessages &&
            openUserMessages.map((msg, index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: msg.hasOwnProperty('fromUserId')
                    ? 'flex-start'
                    : 'flex-end',
                }}
              >
                <MessageBubble
                  side={msg.hasOwnProperty('fromUserId') ? 'left' : 'right'}
                  message={msg.message}
                  sentAt={msg.sentAt}
                />
              </View>
            ))}
        </View>
      </ScrollView>

      <View
        style={{
          flex: 1,
          flexGrow: 0,
          flexDirection: 'row',
          alignItems: 'center',
          flexBasis: 48,
          backgroundColor: 'white',
          padding: 4,
        }}
      >
        <TextInput
          style={{
            height: 40,
            width: '80%',
            borderWidth: 1,
            borderRadius: 8,
            borderColor: 'grey',
            marginRight: 4,
            paddingHorizontal: 8,
          }}
          placeholder="Type a message..."
          multiline
        />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
            height: '100%',
            borderRadius: 8,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700' }}>SEND</Text>
        </View>
      </View>
    </View>
  )
}

export function Messages({ navigation }) {
  const { userData, friendsProfiles, messages, messagesLoading } = useAuth()

  const reverseMessages = !messagesLoading ? messages.slice().reverse() : []

  return (
    <SafeAreaView style={styles.container}>
      {userData ? (
        <View style={styles.messageList}>
          <Text style={styles.title}>Messages</Text>
          {friendsProfiles ? (
            <ScrollView>
              {friendsProfiles.map((profile, index) => (
                <Pressable
                  key={index}
                  onPress={() =>
                    navigation.navigate('OpenMessage', {
                      userId: profile.userId,
                      firstname: profile.firstname,
                      profileImgUrl: profile.profileImgUrl,
                    })
                  }
                >
                  <FriendsListItem
                    {...profile}
                    {...reverseMessages.find(
                      ({ fromUserId, toUserId }) =>
                        fromUserId === profile.userId ||
                        toUserId === profile.userId,
                    )}
                  />
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <Text>All the friends you make will show up here</Text>
          )}
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    flex: 1,
    marginTop: 20,
  },
  friendsListItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: '5%',
    borderTopWidth: 1,
    borderColor: 'lightgrey',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    paddingBottom: 10,
    marginHorizontal: '5%',
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
  },
  avatarSmall: {
    height: 34,
    width: 34,
    borderRadius: 34 / 2,
    marginRight: 14,
  },
  name: {
    fontWeight: '500',
    fontSize: 14,
  },
  messagePreview: {
    color: 'grey',
    fontSize: 12,
  },
  sentAt: {
    color: 'grey',
    fontSize: 12,
  },
  bubble: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sentAtBubble: {
    fontSize: 12,
    color: 'grey',
    marginBottom: 8,
  },
})
