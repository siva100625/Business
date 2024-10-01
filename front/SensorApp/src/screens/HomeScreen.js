import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
        <Image
          source={require('../../assets/logo.jpg')} // Adjust the path as needed
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background
  },
  logo: {
    width: 200,  // Adjust width based on how large you want the image
    height: 200, // Adjust height based on how large you want the image
  },
});

export default HomeScreen;
