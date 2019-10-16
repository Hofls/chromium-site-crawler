module.exports = {
  env: {
    browser: true,
    es6: true,
    amd: true,
    mocha: true,
    node: true
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "no-console": "off",
    "no-debugger": "off"
  }
};
