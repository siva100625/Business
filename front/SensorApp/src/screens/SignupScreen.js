import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://192.168.21.25/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Signup successful');
        navigation.replace('Main');
      } else {
        Alert.alert('Error', data.message || 'Signup failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <LinearGradient
      colors={['#FFF2D7', '#FFF2D7', '#FFF2D7']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Signup Page</Text>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <LinearGradient 
            colors={['#763626', '#763626', '#763626']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Signup</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 32,
    color: '#763626',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: 250,
    padding: 10,
    borderColor: '#763626',
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 5,
    color: '#763626',
  },
  button: {
    width: Dimensions.get('window').width * 0.7,
    marginVertical: 15,
    borderRadius: 25,
  },
  buttonGradient: {
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
