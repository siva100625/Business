import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.138.25/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Login successful');
        navigation.replace('Main');
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOGIN</Text>

      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#FFFFFF" style={styles.icon} />
        <TextInput
          placeholder="EMAIL"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholderTextColor="#FFFFFF"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#FFFFFF" style={styles.icon} />
        <TextInput
          placeholder="PASSWORD"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#FFFFFF"
          secureTextEntry
        />
        <Icon name="eye" size={20} color="#FFFFFF" style={styles.iconRight} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <LinearGradient 
          colors={['#56CCF2', '#2F80ED']} // Gradient colors
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.signUpButton}>
        <Text style={styles.signUpText}>Don’t have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0000', // Dark background
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    width: Dimensions.get('window').width * 0.8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF', // White input text color
    padding: 10,
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  button: {
    marginTop: 30,
    width: Dimensions.get('window').width * 0.8,
    borderRadius: 25,
  },
  buttonGradient: {
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpButton: {
    marginTop: 20, // Add some space above the button
    padding: 10,
    backgroundColor: '#56CCF2', // Background color for the sign-up button
    borderRadius: 5,
    alignItems: 'center',
  },
  signUpText: {
    color: '#FFFFFF', // Text color for the button
    fontSize: 14,
    fontWeight: 'bold',
  },
});
