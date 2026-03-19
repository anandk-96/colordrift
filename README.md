# 🎨 ColorDrift

A React Native color-matching game built with Expo. Match colors, beat the clock, and challenge your reflexes!

## 🎮 Features

- **Color Matching Gameplay** - Match the target color quickly
- **Multiple Game Modes** - Different challenges to test your skills
- **Timer-Based Challenges** - Race against time
- **Score Tracking** - Track your best performances
- **Beautiful UI** - Clean, colorful interface

## 📱 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app (for testing on device)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

1. Install the **Expo Go** app from App Store (iOS) or Google Play (Android)
2. Scan the QR code displayed in the terminal
3. The game will load in Expo Go

### Running on Simulator

```bash
# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android
```

## 🎯 How to Play

1. Select a game mode from the home screen
2. Match the target color as quickly as possible
3. Earn points for correct matches
4. Beat your high score!

## 📁 Project Structure

```
colordrift/
├── screens/
│   ├── HomeScreen.js           # Main menu
│   ├── ModeSelectionScreen.js  # Game mode selection
│   ├── GameScreen.js           # Main gameplay
│   └── WinScreen.js            # Victory screen
├── App.js                      # App entry point
├── app.json                    # Expo configuration
└── package.json                # Dependencies
```

## 🛠️ Technologies Used

- **Expo** - React Native framework
- **React Native** - Mobile app framework
- **React Navigation** - Screen navigation

## 📝 License

MIT
