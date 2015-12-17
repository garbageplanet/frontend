# web-ui
frontend code for the web interface. This ui uses [vue.js](http://vuejs.org/).

## Getting started
The below assumes you have node.js setup on your machine.
First install Webpack globally from command line:

```
sudo npm -g webpack
```


Change to your local repo folder, type:

```
npm install
```

This will install the dependencies found inside package.json.

Bundle the files with webpack by typing:

```
webpack
```

Then type:

```
npm run dev
```

And visit http://localhost:8080/ to see the elements served by Webpack.

## Todo
Wepack now bundles everything without errors bu the content is not served correctly yet.
