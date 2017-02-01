# pakit

really opinionated and flexible JS bundler

pakit provides a very specific set of tools and *default* configurations for a great out of the box experience. Just give pakit the file(s) you want paked up, and you get linting, bundling, and minification with sourcemaps without much setup.

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

An important feature is being as unobtrusive as possible. You configure eslint and babel through their corresponding rc files instead of configuring pakit's config file. This allows you to introduce pakit into your ecosystem without needing to migrate or rig configurations to work with pakit. If you decide that you don't like pakit, you get to keep your configurations.

- [eslint](http://eslint.org/) to lint your code when it is being paked. Supports `.eslintrc.json` config files.
- [babel](https://babeljs.io/) to transform your JavaScript files. Supports `.babelrc` config files.
- [uglify](https://github.com/mishoo/UglifyJS2) to minify your paked files.
- pakit is configurable via `.bundlerrc.json`.
- pakit will handle
  - dependencies defined with CJS require and ES2015 import statements.
  - JSON and CSS assets.
  - *most* node builtin modules.
  - bundle splitting.
  - file watching.
  - caching to maximize startup times.


# dependencies

You do not need to install any dependencies in your project for `pakit` to work. Meaning, you do not need to install/maintain `babel` or `eslint` unless you really want to. `pakit` accomplishes this by first trying to use dependencies from your project. Any dependencies that aren't found in your project `pakit` will subtitute with its own. This creates an *opt-in* system if you want to take more granular control of the situation by simply installing in your project the dependencies you want to manage.


# .bundlerrc.json

The default setup is defined in this [.bundlerrc.json](https://github.com/MiguelCastillo/pakit/blob/master/.bundlerrc.json). You are free to create your own in your project to customize your experience. You probably won't have to change much with the exception of perhaps specifying `shards` options, which is how bundle splitting is activated.

> configurations are mixed in with default settings so that you can override whatever defaults you need.

## shards

This is bundle splitting in which every chunk that is split out is called a shard.

Below is a sample configuration where pakit will split all modules with `/node_modules/` in its path out into a shard file `dist/vendor.js`. Effectively splitting out all vendor (3rd party) dependencies into its own bundle file.

``` javascript
{
  "shards": {
    "dist/vendor.js": ["/node_modules/"]
  }
}
```

Bundle splitting is fundamentally based on pattern matching. Meaning that you can build matching rules that determine how bundles are split up. The example below splits out modules that match the names "jquery" and "react".

``` javascript
{
  "shards": {
    "dist/requery.js": {
      "match": {
        "name": ["jquery", "react"]
      }
    }
  }
}
```

Matching rules can match anything in a Module instance, including the `source`.

> All matchers are internally converted to regular expressions with the exception of `extensions`, which are processed as a string.


## umd

When bundles are written for the browser, please use `umd` for better compatibility among module systems. This will ensure that the bundle exposes the main modules as AMD, CJS, or plain ole global depdending on the module system that is available.

```
{
  "umd": "myModuleName"
}
```


## babel presets and plugins

While pakit wires in `babel`, it is not configured with any presets or plugins. So in order to configure transpilation for ES2015, React, or any other feature, you will need to configure a `.babelrc` file in your project and manage your own `babel` preset and plugin dependencies.

### Quick guide:

#### install dependencies for ES2015 and React

```
$ npm install babel-preset-es2015 babel-preset-react --save-dev
```


#### configure a `.babelrc` in your project

```
{
  "presets": ["es2015", "react"]
}
```
