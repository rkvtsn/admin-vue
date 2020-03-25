module.exports = {
  presets: [
    // '@vue/app',
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "targets": {
          "chrome": 59,
          "edge": 13,
          "firefox": 17
        }
      }
    ]

    // {
    //   "modules": 'commonjs',
    //   "loose": true,
    //   "targets": {
    //     "browsers": [
    //       "last 2 years"
    //     ]
    //   }
    // }
  ],
  "plugins": [
    "istanbul",
    "babel-plugin-root-import",
    "@babel/plugin-syntax-dynamic-import",
    "transform-es2015-template-literals",
    // [
    //   "module-resolver",
    //   {
    //     "root": ["./src"],
    //     "alias": {
    //       "vlib": "./src/js/components/nic",
    //       "vcore": "./core/src
    //     }
    //   }
    // ],
    // ["minify-mangle-names", { "keepClassName ": true }],
    ["@babel/plugin-transform-runtime", {
      "corejs": false,
      "helpers": true,
      "regenerator": true,
      "useESModules": true
    }],
    // ["@babel/plugin-transform-modules-commonjs", {
    //   "allowTopLevelThis": true,
    //   "loose": true,
    //   "strict": true,
    //   "noInterop": true
    // }],
    ["@babel/plugin-proposal-decorators", {"legacy": true}],
    ["@babel/plugin-proposal-class-properties", {"loose": true}],

    "transform-inline-environment-variables",
    "@babel/plugin-transform-parameters",
    "@babel/plugin-transform-exponentiation-operator",
    "syntax-trailing-function-commas",
    "syntax-async-functions",
    "@babel/plugin-transform-async-to-generator",
    "@babel/plugin-proposal-object-rest-spread",
    "transform-es2015-constants",
    "@babel/plugin-transform-block-scoping"
  ]
};
