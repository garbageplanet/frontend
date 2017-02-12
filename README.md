# README #

### What is this repository for?
Repository for the [garbagepla.net](https://www.garbagepla.net) frontend v. 0.3

### How to get started?
Just open /src/index.html in your browser. If you want to build for distribution just run `npm i` to install gulp and dependencies in the root directory and type `gulp`.

### Contributing
All contributions are welcome. If you want to contribute to a specific todo below, the first thing you should do is open an issue and you'll be assigned to the issue.

### FIXME
- [ ] remove unsaved marker icons once marker is saved
- [ ] fix marker creation when multiple unsaved marker are present on map
- [ ] bootstrap form validation - disallow submit button until ok (currently only adds class `disabled` to submit button)
- [ ] taginputs reset deletes placeholder

### TODO
- [ ] geotagged photo capability
- [ ] add geographical location to html scraping
- [ ] add licensing info to minified code
- [ ] rewrite bottombar css rule from ground up for portrait/panorama oritentation on mobile
- [ ] make the edit system and build forms from templates
- [ ] allow drawing shapes on mobile but hide the sidebar on draw:start and show it on draw:created

#### Upgrade
- [ ] custom builds (Bootstrap, FontAwesome, Leaflet, jQuery)

### Licence
This code is available under the ISC licence but some parts have a different license information, see [this file](https://github.com/garbageplanet/web-ui/blob/dev/license.md).