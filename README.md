# README #

### What is this repository for?

Repository for the [garbagepla.net](https://garbagepla.net) frontend.

### How to get started?

Run `npm i` to install gulp and dependencies in the root directory and type `gulp`. Note that if you do not have your own token for mapbox and other APIs you won't be able to build properly.

### Tokens and external APIs

These should be in an .env file in the root folder:

    IMGUR_TOKEN=*************
    MAPBOX_TOKEN=***************************************
    OPENCAGEGEOCODERC_TOKEN=*********
    OPENGRAPHSCRAPER_TOKEN=**************
    ...

### Contributing

If you want to contribute to a specific todo below, the first thing you should do is open an issue. If you have another contribution PRs are also welcome.

### TODO

- [ ] add backend controllers and geographical geocoding capability for webpage scraping (using the OG api, check again list of countries, then against list of most common words, excluding these not starting with a capital etc, then submit to reverse geocoding search and check for number of hits and work from there)
- [ ] add direct upload of geotagged photo
- [ ] upload to imgur as user
- [ ] make the edit system
- [ ] put the build on github and deliver with jsdelivr and inject dependencies with the fetch API / https://github.com/jhabdas/fetch-inject / JAM Stack-style
- [ ] build a minimal entry point for loading the content via cdn

### Additions

- [ ] navigate visible markers in the bottom panel view with https://github.com/stefanocudini/leaflet-list-markers

### Licence

This code is available under the ISC licence but some parts have a different license information, see [this file](https://github.com/garbageplanet/web-ui/blob/dev/license.md).
