# README #

### What is this repository for?
Repository for the [garbagepla.net](https://www.garbagepla.net) frontend v. 0.1.

### How to get started?
Just open /src/index.html in your browser. If you want to build for distribution just run `npm i` to install gulp and dependencies in the root directory and type `gulp`.

### Contributing
All contributions are welcome. If you want to contribute to a specific todo below, the first thing you should do is open an issue and you'll be assigned to the issue.

### FIXME
- [ ] bootstrap form validation - disallow submit button until ok (not only add class `disabled` to submit button)
- [ ] load features into layer but do not re-create each layer after elements are added or removed (get_features.js) 
- [ ] mobile marker menu still a little buggy (stays open and cannot be deleted)

### TODO
- [ ] tags do not get saved to the db
- [ ] build all sidebar views from templates
- [ ] finalize the edit system (build the forms from templates)
- [ ] build the cleaned, join, play and confirm functions with a prototype
- [ ] allow drawing shapes but hide the sidebar on draw:start and show it on draw:created

#### Upgrade
- [ ] custom builds (Leaflet, Bootstrap, FontAwesome)
- [ ] move to leaflet 1.0 - works out of the box but fix `L.marker.menu.js` plugin menu first
- [ ] move to bootstrap 4 and make custom build with [cards](http://v4-alpha.getbootstrap.com/components/card)
- [ ] modularize js code

### Licence
This code is available under the ISC licence but some parts have a different license information, see [this file](https://github.com/garbageplanet/web-ui/blob/dev/license.md).