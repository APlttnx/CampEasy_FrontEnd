module.exports = {
  root: true,
  env: {
    node: true,
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'linebreak-style': 0, 
    'comma-dangle': ['error', 'always-multiline'], //altijd komma achteraan, bij objecten en arrays
    'semi': ['error', 'always'], //altijd ; achteraan
    'operator-linebreak': 0, //opt: operators tellen als linebreak
  },
};
