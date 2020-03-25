module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "serviceworker": true
  },

  "extends": [
    "plugin:vue/essential",
    "eslint:recommended",
    // '@vue/standard'
  ],

  "parserOptions": {
    "parser": "babel-eslint",
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2019,
    "impliedStrict": true,
    "sourceType": "module"
  },

  "rules": {
    "no-undef": 0,
    "no-control-regex": 1,
    "no-unused-vars": ["error", {
      "vars": "all",
      "args": "none",
      "ignoreRestSiblings": true
    }],
    "sort-vars": 0,
    // "one-var": 1,
    "no-eval": 1,
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "indent": [0, 2],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [0, "single"],
    "semi": [
      "error",
      "always"
    ],
    "space-before-function-paren": ["error", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "never"
    }],
  },

  "plugins": [
    "vue"
  ]
};
