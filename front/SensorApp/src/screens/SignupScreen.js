import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#FFF2D7', '#FFF2D7', '#FFF2D7']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Animatable.Text 
          animation="fadeInDown" 
          style={styles.title}>
          Welcome To Safe Grip
        </Animatable.Text>

        <Animatable.View animation="bounceIn" delay={500}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Signup')}
          >
            <LinearGradient 
              colors={['#763626', '#763626', '#763626']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Sign up</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="bounceIn" delay={1000}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <LinearGradient 
              colors={['#763626', '#763626', '#763626']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
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
    marginBottom: 50,
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