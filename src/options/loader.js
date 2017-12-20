const path = require("path");
const glob = require("glob");

function buildEslintOptions() {
  var eslintConfig = {
    "parserOptions": {
      "sourceType": "module"
    },
    "env": {
      "browser": true,
      "commonjs": true
    },
    "rules": {
      "curly": 2,
      "no-console": 2,
      "no-debugger": 2,
      "no-alert": 2,
      "no-use-before-define": 0,
      "no-underscore-dangle": 0,
      "no-multi-spaces": 0,
      "no-unused-vars": 1,
      "semi": 0,
      "global-strict": 0,
      "wrap-iife": [2, "inside"],
      "quotes": [1, "double", { "allowTemplateLiterals": true }],
      "key-spacing": 0,
      "no-trailing-spaces": 0,
      "eol-last": 2
    }
  };

  try {
    if (glob.sync(path.join(process.cwd(), ".eslintrc*(.js|.json|.yml)")).length) {
      eslintConfig = {};
    }
  }
  catch(ex) {
    if (ex.code !== "MODULE_NOT_FOUND") {
      throw ex;
    }
  }

  return eslintConfig;
}

function buildDefaultOptions() {
  return {
    "babel": {
      options: {
        presets: [], sourceMaps: "inline"
      }
    },
    "eslint": {
      options: Object.assign({
        cwd: process.cwd()
      }, buildEslintOptions())
    }
  };
}

module.exports = buildDefaultOptions;
