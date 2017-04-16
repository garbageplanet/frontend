# README #

### What is this repository for?
Repository for the [garbagepla.net](https://garbagepla.net) frontend v. 0.5.0

### How to get started?
Just open /src/index.html in your browser. If you want to build for distribution just run `npm i` to install gulp and dependencies in the root directory and type `gulp`.
To rebuild or new templates you need to install javascript-template `npm i blueimp-tmpl` then change directory to `/src/js/templates` and run the command found at the bottom of the file `tmpl_howto.html` in the same folder.
Note that as of V. 0.5.0, if you do not have your own token for mapbox and such you won't be able to build properly.

### Contributing
All contributions are welcome. If you want to contribute to a specific todo below, the first thing you should do is open an issue. If you have another contribution PRs are also welcome!

### FIXME
- [ ] taginputs reset deletes placeholder

### TODO
- [ ] add backend controllers and geographical location capability to html scraping
- [ ] serve Leaflet, jQuery, FontAwesome and Bootstrap via CDN
- [ ] geotagged photo capability
- [ ] upoad to imgur as user
- [ ] reverse geocode addresses for cleanings
- [ ] make the edit system
- [ ] put the licenses in the minified files
- [ ] documentation

### Licence
This code is available under the ISC licence but some parts have a different license information, see [this file](https://github.com/garbageplanet/web-ui/blob/dev/license.md).