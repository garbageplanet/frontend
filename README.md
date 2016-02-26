# README #

### What is this repository for? ###
Repository for the [garbagepla.net](http://www.garbagepla.net) frontend. This responsive layout adds a top bar for navigation and a bottom bar for displaying map feature data.

### How to get started? ###
Just open /html/index.html in your browser. If you want to build for distribution install gulp with the dependencies (sorry, no package.json yet) go to the root dir and type `gulp`.

### Contributing
When adding a new js function to the code, add a comment about what it does. Build with gulp and open `index.html` from the `/dist` folder to check if there's any error. If you want to contribute to a specific todo below, the first thing you should do is open an issue and you'll be assigned to the issue.

### TODO

### Mobile
- [ ] fix alerts formatting and timing (bug?)
- [ ] fix datetime picker display (better mobile UI support is coming in [V5](https://github.com/Eonasdan/bootstrap-datetimepicker/issues/841))

#### Map actions
- [ ] make the map add new markers instead of reloading everything in the current view when map moves. Either check if any new db element was added to a nearby location after the last load or check with `contains()` [see this link](http://leafletjs.com/reference.html#latlngbounds-contains).

### General coding
- [ ] replace all instances of `find()` with direct selectors
- [ ] templating with [JavaScript Templates](https://github.com/blueimp/JavaScript-Templates)
- [ ] move to Leaflet 1.0, make custom build and upgrade plugins (almost everything works out of the box)
- [ ] move to bootstrap 4 and make custom build with [cards](http://v4-alpha.getbootstrap.com/components/card)

#### Future prospects
- [ ] localized calendar, tag cloud and gallery in the bottom bar, L.PruneCluster

Current issues for this branch [issues](https://github.com/garbageplanet/web-ui/labels/branch%3Abottom-bar).

#### Licence
This code is available under a slightly modified ISC licence but some parts have a different copyright information, see [this file](https://github.com/garbageplanet/web-ui/blob/dev/license.md).
