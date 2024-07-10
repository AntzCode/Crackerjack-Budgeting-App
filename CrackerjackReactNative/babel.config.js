module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-paper/babel',
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ],
  env: {
    production: {
      presets: ["module:metro-react-native-babel-preset"],
      plugins: [
        'react-native-paper/babel',
        ["@babel/plugin-proposal-decorators", { "legacy": true }]
      ],
    },
  },
};
