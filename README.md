# README #

### What is this repository for? ###

Repository for the garbagepla.net UI. This responsive layout adds a top bar for navigation and a bottom bar for displaying map feature data.

### How to get started? ###

Just open /html/index.html in your browser.

### Contributing

We don't have a build process yet, so for the moment, if you add a new feature/function, you need to manually check that it doesn't break the user interface's main functions (check the console). When adding a new js function to the code, add a comment about what it does.

If you want to work on a specific todo below, the first thing you should do is open an issue and repo owners will add you as collaborator and assign you to the issue.

### TODO

### General coding, coding style, code review
- [ ] make the code overall less redundant
- [ ] implement templating for i18n
- [ ] transfer any inline css styling to external stylesheet
- [ ] split main.css into components-specific files

#### Making the code more maintainable
- [ ] create build script with minification (closure compiler) for deployment
- [ ] better structure/split script files
- [ ] implement .getScript() for lazy loading scripts that are not required globally
- [ ] implement html templates/imports for the sidebar to be able to reuse the tabs layout and save/cancel buttons

#### Bottom panel
- [ ] any media displayed in the bottom panel should take the width of its parent `<div>`
- [x] fetch thumbnails from imgur instead of raw images
- [x] make dropdown menu display their content
- [ ] implement templates for the contents of the bottom panel
- [ ] vertical scroll inside each column that is independant of other columns scroll
- [ ] set (orientation:portrait) rules

#### Map actions
- [ ] implement editing system for map features
- [ ] implement leaflet.draw and leaflet.measurables for polyline and polygons
- [x] clicking the `map` if any panel is open should close that panel
- [x] fix the `.panTo()` behavior when the bottom panel is open and another marker is clicked on the map.
- [x] add `L.Draggable()` to `generic-marker` when side panel is open 

#### Future prospects
- [ ] allow users to upload geotagged images, bypassing marejr creation form
- [ ] implement bootstrap v4
- [ ] implement [cards](http://v4-alpha.getbootstrap.com/components/card/) in the bottom panel
- [ ] implement calendar view in the bottom panel with [bootstrap-calendar](https://github.com/Serhioromano/bootstrap-calendar)
- [ ] implement a localized tag cloud view in the bottom bar
- [ ] implement a localized gallery view in the bottom bar
- [ ] upload images to the garbageplanet [imgur.com](https://api.imgur.com/oauth2) account 
- [ ] upload videos to the garbageplanet [youtube.com](https://developers.google.com/youtube/v3/docs/videos/insert) channel

Current issues for this branch [issues](https://github.com/garbageplanet/web-ui/labels/branch%3Abottom-bar).