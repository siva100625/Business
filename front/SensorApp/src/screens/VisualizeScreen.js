import React from 'react';
import { Image, View, Text, StyleSheet, Dimensions } from 'react-native';

export default function GraphScreen() {
  const screenWidth = Dimensions.get('window').width; // Get the screen width for responsive layout

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Data Graph</Text>
      <Image
        source={{ uri: 'http://192.168.147.95/api/auth/plot-graph/' }}
        style={[styles.graphImage, { width: screenWidth * 0.9, height: screenWidth * 0.9 }]} // Make image responsive
        resizeMode="contain" // Ensures the image scales properly within the container
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centers the content vertically
    alignItems: 'center',     // Centers the content horizontally
    backgroundColor: '#FFF2D7', // Light background color
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Dark text color
    marginBottom: 20, // Spacing between title and graph
    textAlign: 'center',
  },
  graphImage: {
    borderRadius: 10, // Adds rounded corners to the graph image
    borderWidth: 2,
    borderColor: '#763626', // Add border color (blue)
  },
});