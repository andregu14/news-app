module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|@react-native-community|@react-navigation|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@unimodules/.*|unimodules|sentry-expo|native-base|moti|moti/skeleton|expo-image|react-native-reanimated|react-redux)"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/android/",
    "/ios/"
  ],
};