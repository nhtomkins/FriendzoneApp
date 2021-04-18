import React, { useState, useEffect, useRef } from 'react'
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
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../../contexts/AuthContext'
import { Avatar, useTheme } from 'react-native-paper'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import LineupProfile from '../lineup/LineupProfile'
import { format, isToday } from 'date-fns'

const OpenFriendTab = createMaterialTopTabNavigator()

function displayDateHelper(date) {
  if (isToday(date)) {
    return format(date, 'p')
  } else {
    return format(date, "ccc',' d MMM',' p")
  }
}

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

function MessageBubble({ side, message, first }) {
  const { colors } = useTheme()

  return (
    <View
      style={[
        {
          flex: 0,
          maxWidth: '70%',
          alignItems: side === 'left' ? 'flex-start' : 'flex-end',
          marginVertical: 1,
          overflow: 'hidden',
          borderRadius: 20,
          //marginHorizontal: 5,
        },
        side === 'left'
          ? {
              borderTopLeftRadius: first ? 20 : 8,
              borderBottomLeftRadius: 8,
              backgroundColor: 'lightgrey',
            }
          : {
              borderTopRightRadius: first ? 20 : 8,
              borderBottomRightRadius: 8,
              backgroundColor: colors.primary,
            },
      ]}
    >
      <Text
        style={[
          styles.bubble,
          side === 'left'
            ? {
                color: 'black',
              }
            : {
                color: 'white',
              },
        ]}
      >
        {message}
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
  const { userData, messages, sendPrivateMessage } = useAuth()
  const [openUserMessages, setOpenUserMessages] = useState([])
  const { colors } = useTheme()
  const messagesListRef = useRef()
  const [message, onChangeMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const insets = useSafeAreaInsets()

  useEffect(() => {
    const filtMessages = []
    messages.forEach((msg) => {
      if (
        msg.toUserId === route.params.userId ||
        msg.fromUserId === route.params.userId
      ) {
        filtMessages.push(msg)
      }
    })
    filtMessages.length > 1 &&
      filtMessages.forEach((msg, index) => {
        if (
          index < filtMessages.length - 1 &&
          msg.sentAt?.toDate().getTime() -
            filtMessages[index + 1].sentAt?.toDate().getTime() <
            600000 //check if longer than 10 minutes between messages
        ) {
          delete filtMessages[index].sentAt
        }
      })
    setOpenUserMessages(filtMessages)
  }, [messages])

  async function handleSendMessage(e) {
    e.preventDefault()

    if (message !== '') {
      try {
        setError('')
        setLoading(true)
        await sendPrivateMessage(message, route.params.userId)
        onChangeMessage('')
      } catch {
        setError('Failed to send message')
      }

      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponent={<View style={{ height: 10 }} />}
        ListFooterComponentStyle={{
          flex: 1,
          alignItems: 'center',
          marginBottom: 10,
        }}
        ListFooterComponent={
          <Text style={{ color: 'grey', fontSize: 12 }}>
            The start of your conversation!
          </Text>
        }
        ref={messagesListRef}
        inverted={true}
        data={openUserMessages}
        renderItem={({ item, index }) => (
          <View
            style={{
              flex: 1,
              width: '96%',
              alignSelf: 'center',
            }}
          >
            {item.sentAt && (
              <Text style={styles.sentAtText}>
                {displayDateHelper(item.sentAt?.toDate())}
              </Text>
            )}
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: item.hasOwnProperty('fromUserId')
                  ? 'flex-start'
                  : 'flex-end',
              }}
            >
              <MessageBubble
                side={item.hasOwnProperty('fromUserId') ? 'left' : 'right'}
                message={item.message}
                first={item.hasOwnProperty('sentAt')}
              />
            </View>
          </View>
        )}
      />

      <View
        style={{
          flex: 1,
          flexGrow: 0,
          flexDirection: 'row',
          alignItems: 'center',
          flexBasis: 49,
          backgroundColor: 'white',
          padding: 4,
          borderTopWidth: 1,
          borderColor: 'grey',
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
          value={message}
          onChangeText={onChangeMessage}
          multiline
        />
        <Pressable
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: loading ? 'grey' : colors.primary,
            height: '100%',
            borderRadius: 8,
          }}
          onPress={handleSendMessage}
          disabled={loading}
        >
          <Text style={{ color: 'white', fontWeight: '700' }}>SEND</Text>
        </Pressable>
      </View>
    </View>
  )
}

function showProfile({ route, navigation }) {
  const { userData, friendsProfiles } = useAuth()
  const [profileData, setProfileData] = useState({})

  useEffect(() => {
    const findProfile = friendsProfiles.find(
      (profile) => profile.userId === route.params.userId,
    )
    setProfileData(findProfile)
  }, [])

  return (
    <ScrollView>
      <LineupProfile expanded={true} {...profileData} />
    </ScrollView>
  )
}

export function OpenFriend({ route, navigation }) {
  const { colors } = useTheme()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <OpenMessageTitle
          firstname={route.params.firstname}
          profileImgUrl={route.params.profileImgUrl}
        />
      ),
      headerRight: () => (
        <Button
          title="test"
          onPress={() => console.log(route.params.firstname)}
        />
      ),
    })
  }, [route])

  return (
    <View style={{ flex: 1 }}>
      <OpenFriendTab.Navigator
        tabBarOptions={{
          labelStyle: { margin: 0 },
          tabStyle: { padding: 10, minHeight: 40 },
          indicatorStyle: {
            backgroundColor: colors.primary,
          },
        }}
        backBehavior="none"
      >
        <OpenFriendTab.Screen
          name="Messages"
          component={OpenMessage}
          initialParams={route.params}
        />
        <OpenFriendTab.Screen
          name="Profile"
          component={showProfile}
          initialParams={route.params}
        />
      </OpenFriendTab.Navigator>
    </View>
  )
}

export function Messages({ navigation }) {
  const { userData, friendsProfiles, messages, messagesLoading } = useAuth()

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
                    navigation.navigate('OpenFriend', {
                      userId: profile.userId,
                      firstname: profile.firstname,
                      profileImgUrl: profile.profileImgUrl,
                    })
                  }
                >
                  <FriendsListItem
                    {...profile}
                    {...messages?.find(
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  sentAtText: {
    fontSize: 12,
    color: 'grey',
    marginBottom: 6,
    marginTop: 20,
    alignSelf: 'center',
  },
})
