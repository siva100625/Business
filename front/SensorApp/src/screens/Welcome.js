import React from 'react';
import {View,Image,Text,StyleSheet,TouchableOpacity } from 'react-native';

const Welcome = ({ navigation }) => {
  const handlePress = () => {
    // Navigate to the LoginScreen
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/l2.jpg')} // Adjust the path as needed
        style={styles.logo}
        resizeMode="contain"
      />
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>WELCOME</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0000', // Dark background color for the entire screen
    justifyContent: 'space-between', // Space between the items (logo and welcome)
    alignItems: 'center',
    paddingVertical: 50,
  },
  logo: {
    width: 250, // Increased width of the logo
    height: 250, // Increased height of the logo
    marginTop: 50, // Adds some top margin for spacing
    backgroundColor: '#0B0000', // Keep the background color as transparent
  },
  button: {
    marginBottom: 50, // Adds space at the bottom for the button
    backgroundColor: '#A2B6DF', // Light blue button background
    paddingVertical: 10,
    paddingHorizontal: 50, // Padding to increase button size
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B0000', // Dark text for the button
  },
});

export default Welcome;
