import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MODES = ['circles', 'lines', 'crosses'];

export default function WinScreen({ route, navigation }) {
  const { mode, currentMode } = route.params;
  
  // Determine next mode
  const currentIndex = MODES.indexOf(currentMode);
  const nextMode = currentIndex < MODES.length - 1 ? MODES[currentIndex + 1] : null;
  
  const handleNextMode = () => {
    if (nextMode) {
      navigation.replace('Game', { mode: nextMode });
    }
  };
  
  const handleBackToHome = () => {
    navigation.navigate('Home');
  };
  
  const handlePlayAgain = () => {
    navigation.replace('Game', { mode: currentMode });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2c3e50']}
        style={styles.background}
      />
      
      <View style={styles.content}>
        {/* Trophy/Win Icon */}
        <View style={styles.trophyContainer}>
          <View style={styles.trophy}>
            <Text style={styles.trophyEmoji}>🏆</Text>
          </View>
        </View>
        
        {/* Win Text */}
        <Text style={styles.winTitle}>YOU WON!</Text>
        <Text style={styles.modeText}>{currentMode.toUpperCase()} MODE COMPLETED</Text>
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>5/5</Text>
            <Text style={styles.statLabel}>RINGS PASSED</Text>
          </View>
        </View>
        
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {nextMode && (
            <TouchableOpacity 
              style={[styles.button, styles.nextModeButton]}
              onPress={handleNextMode}
            >
              <Text style={styles.buttonText}>NEXT MODE</Text>
              <Text style={styles.nextModeText}>{nextMode.toUpperCase()}</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.button, styles.playAgainButton]}
            onPress={handlePlayAgain}
          >
            <Text style={styles.buttonText}>PLAY AGAIN</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.homeButton]}
            onPress={handleBackToHome}
          >
            <Text style={styles.homeButtonText}>BACK TO HOME</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 30,
  },
  trophyContainer: {
    marginBottom: 30,
  },
  trophy: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  trophyEmoji: {
    fontSize: 60,
  },
  winTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 3,
    marginBottom: 10,
  },
  modeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 50,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#33ff66',
  },
  statLabel: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
    letterSpacing: 1,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
  },
  nextModeButton: {
    backgroundColor: '#33ff66',
  },
  playAgainButton: {
    backgroundColor: '#3366ff',
  },
  homeButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  nextModeText: {
    color: '#1a1a1a',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
