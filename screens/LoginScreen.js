import { View, Text, Button } from 'react-native'
import React from 'react'
import useAuth from '../hooks/useAuth'

const LoginScreen = () => {
  // const { user } = useAuth();
  const { signInWithGoogle } = useAuth();

  return (
    <View>
      <Text>Login to Lockitin</Text>
      <Button title='login' onPress={signInWithGoogle}/>
    </View>
  )
}

export default LoginScreen