const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['dist/*', '.expo/*'],
  },
  {
    rules: {
      // styled-components/native's default export shares a name with one of
      // its own named exports; every `import styled from ...` trips this.
      'import/no-named-as-default': 'off',
    },
  },
];
