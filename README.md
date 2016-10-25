# README #

### What is this repository for?
Repository for the [garbagepla.net](https://www.garbagepla.net) frontend v. 0.2

### How to get started?
Just open /src/index.html in your browser. If you want to build for distribution just run `npm i` to install gulp and dependencies in the root directory and type `gulp`.

### Contributing
All contributions are welcome. If you want to contribute to a specific todo below, the first thing you should do is open an issue and you'll be assigned to the issue.

### FIXME
- [ ] bootstrap form validation - disallow submit button until ok (currently only add class `disabled` to submit button)
- [ ] load features into layer but do not re-create each layer after elements are added or removed, use [L.VirtualGrid](https://github.com/patrickarlt/leaflet-virtual-grid)?
- [ ] tags do not get saved to the db
- [ ] .getCenter() doesn't work on polyines and polygons in lealfet 0.7 (it does in 1.0rc1, but see below)

### TODO
- [ ] write event handlers for side, top and bottom bars instead of multiple single events listeners.
- [ ] build all sidebar views from templates
- [ ] finalize the edit system (build the forms from templates)
- [ ] allow drawing shapes on mobile but hide the sidebar on draw:start and show it on draw:created

#### Upgrade
- [ ] custom builds (Leaflet, Bootstrap, FontAwesome)
- [ ] move to leaflet 1.0 - works out of the box but fix `L.marker.menu.js` plugin first
- [ ] move to bootstrap 4 and make custom build with [cards](http://v4-alpha.getbootstrap.com/components/card)
- [ ] add L.Routing.Machine plugin and build routing system between selected markers

### Licence
This code is available under the ISC licence but some parts have a different license information, see [this file](https://github.com/garbageplanet/web-ui/blob/dev/license.md).