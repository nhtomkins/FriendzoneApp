import React, { useState, useRef } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Pressable,
} from 'react-native'

import { TextInput as PaperTextInput, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useForm, Controller } from 'react-hook-form'

import { useAuth } from '../../contexts/AuthContext'

function Login({ navigation }) {
  const { login } = useAuth()
  const { colors } = useTheme()
  const { control, handleSubmit, errors } = useForm()
  const [loading, setLoading] = useState(false)

  async function onSubmit(data) {
    try {
      //setError('')
      setLoading(true)
      await login(data.email, data.password)
      //history.push('/lineup')
    } catch {
      //setError('Failed to sign in')
      setLoading(false)
    }
    //nav.navigate('Main')
  }

  const emailRef = useRef()
  const passwordRef = useRef()

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={styles.container}
        onPress={() => navigation.navigate('Main')}
      >
        <Pressable
          style={styles.paper}
          onPress={() => {
            emailRef.current.blur()
            passwordRef.current.blur()
          }}
        >
          <Text style={[styles.title, { color: colors.primary }]}>Sign in</Text>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <PaperTextInput
                style={styles.paperInput}
                label="Email"
                mode="outlined"
                dense
                ref={emailRef}
                value={value}
                //onFocus={() => emailRef.current.focus()}
                onBlur={() => {
                  onBlur()
                  //emailRef.current.blur()
                }}
                onChangeText={(value) => onChange(value)}
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
              />
            )}
            name="email"
            rules={{ required: true }}
            defaultValue=""
          />
          {errors.email && <Text>This is required.</Text>}
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <PaperTextInput
                //style={[styles.input, passwordFocus && styles.inputFocus]}
                style={styles.paperInput}
                label="Password"
                mode="outlined"
                dense
                ref={passwordRef}
                //onFocus={() => passwordRef.current.focus()}
                onBlur={() => {
                  onBlur()
                  //passwordRef.current.blur()
                }}
                onChangeText={(value) => onChange(value)}
                value={value}
                autoCompleteType="password"
                textContentType="password"
                secureTextEntry
              />
            )}
            name="password"
            rules={{ required: true }}
            defaultValue=""
          />
          {errors.password && <Text>This is required.</Text>}
          <View style={styles.submitButton}>
            <Button
              color={colors.primary}
              title="Login"
              disabled={loading}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </Pressable>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  paper: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 30,
    width: '80%',
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    borderColor: 'lightgrey',
    borderStyle: 'solid',
    borderWidth: 1,
    height: 40,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  paperInput: {
    marginBottom: 5,
    width: '70%',
  },
  submitButton: {
    marginTop: 20,
    width: '40%',
  },
  inputFocus: {
    borderColor: 'dodgerblue',
  },
})

export default Login
