import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.147.95/api/auth/login/', {
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

  const { width } = Dimensions.get('window');

  return (
    <ImageBackground
      source={{ uri: 'https://example.com/colorful-background.jpg' }} // Replace with a vibrant image or a local image
      style={styles.background}
    >
      <LinearGradient
        colors={['#FFF2D7', '#FFF2D7', '#FFF2D7']}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={[styles.input, { width: width * 0.85 }]}
            placeholderTextColor="black"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { width: width * 0.85 }]}
            placeholderTextColor="black"
            secureTextEntry
          />

          <TouchableOpacity style={[styles.button, { width: width * 0.85 }]} onPress={handleLogin}>
            <LinearGradient
              colors={['#763626', '#763626', '#763626']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    color: '#763626',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 32,
    color: '#763626',
    marginBottom: 40,
    fontWeight:'bold',
  },
  input: {
    padding: 15,
    borderColor:'#763626',
    borderWidth: 3,
    marginVertical: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'black',
    fontSize: 16,
   
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    //elevation: 20,
  },
  button: {
    borderRadius: 25,
    marginTop: 20,
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
  linkText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 150,
  },
});