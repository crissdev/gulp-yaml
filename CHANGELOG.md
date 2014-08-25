# 0.1.0

## Features

- **gulp-yaml** upgrade js-yaml dependency to its last version available (3.2.1)


## Breaking changes

- **gulp-yaml** Because this plugin uses 
[js-yaml](https://github.com/nodeca/js-yaml) this version might add some breaking changes. Please 
check [js-yaml Breaking changes](https://github.com/nodeca/js-yaml#breaking-changes-in-2xx---3xx)
for potential issues and how to fix them.


# 0.0.3

## Features

- **gulp-yaml** add ```safe``` to the list of supported options. The default value is ```false``` 
  to maintain compatibility with previous versions. If you suspect to have untrusted YAML in your 
  project files, then turn this flag on.


# 0.0.2

## Features

- **README.md** add badges for ```npm version```, ```build status``` and ```dependency status```


# 0.0.1

## Features

- **gulp-yaml** add ```pretty``` to the list of supported options. If this flag is true then then
  resulting JSON will be pretty printed. The default value is ```false```.
