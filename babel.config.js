module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        cwd: 'babelrc',
        extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
        alias: {
          '@root': './src',
          '@redux': './src/redux',
          '@components': './src/components',
          '@utils': './src/utils',
          '@global': './src/global',
          '@routes': './src/routes',
          '@assets': './src/assets',
          '@views': './src/views',
        },
      },
    ],
    'jest-hoist',
  ],
};
