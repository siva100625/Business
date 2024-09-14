import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function LedControlScreen() {
  const [inputValue, setInputValue] = useState('');
  const [threshold, setThreshold] = useState(50);  // Example threshold value

  const handleBlinkLed = async () => {
    try {
      const response = await axios.post('http://192.168.21.25/api/blink-led/');
      alert(response.data.message);
    } catch (error) {
      console.error('Error posting to Django:', error);
      alert('Error posting to Django');
    }
  };

  const handleEnter = () => {
    const userInput = parseFloat(inputValue);

    if (isNaN(userInput)) {
      Alert.alert('Invalid Input', 'Please enter a valid number');
      return;
    }

    if (userInput > threshold) {
      handleBlinkLed();
    } else {
      Alert.alert('Input below threshold', `The entered value (${userInput}) is below the threshold (${threshold})`);
    }

    setInputValue('');  // Clear input field after checking
  };

  return (
    <View style={styles.container}>
      {/* Top half: Input field and enter button */}
      <View style={styles.topContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a value"
          keyboardType="numeric"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <TouchableOpacity onPress={handleEnter} style={styles.enterButton}>
          <Text style={styles.buttonText}>Enter</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom half: Blink LED button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={handleBlinkLed}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Blink LED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 200,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  enterButton: {
    width: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 200,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});