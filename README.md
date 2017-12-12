# README #

### What is this repository for?

Repository for the [garbagepla.net](https://garbagepla.net) frontend.

### How to get started?

Run `npm i` to install gulp and dependencies in the root directory and type `gulp` to compile templates and build the app. Note that if you do not have your own token for Mapbox and other external APIs you won't be able to build properly. Tokens are set in an `.env` file as follows:

```
IMGUR_TOKEN=<imgur api token>
MAPBOX_TOKEN=<Mapbox.com map tiles api token>
WINDOW_TOKEN=<laravel backend app token>
OC_TOKEN=<Opencage geocoder api token>
OG_TOKEN=<Opengraph scraper api token>
SERVER=<the url to the app backend, see the garbageplanet/api repo>
ROOT=<the root url of your app>
PRODUCTION=<boolean>
GA=<google analytics token (optional)>
```

### Contributing

If you want to contribute to a specific todo below, the first thing you should do is open an issue. If you have another contribution PRs are also welcome.

### FIXME

- [ ] ajax calls stack up really fast when map is moved. Change mechanism for loading up map features.
- [ ] fix backlinks in auth route

### TODO

- [ ] reduce redundancy in the form templates
- [ ] upload to imgur as user
- [ ] make edit system
- [ ] put the build on github and serve with jsdelivr JAM Stack-style
- [ ] build a minimal entry point for loading the content via cdn
- [ ] navigate visible markers in the bottom panel view with https://github.com/stefanocudini/leaflet-list-markers

### Licence

This code is available under the ISC licence but some parts have a different license information, see [this file](https://github.com/garbageplanet/web-ui/blob/dev/license.md).
