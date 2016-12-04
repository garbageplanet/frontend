# README #

### What is this repository for?
Repository for the [garbagepla.net](https://www.garbagepla.net) frontend v. 0.3

### How to get started?
Just open /src/index.html in your browser. If you want to build for distribution just run `npm i` to install gulp and dependencies in the root directory and type `gulp`.

### Contributing
All contributions are welcome. If you want to contribute to a specific todo below, the first thing you should do is open an issue and you'll be assigned to the issue.

### FIXME
- [ ] remove unsaved marker icons once maker is saved
- [ ] fix marker creation when multiple unsaved marker are present on map
- [ ] bootstrap form validation - disallow submit button until ok (currently only add class `disabled` to submit button)
- [ ] make css rules for devices 768 - 960px and add rules for device height

### TODO
- [ ] cluster markers server side if there are over 500 in currentBounds and send as markerCluster marker
- [ ] build all sidebar views from templates and make the edit system
- [ ] allow drawing shapes on mobile but hide the sidebar on draw:start and show it on draw:created
- [ ] write game area function in social.js

#### Upgrade
- [ ] modularize?
- [ ] optimize loading (see google page speed results)
- [ ] move to bootstrap 4 and make custom build with [cards](http://v4-alpha.getbootstrap.com/components/card)
- [ ] custom builds (Bootstrap, FontAwesome,Leaflet, jQuery, or try tree-shake)

### Licence
This code is available under the ISC licence but some parts have a different license information, see [this file](https://github.com/garbageplanet/web-ui/blob/dev/license.md).