# README #

### What is this repository for? ###
Repository for the [garbagepla.net](http://www.garbagepla.net) frontend. This responsive layout adds a top bar for navigation and a bottom bar for displaying map feature data.

### How to get started? ###
Just open /html/index.html in your browser. If you want to build for distribution just run `npm i` to install gulp and dependencies in the root directory and type `gulp`.

### Contributing
When adding a new js function to the code, add a comment about what it does. Build with gulp and open `index.html` from the `/dist` folder to check if there's any error. If you want to contribute to a specific todo below, the first thing you should do is open an issue and you'll be assigned to the issue.

### Note (March 4th 2016)
The build system doesn't currently include the new templating code so the final build won't have all html elements.

### Feature actions

- [ ] finalize the edit system (build the feature creation forms from templates)
- [ ] build the cleaned, join, play and confirm function with a prototype

### TODO
- [ ] move to Leaflet 1.0, make custom build and upgrade plugins (almost everything works out of the box)
- [ ] move to bootstrap 4 and make custom build with [cards](http://v4-alpha.getbootstrap.com/components/card)
- [ ] offline mode with [simpleStorage](https://github.com/andris9/simpleStorage)

#### Map actions
- [ ] make the map add new markers instead of reloading everything in the current view when map moves. Either check if any new db element was added to a nearby location after the last load or check with `contains()` [see this link](http://leafletjs.com/reference.html#latlngbounds-contains).

#### Future prospects
- [ ] localized calendar, tag cloud and gallery in the bottom bar, group markers with [L.PruneCluster](https://github.com/SINTEF-9012/PruneCluster)

Current issues for this branch [issues](https://github.com/garbageplanet/web-ui/labels/branch%3Abottom-bar).

#### Licence
This code is available under the ISC licence but some parts have a different copyright information, see [this file](https://github.com/garbageplanet/web-ui/blob/dev/license.md).
