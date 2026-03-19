import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2c3e50']}
        style={styles.background}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>COLOUR</Text>
        <Text style={[styles.title, styles.titleDrift]}>DRIFT</Text>
        
        <View style={styles.circleContainer}>
          <View style={[styles.circle, { backgroundColor: '#ff3366', top: 0, left: 0 }]} />
          <View style={[styles.circle, { backgroundColor: '#33ff66', top: 0, right: 0 }]} />
          <View style={[styles.circle, { backgroundColor: '#3366ff', bottom: 0, left: 0 }]} />
          <View style={[styles.circle, { backgroundColor: '#ffff33', bottom: 0, right: 0 }]} />
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('ModeSelection')}
        >
          <Text style={styles.buttonText}>START GAME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 60,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 5,
  },
  titleDrift: {
    color: '#ff3366',
    marginTop: -10,
    marginBottom: 40,
  },
  circleContainer: {
    width: 100,
    height: 100,
    marginBottom: 60,
    position: 'relative',
  },
  circle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    position: 'absolute',
  },
  button: {
    backgroundColor: 'transparent',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
