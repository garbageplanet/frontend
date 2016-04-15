# README #

### What is this repository for? ###
Repository for the [garbagepla.net](http://www.garbagepla.net) frontend v.0.1. This responsive layout adds a top bar for navigation and a bottom bar for displaying map feature data.

### How to get started? ###
Just open /html/index.html in your browser. If you want to build for distribution just run `npm i` to install gulp and dependencies in the root directory and type `gulp`.

### Contributing
When adding a new function to the code, add a comment about what it does. Build with gulp and open `index.html` from the `/dist` folder to check if there's any error. If you want to contribute to a specific todo below, the first thing you should do is open an issue and you'll be assigned to the issue.

### TODO
- [ ] fill in all feature data in bottom panel
- [ ] fix bootstrap form validation - disallow submit button until ok (not only add class `disabled`)
- [ ] load features into layer but do not re-create each layer after each element is added (get_features.js) 
- [ ] create radial css menu for mobile marker creation
- [ ] build the search widget in sidebar for mobile and in the top panel on desktop.

#### Feature actions
- [ ] finalize the edit system (build the feature creation forms from templates)
- [ ] build the cleaned, join, play and confirm functions with a prototype
- [ ] modal to see/export/save area data
- [ ] navigate between markers from bottom panel by listing markers in [current view](http://turbo87.github.io/leaflet-sidebar/examples/listing-markers.html)

#### Upgrade
- [ ] move to Leaflet 1.0, make custom build and upgrade plugins (almost everything works out of the box)
- [ ] move to bootstrap 4 and make custom build with [cards](http://v4-alpha.getbootstrap.com/components/card)
- [ ] offline mode with [simpleStorage](https://github.com/andris9/simpleStorage) and [L.Offline](https://github.com/allartk/leaflet.offline)

### Bugs

#### Mobile: Chrome on Android
- [ ] tags cannot be created by pressing space on soft keyboard, this is a ['feature'](https://bugs.chromium.org/p/chromium/issues/detail?id=118639) on Chrome Android, currently solved in unstable version of Chrome (March 2016). 

#### Mobile: Edge on Windows Phone
- [ ] weird map panning behavior when creating markers

### Bugs and suggestions
Current issues for this branch [issues](https://github.com/garbageplanet/web-ui/labels/branch%3Abottom-bar).

### Licence
This code is available under the ISC licence but some parts have a different license information, see [this file](https://github.com/garbageplanet/web-ui/blob/dev/license.md).