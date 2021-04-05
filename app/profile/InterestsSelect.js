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
import { Avatar, useTheme, Chip } from 'react-native-paper'

function InterestsSelect(props) {
  const { writeUserData, userData } = useAuth()
  const { colors, icons } = useTheme()

  const [changes, setChanges] = useState(false)
  const [interests, setInterests] = useState([])
  const [loading, setLoading] = useState(true)

  const handleClickChip = (item) => {
    if (interests.includes(item)) {
      setChanges(true)
      const newInterests = interests.filter((data) => data !== item)
      setInterests(newInterests)
    } else if (interests.length < 10) {
      setChanges(true)
      setInterests((current) => [...current, item])
    } else {
      console.log('You have already selected 10 interests!')
    }
  }

  const handleSave = (e) => {
    setLoading(true)
    // need to check if interest removed was a highlight, if so remove highlight
    writeUserData({ [props.id]: interests }).then(() => {
      setChanges(false)
      setLoading(false)
    })
  }

  useEffect(() => {
    userData[props.id] && setInterests(userData[props.id])
  }, [userData])

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View
        style={{
          flex: 0.15,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <MaterialIcons
          name={icons[props.id]}
          size={24}
          color={colors[props.id]}
        />
        <Text
          style={{ fontSize: 26, marginLeft: 8 }}
        >{`${props.category} (${interests.length}/10)`}</Text>
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 10,
        }}
      >
        {props.items.map((item, j) => (
          <Chip
            key={j}
            mode="filled"
            onPress={() => handleClickChip(item.name)}
            style={{
              borderColor: colors[props.id],
              borderWidth: 1,
              margin: 2,
              backgroundColor: interests?.includes(item.name)
                ? colors[props.id]
                : 'white',
            }}
            textStyle={{ fontSize: 13 }}
          >
            {item.name}
          </Chip>
        ))}
      </View>

      {changes && (
        <Pressable
          onPress={handleSave}
          disabled={loading}
          style={[
            styles.saveButton,
            { backgroundColor: loading ? 'grey' : colors.primary },
          ]}
        >
          <Text style={{ color: 'white' }}>Save Changes</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
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
  saveButton: {
    position: 'absolute',
    bottom: 40,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
})

export default InterestsSelect
