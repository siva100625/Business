import React from 'react';
import { Image, View, Text } from 'react-native';

export default function GraphScreen() {
  return (
    <View>
      <Text>Sensor Data Graph</Text>
      <Image
        source={{ uri: 'http://192.168.219.25/api/auth/plot-graph/' }}
        style={{ width: 300, height: 300 }}
      />
    </View>
  );
}
