module.exports = {
  ignore: ['node_modules'],
  presets: [
    [
      '@babel/preset-env',
      { targets: 'defaults, not ie <= 11, not ie_mob <= 11, node >= 14' },
    ],
    '@babel/preset-typescript',
  ],
};
