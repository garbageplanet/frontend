# README #

### What is this repository for?
Repository for the [garbagepla.net](https://www.garbagepla.net) frontend v. 0.4

### How to get started?
Just open /src/index.html in your browser. If you want to build for distribution just run `npm i` to install gulp and dependencies in the root directory and type `gulp`.
To rebuild or new templates you need to install javascript-template `npm i blueimp-tmpl` then change directory to `/src/js/templates` and run the command found at the bottom of the file `tmpl_howto.html` in the same folder.

### Contributing
All contributions are welcome. If you want to contribute to a specific todo below, the first thing you should do is open an issue and you'll be assigned to the issue.

### FIXME
- [ ] taginputs reset deletes placeholder

### TODO
- [ ] geotagged photo capability
- [ ] reverse geocode address for cleanings
- [ ] add geographical location to html scraping
- [ ] rewrite bottombar css rules from ground up for portrait/panorama oritentation on mobile
- [ ] make the edit system
- [ ] allow drawing shapes on mobile but hide the sidebar on draw:start and show it on draw:created

#### Upgrade
- [ ] custom builds (Bootstrap, FontAwesome, Leaflet, jQuery)

### Licence
This code is available under the ISC licence but some parts have a different license information, see [this file](https://github.com/garbageplanet/web-ui/blob/dev/license.md).