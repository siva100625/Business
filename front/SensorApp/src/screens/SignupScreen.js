import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing icon library

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://192.168.138.25/api/auth/register/', {
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
    <View style={styles.container}>
      <Text style={styles.title}>SIGNUP</Text>

      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#FFFFFF" style={styles.icon} />
        <TextInput
          placeholder="email"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholderTextColor="#FFFFFF"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#FFFFFF" style={styles.icon} />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#FFFFFF"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? "eye-slash" : "eye"}
            size={20}
            color="#FFFFFF"
            style={styles.iconRight}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#FFFFFF" style={styles.icon} />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          placeholderTextColor="#FFFFFF"
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Icon
            name={showConfirmPassword ? "eye-slash" : "eye"}
            size={20}
            color="#FFFFFF"
            style={styles.iconRight}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <LinearGradient 
          colors={['#56CCF2', '#2F80ED']} // Gradient colors for the button
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>SIGN UP</Text>
        </LinearGradient>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text for title
    marginBottom: 40,
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
    color: '#FFFFFF', // White text for the button
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInText: {
    color: '#FFFFFF', // White color for sign in text
    fontSize: 14,
    marginTop: 20,
  },
});
