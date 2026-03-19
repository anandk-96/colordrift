import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  Alert
} from 'react-native';
import { Svg, Path, G } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const BALL_SIZE = 16;
const RING_RADIUS = 135; // Large ring size
const RING_THICKNESS = 24;
const GRAVITY = 0.2; // Slower gravity
const JUMP_FORCE = -9;
const RING_SPACING = 520;
const TOTAL_RINGS = 5;
const SWITCHER_RADIUS = 28;

const COLORS = ['#ff3366', '#33ff66', '#3366ff', '#ffff33'];

export default function GameScreen({ route, navigation }) {
  const { mode } = route.params;
  
  // Game state
  const [gameState, setGameState] = useState('waiting');
  const [score, setScore] = useState(0);
  const [ballColorIndex, setBallColorIndex] = useState(0);
  
  // Ball physics
  const ballY = useRef(new Animated.Value(height * 0.7)).current;
  const ballVelocity = useRef(0);
  const ballYValue = useRef(height * 0.7);
  const prevBallY = useRef(height * 0.7);
  
  // Camera offset for scrolling
  const cameraOffset = useRef(new Animated.Value(0)).current;
  const cameraOffsetValue = useRef(0);
  
  // Ring rotations - full ring with 4 colored segments
  const [ringRotations, setRingRotations] = useState(
    Array(TOTAL_RINGS).fill(0).map((_, i) => ({
      angle: Math.random() * 360,
      speed: 0.5 + Math.random() * 0.6,
      y: height * 0.2 - i * RING_SPACING,
      passed: false,
    }))
  );
  
  // Color switchers between rings
  const [switchers, setSwitchers] = useState(
    Array(TOTAL_RINGS - 1).fill(0).map((_, i) => ({
      y: height * 0.2 - i * RING_SPACING - RING_SPACING / 2,
      colorIndex: Math.floor(Math.random() * 4),
      collected: false,
    }))
  );
  
  // Refs for game loop
  const gameLoopRef = useRef(null);
  const lastTimeRef = useRef(Date.now());
  
  // Track ball Y value
  useEffect(() => {
    const listener = ballY.addListener(({ value }) => {
      ballYValue.current = value;
    });
    return () => ballY.removeListener(listener);
  }, []);
  
  // Track camera offset value
  useEffect(() => {
    const listener = cameraOffset.addListener(({ value }) => {
      cameraOffsetValue.current = value;
    });
    return () => cameraOffset.removeListener(listener);
  }, []);
  
  // Game loop
  useEffect(() => {
    if (gameState === 'playing') {
      const gameLoop = () => {
        const now = Date.now();
        const delta = Math.min((now - lastTimeRef.current) / 16, 2.5);
        lastTimeRef.current = now;
        
        prevBallY.current = ballYValue.current;
        
        // Update ball physics
        ballVelocity.current += GRAVITY * delta;
        const newY = ballYValue.current + ballVelocity.current * delta;
        
        // Check boundaries
        if (newY > height + 100) {
          setGameState('gameover');
          Alert.alert('Game Over', 'You fell!', [
            { text: 'Try Again', onPress: resetGame }
          ]);
          return;
        }
        
        ballY.setValue(newY);
        
        // Update camera to follow ball and keep last ring visible
        const targetCamera = newY - height * 0.45;
        const newCamera = cameraOffsetValue.current + (targetCamera - cameraOffsetValue.current) * 0.08;
        cameraOffset.setValue(newCamera);
        
        // Update ring rotations
        setRingRotations(prev => prev.map(ring => ({
          ...ring,
          angle: ring.angle + ring.speed * delta,
        })));
        
        // Check collisions
        checkCollisions(newY);
        
        // Check win condition
        const passedRings = ringRotations.filter(r => r.passed).length;
        if (passedRings === TOTAL_RINGS && gameState === 'playing') {
          setGameState('won');
          navigation.navigate('Win', { mode, currentMode: mode });
          return;
        }
        
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      };
      
      lastTimeRef.current = Date.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState]);
  
  const checkCollisions = (currentY) => {
    const ballRadius = BALL_SIZE / 2;
    
    // Check ring collisions - STRICT: match segment color at ball position
    ringRotations.forEach((ring, index) => {
      if (ring.passed) return;
      
      const ringWorldY = ring.y;
      
      // Check if ball is within ring collision band
      const distToRing = Math.abs(currentY - ringWorldY);
      if (distToRing > RING_THICKNESS / 2 + ballRadius) {
        return;
      }
      
      // Determine which segment is at ball's position (bottom of ring)
      const normalizedAngle = ((ring.angle % 360) + 360) % 360;
      const relativeAngle = (90 - normalizedAngle + 360) % 360;
      const segmentAtBall = Math.floor(relativeAngle / 90) % 4;
      
      // Strict color check
      if (segmentAtBall !== ballColorIndex) {
        setGameState('gameover');
        Alert.alert('Game Over', 'Wrong color!', [
          { text: 'Try Again', onPress: resetGame }
        ]);
        return;
      }
      
      // Pass through once when ball crosses ring center
      const wasAbove = prevBallY.current < ringWorldY;
      const isBelow = currentY >= ringWorldY;
      if (wasAbove && isBelow) {
        setRingRotations(prev => {
          const updated = [...prev];
          updated[index] = { ...updated[index], passed: true };
          return updated;
        });
        setScore(prev => prev + 1);
      }
    });
    
    // Check color switcher - ALWAYS works
    switchers.forEach((switcher, index) => {
      if (switcher.collected) return;
      
      const switcherWorldY = switcher.y;
      const distY = Math.abs(currentY - switcherWorldY);
      
      if (distY < SWITCHER_RADIUS + ballRadius + 15) {
        setBallColorIndex(switcher.colorIndex);
        setSwitchers(prev => {
          const updated = [...prev];
          updated[index] = { ...updated[index], collected: true };
          return updated;
        });
      }
    });
  };
  
  const jump = useCallback(() => {
    if (gameState === 'waiting') {
      setGameState('playing');
    }
    if (gameState === 'playing' || gameState === 'waiting') {
      ballVelocity.current = JUMP_FORCE;
    }
  }, [gameState]);
  
  const resetGame = () => {
    ballVelocity.current = 0;
    ballY.setValue(height * 0.7);
    ballYValue.current = height * 0.7;
    prevBallY.current = height * 0.7;
    cameraOffset.setValue(0);
    cameraOffsetValue.current = 0;
    setBallColorIndex(0);
    setScore(0);
    setGameState('waiting');
    setRingRotations(
      Array(TOTAL_RINGS).fill(0).map((_, i) => ({
        angle: Math.random() * 360,
        speed: 0.5 + Math.random() * 0.6,
        y: height * 0.2 - i * RING_SPACING,
        passed: false,
      }))
    );
    setSwitchers(
      Array(TOTAL_RINGS - 1).fill(0).map((_, i) => ({
        y: height * 0.2 - i * RING_SPACING - RING_SPACING / 2,
        colorIndex: Math.floor(Math.random() * 4),
        collected: false,
      }))
    );
  };
  
  // Render ring with 4 colored segments (full circle)
  const renderRing = (ring, index) => {
    const screenY = ring.y - cameraOffsetValue.current;
    
    // Don't render if off screen
    if (screenY < -300 || screenY > height + 300) {
      return null;
    }
    
    const centerX = width / 2;
    const r = RING_RADIUS;
    const t = RING_THICKNESS;
    
    // Create 4 arc paths
    const createArc = (segmentIndex, startAngle, endAngle, color) => {
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      
      const x1 = centerX + r * Math.cos(startRad);
      const y1 = screenY + r * Math.sin(startRad);
      const x2 = centerX + r * Math.cos(endRad);
      const y2 = screenY + r * Math.sin(endRad);
      
      const largeArc = endAngle - startAngle > 180 ? 1 : 0;
      
      return (
        <Path
          key={`${index}-seg-${segmentIndex}`}
          d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
          stroke={color}
          strokeWidth={t}
          fill="none"
          strokeLinecap="butt"
        />
      );
    };
    
    return (
      <G key={`ring-${index}`}>
        {createArc(0, ring.angle, ring.angle + 90, COLORS[0])}
        {createArc(1, ring.angle + 90, ring.angle + 180, COLORS[1])}
        {createArc(2, ring.angle + 180, ring.angle + 270, COLORS[2])}
        {createArc(3, ring.angle + 270, ring.angle + 360, COLORS[3])}
      </G>
    );
  };
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={1}
      onPress={jump}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>EXIT</Text>
        </TouchableOpacity>
        <Text style={styles.score}>{score}/{TOTAL_RINGS}</Text>
      </View>
      
      {/* Game Area */}
      <View style={styles.gameArea}>
        {/* SVG Layer for rings */}
        <Svg style={StyleSheet.absoluteFill}>
          {ringRotations.map((ring, index) => renderRing(ring, index))}
        </Svg>
        
        {/* Color Switchers */}
        {switchers.map((switcher, index) => {
          const screenY = switcher.y - cameraOffsetValue.current;
          if (screenY < -SWITCHER_RADIUS * 2 || screenY > height + SWITCHER_RADIUS * 2 || switcher.collected) {
            return null;
          }
          return (
            <View
              key={`switcher-${index}`}
              style={[
                styles.switcher,
                {
                  top: screenY - SWITCHER_RADIUS,
                  width: SWITCHER_RADIUS * 2,
                  height: SWITCHER_RADIUS * 2,
                  borderRadius: SWITCHER_RADIUS,
                  backgroundColor: COLORS[switcher.colorIndex],
                }
              ]}
            />
          );
        })}
        
        {/* Ball */}
        <Animated.View
          style={[
            styles.ball,
            {
              backgroundColor: COLORS[ballColorIndex],
              transform: [{
                translateY: ballY.interpolate({
                  inputRange: [0, height],
                  outputRange: [0, height],
                })
              }]
            }
          ]}
        />
        
        {/* Start instruction */}
        {gameState === 'waiting' && (
          <View style={styles.startOverlay}>
            <Text style={styles.startText}>TAP TO JUMP</Text>
            <Text style={styles.instructionText}>
              Pass through matching colors!
            </Text>
          </View>
        )}
      </View>
      
      {/* Color indicator */}
      <View style={styles.colorIndicator}>
        <Text style={styles.colorText}>BALL COLOR</Text>
        <View style={[styles.colorDot, { backgroundColor: COLORS[ballColorIndex] }]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    marginTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  backButton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  score: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  ball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    position: 'absolute',
    left: width / 2 - BALL_SIZE / 2,
    top: 0,
    zIndex: 50,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  switcher: {
    position: 'absolute',
    left: width / 2 - SWITCHER_RADIUS,
    zIndex: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  startOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  startText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
  },
  instructionText: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 10,
  },
  colorIndicator: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
  },
  colorText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 10,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
