import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ModeSelectionScreen({ navigation }) {
  const modes = [
    { id: 'circles', name: 'CIRCLES MODE', color: '#ff3366' },
    { id: 'lines', name: 'LINES MODE', color: '#33ff66' },
    { id: 'crosses', name: 'CROSSES MODE', color: '#3366ff' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2c3e50']}
        style={styles.background}
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SELECT MODE</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {modes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[styles.modeButton, { borderColor: mode.color }]}
            onPress={() => navigation.navigate('Game', { mode: mode.id })}
          >
            <Text style={[styles.modeButtonText, { color: mode.color }]}>{mode.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  header: {
    marginTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  modeButton: {
    width: '80%',
    paddingVertical: 30,
    marginVertical: 15,
    borderRadius: 15,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  modeButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
