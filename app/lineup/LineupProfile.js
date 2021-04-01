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
  ScrollView,
  Pressable,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../../contexts/AuthContext'
import { Avatar } from 'react-native-paper'
import { Chip, useTheme, Title } from 'react-native-paper'

const LineupProfileInterests = (props) => {
  const { userData } = useAuth()

  return (
    <View style={{ flex: 1, alignItems: 'center', marginVertical: 10 }}>
      <View
        style={{ borderTopWidth: 1, width: '90%', borderColor: '#d8d8d8' }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
        }}
      >
        <MaterialIcons name={props.icon} size={24} color={props.color} />
        <Text style={{ fontSize: 26, marginLeft: 8 }}>{props.title}</Text>
      </View>
      {props.imgUrl && (
        <View style={{ marginBottom: 10 }}>
          <Image
            style={{ width: '60%', aspectRatio: 1 }}
            source={{
              uri: props.imgUrl,
            }}
          />
        </View>
      )}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 10,
        }}
      >
        {props.interests.map((item, j) => (
          <Chip
            key={j}
            mode="outlined"
            style={{
              borderColor: props.color,
              borderWidth: 1,
              margin: 2,
              backgroundColor:
                !props.noBackground && userData[props.id]?.includes(item)
                  ? props.color
                  : 'white',
            }}
            textStyle={{ fontSize: 13 }}
          >
            {item}
          </Chip>
        ))}
      </View>
    </View>
  )
}

const LineupProfile = ({ expanded = false, navigation = null, ...props }) => {
  const { likeUser, unlikeUser, userData } = useAuth()
  const { colors } = useTheme()

  const [numActivities, setNumActivities] = useState(0)
  const [numLifestyle, setNumLifestyle] = useState(0)
  const [numMovies, setNumMovies] = useState(0)
  const [numMusic, setNumMusic] = useState(0)
  const [numSports, setNumSports] = useState(0)

  const handleLike = (e) => {
    console.log('liked')
    likeUser(props)
  }

  const handleUnlike = (e) => {
    unlikeUser(props)
  }

  useEffect(() => {
    if (props.userId !== userData.userId) {
      props.activities?.forEach((item) => {
        userData.activities?.includes(item) &&
          setNumActivities((count) => count + 1)
      })
      props.lifestyle?.forEach((item) => {
        userData.lifestyle?.includes(item) &&
          setNumLifestyle((count) => count + 1)
      })
      props.movies?.forEach((item) => {
        userData.movies?.includes(item) && setNumMovies((count) => count + 1)
      })
      props.music?.forEach((item) => {
        userData.music?.includes(item) && setNumMusic((count) => count + 1)
      })
      props.sports?.forEach((item) => {
        userData.sports?.includes(item) && setNumSports((count) => count + 1)
      })
    }
    return () => {
      setNumActivities(0)
      setNumLifestyle(0)
      setNumMovies(0)
      setNumMusic(0)
      setNumSports(0)
    }
  }, [props.userId])

  return (
    <View style={styles.container}>
      <Image
        style={styles.topImage}
        source={{
          uri:
            props.profileImgUrl ||
            'https://firebasestorage.googleapis.com/v0/b/friendzone-dev-1c6af.appspot.com/o/no-user-tall.png?alt=media&token=d01e48ef-4e74-4022-a3ae-abe43be5fd91',
        }}
      />

      <View style={{ flex: 1, paddingTop: 10 }}>
        <View style={{ flex: 1, marginVertical: 16, marginHorizontal: 26 }}>
          <View
            style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}
          >
            <Text style={{ fontSize: 36 }}>{props.firstname}</Text>

            <Text
              style={{
                fontSize: 26,
                marginBottom: 3,
                marginLeft: 16,
                color: 'gray',
              }}
            >
              {props.age}
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', marginBottom: 24 }}>
            <MaterialIcons name="place" size={20} color="black" />
            <Text
              style={{
                fontSize: 14,
                marginLeft: 4,
                color: 'gray',
              }}
            >
              {props.city}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {props.highlights?.map((item, j) => (
              <Chip
                key={j}
                style={{
                  backgroundColor: colors.accent,
                  margin: 2,
                }}
                textStyle={{ fontSize: 13 }}
              >
                {item}
              </Chip>
            ))}
          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 12,
            marginHorizontal: 12,
          }}
        >
          <View
            style={[
              styles.similaritiesChip,
              { borderColor: colors.activities },
            ]}
          >
            <Text style={styles.chipText}>{numActivities}</Text>
            <MaterialIcons
              name="local-activity"
              size={24}
              color={colors.activities}
            />
          </View>
          <View
            style={[styles.similaritiesChip, { borderColor: colors.lifestyle }]}
          >
            <Text style={styles.chipText}>{numLifestyle}</Text>
            <MaterialIcons
              name="local-bar"
              size={24}
              color={colors.lifestyle}
            />
          </View>
          <View
            style={[styles.similaritiesChip, { borderColor: colors.movies }]}
          >
            <Text style={styles.chipText}>{numMovies}</Text>
            <MaterialIcons name="movie" size={24} color={colors.movies} />
          </View>
          <View
            style={[styles.similaritiesChip, { borderColor: colors.music }]}
          >
            <Text style={styles.chipText}>{numMusic}</Text>
            <MaterialIcons name="music-note" size={24} color={colors.music} />
          </View>
          <View
            style={[styles.similaritiesChip, { borderColor: colors.sports }]}
          >
            <Text style={styles.chipText}>{numSports}</Text>
            <MaterialIcons
              name="fitness-center"
              size={24}
              color={colors.sports}
            />
          </View>
        </View>
        {expanded ? (
          <View>
            {props.activities && (
              <LineupProfileInterests
                interests={props.activities}
                id="activities"
                color={colors.activities}
                icon="local-activity"
                title="Activities"
                imgUrl={props.activitiesImgUrl}
                noBackground={props.userId === userData.userId}
              />
            )}
            {props.lifestyle && (
              <LineupProfileInterests
                interests={props.lifestyle}
                id="lifestyle"
                color={colors.lifestyle}
                icon="local-bar"
                title="Lifestyle"
                imgUrl={props.lifestyleImgUrl}
                noBackground={props.userId === userData.userId}
              />
            )}
            {props.movies && (
              <LineupProfileInterests
                interests={props.movies}
                id="movies"
                color={colors.movies}
                icon="movie"
                title="Movies & TV"
                imgUrl={props.moviesImgUrl}
                noBackground={props.userId === userData.userId}
              />
            )}
            {props.music && (
              <LineupProfileInterests
                interests={props.music}
                id="music"
                color={colors.music}
                icon="music-note"
                title="Music & Arts"
                imgUrl={props.musicImgUrl}
                noBackground={props.userId === userData.userId}
              />
            )}
            {props.sports && (
              <LineupProfileInterests
                interests={props.sports}
                id="sports"
                color={colors.sports}
                icon="fitness-center"
                title="Sports & Fitness"
                imgUrl={props.sportsImgUrl}
                noBackground={props.userId === userData.userId}
              />
            )}
          </View>
        ) : (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View
              style={{
                borderTopWidth: 1,
                width: '100%',
                borderColor: '#d8d8d8',
              }}
            />
            <View style={[styles.likeBar]}>
              <Pressable
                onPress={() => {
                  navigation.navigate('Profile', { ...props })
                }}
              >
                <MaterialIcons
                  style={styles.likeIcon}
                  name="info"
                  size={30}
                  color={colors.secondary}
                />
              </Pressable>

              {!userData.likedUsers?.includes(props.userId) && (
                <Pressable onPress={handleLike}>
                  <MaterialIcons
                    style={styles.likeIcon}
                    name="thumb-up"
                    size={24}
                    color={colors.secondary}
                  />
                </Pressable>
              )}
            </View>
          </View>
        )}
        {props.userId !== userData.userId && (
          <>
            <Text style={[styles.likeText, { color: colors.secondary }]}>
              {props.likedUsers?.includes(userData.userId)
                ? userData.likedUsers?.includes(props.userId)
                  ? 'You are friends'
                  : 'Already likes you!'
                : userData.likedUsers?.includes(props.userId) && 'Liked!'}
            </Text>
            <MaterialIcons
              style={styles.moreIcon}
              name="more-vert"
              size={24}
              color="black"
            />
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  topImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    //aspectRatio: 1,
  },
  similaritiesChip: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 8,
    margin: 2,
  },
  chipText: {
    marginRight: 6,
  },
  likeBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  likeIcon: {},
  moreIcon: {
    position: 'absolute',
    right: 20,
    top: 40,
  },
  likeText: {
    position: 'absolute',
    alignSelf: 'center',
    top: 10,
    fontWeight: '700',
  },
  interestChip: {},
})

export default LineupProfile
