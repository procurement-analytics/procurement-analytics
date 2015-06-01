# Procurement Dashboards

Procurement Dashboards

## Development environment
To set up the development environment for this website, you'll need to install the following on your system:

- [Node and npm](http://nodejs.org/)
- Gulp ( $ npm install -g gulp )

After these basic requirements are met, run the following commands in the website's folder:
```
$ npm install
```

### Getting started

Source code goes in `app` and after building it will be copied to `dist`.

```
$ gulp
```
Compiles the compass files, javascript, and launches the server making the site available at `http://localhost:3000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

### Other commands
Compile the compass files, javascript. Use this instead of ```gulp``` if you don't want to watch.
```
$ gulp build
```

The same as `gulp` but without livereloading the website.
```
$ gulp no-reload
```
