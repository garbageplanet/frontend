# README #

### What is this repository for? ###
Repository for the [garbagepla.net](http://www.garbagepla.net) frontend. This responsive layout adds a top bar for navigation and a bottom bar for displaying map feature data.

### How to get started? ###
Just open /html/index.html in your browser. If you want to build for distribution install gulp with the dependencies (sorry, no package.json yet) go to the root dir and type `gulp`.

### Contributing
When adding a new js function to the code, add a comment about what it does. Build with gulp to test. If you want to cnotribute to a specific todo below, the first thing you should do is open an issue and you'll be assigned to the issue.

### TODO

#### Bottom panel
- [ ] push data to the bottom bar dynamically with `getData()`, in `ui.js`
- [ ] only allow horizontal scroll in bottom bar

### Mobile
- [ ] fix close layers control button reloads page bug
- [ ] hide navigation bar
- [ ] bug detecting mobile browsers (bug fixed in Leaflet 1.0)

### Side panel
- [ ] fix differing line height between form elements
- [ ] fix the tagsinput field resizing
- [ ] prevent form submit on `tagsinput` addition with enter key
- [ ] image upload restriction if user is not logged in

#### Map actions
- [ ] make the map add new markers instead of reloading everything in the current view when map moves

### General coding
- [ ] templating with [JavaScript Templates](https://github.com/blueimp/JavaScript-Templates);
- [ ] move to Leaflet 1.0, make custom build and upgrade plugins (almost everything works out of the box)
- [ ] move to bootstrap 4 and make custom build with [cards](http://v4-alpha.getbootstrap.com/components/card)

#### Future prospects
- [ ] localized calendar, tag cloud and gallery in the bottom bar

Current issues for this branch [issues](https://github.com/garbageplanet/web-ui/labels/branch%3Abottom-bar).

#### Licence
This code is available under the MIT licence but some parts have a different copyright information, see [this file](https://github.com/garbageplanet/web-ui/blob/dev/license.md).
