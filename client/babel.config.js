module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic', importSource: 'preact' }],
  ],
  plugins: [['babel-plugin-graphql-tag', { strip: true }]],
}
