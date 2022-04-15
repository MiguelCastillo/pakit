module.exports = {
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
    },
    "env": {
        "es6": true,
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
        "quotes": [1, "double", { "avoidEscape": true, "allowTemplateLiterals": true }],
        "key-spacing": 0,
        "no-trailing-spaces": 0,
        "eol-last": 2
      }
};
