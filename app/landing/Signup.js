import React, { useState, useRef } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
} from 'react-native'

import { useForm, Controller } from 'react-hook-form'

import { useAuth } from '../../contexts/AuthContext'

function Signup({ nav }) {
  const { signup } = useAuth()

  const { control, handleSubmit, errors } = useForm()
  const [loading, setLoading] = useState(false)

  async function onSubmit(data) {
    try {
      //setError('')
      setLoading(true)
      //await login(data.email, data.password)
      //history.push('/lineup')
    } catch {
      //setError('Failed to sign in')
      setLoading(false)
    }
    //nav.navigate('Main')
  }

  const [emailFocus, setEmailFocus] = useState(false)
  const [passwordFocus, setPasswordFocus] = useState(false)

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <TextInput
            style={[styles.input, emailFocus && styles.inputFocus]}
            onFocus={() => setEmailFocus(true)}
            onBlur={() => {
              onBlur()
              setEmailFocus(false)
            }}
            onChangeText={(value) => onChange(value)}
            value={value}
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
      <Text style={styles.label}>Password</Text>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <TextInput
            style={[styles.input, passwordFocus && styles.inputFocus]}
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => {
              onBlur()
              setPasswordFocus(false)
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

      <Button
        title="Submit"
        disabled={loading}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
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
  inputFocus: {
    borderColor: 'dodgerblue',
  },
})

export default Signup
