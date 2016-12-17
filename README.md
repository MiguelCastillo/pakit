# pakit
really opinionated and flexible JS bundler

pakit provides a very specific set of tools and configurations to remove the need for customizations for a great out of the box experience. Just give pakit the file(s) you want paked up, and you get the minified output with sourcemaps.

# usage

## install

```
$ npm install -g pakit
```

## cli

```
$ pakit src/file-1.js src/file-2.js
```

By default pakit will write `dist/out.js` and `dist/out.js.map`. But you can change the output

```
$ pakit src/file-1.js src/file-2.js --out dist/bundle.js
```

And perhaps you are also want file watching

```
$ pakit src/file-1.js src/file-2.js --out dist/bundle.js --watch
```


# stack and features

- [eslint](http://eslint.org/) to lint your code when it is being paked. Supports `.eslintrc.json` config files.
- [babel](https://babeljs.io/) to transform your JavaScript files. Supports `.babelrc` config files. Please do use this to extend your setup.
- [uglify](https://github.com/mishoo/UglifyJS2) to minify your paked files.
- It will handle dependencies defined with CJS require and ES2015 import statements.
- It will handle JSON and CSS assets.
- It will handle *most* node builtin modules.
- It will handle bundle splitting.
- It will do file watching.
- Configurable via `.bundlerrc.json`.


# optin dependencies

You do not need to install any dependencies in your project for `pakit` to work. Meaning, you do not need to install/maintain `babel` or `eslint` unless you really want to. `pakit` accomplishes it this by first trying to use dependencies from your project. And if those dependencies aren't found, then `pakit` will use its own dependencies. This provides an *optin* system for managing your own setup if you wanted more control of the situation.


# .bundlerrc.json

The default setup is defined in this [.bundlerrc.json](https://github.com/MiguelCastillo/pakit/blob/master/.bundlerrc.json). You are free to create your own in your project to customize your experience. You probably won't have to change much with the exception of perhaps specifying `shards` options, which is how bundle splitting is activated.

> configurations are mixed in with default settings so that you can override whatever defaults you need.

## shards

This is a sample configuration where pakit will split out all your vendor files into `dist/vendor.js` file.

``` javascript
{
  "shards": {
    "dist/vendor.js": { "match": { "path": "/node_modules/" } }
  }
}
```

You can match other things like module names or even source content.

> All matchers are internally converted to regular expressions with the exception of `extensions`, which is processed as a string.


# TODO

- Auto splitting when detecting `System.import()` or `import()` methods, which are targeted for dynamic module loading.
