# README #

### What is this repository for? ###

Repository for the garbagepla.net UI. This responsive layout adds a top bar for navigation and a bottom bar for displaying map feature data.

### How to get started? ###

Just open /html/index.html in your browser.

### Contributing

We don't have a build process yet, so for the moment, if you add a new feature/function, you need to manually check that it doesn't break the user interface's main functions (check the console). When adding a new js function to the code, add a comment about what it does.

If you want to work on a specific todo below, the first thing you should do is open an issue and repo owners will add you as collaborator and assign you to the issue.

### TODO

### Side panel

- [ ] fix differing line height between form elements (`<input>`, `<textarea>`, `.tagsinput`, etc)
- [ ] fix the tagsinput input resizing

#### Bottom panel
- [ ] any media displayed in the bottom panel should take the width of its parent `<div>`
- [ ] implement templates for the contents of the bottom panel
- [ ] vertical scroll inside each column that is independant of other columns scroll

#### Map actions
- [ ] changes event listeners for features to use `onEachFeature()`
- [ ] make the cleaning api routes
- [ ] make shapes api routes
- [ ] implement editing system for map features
- [ ] make the map add new markers instead of reloading everything in the current view when map moves
- [ ] separate click events for draw features that are just created and those thata are saved
- [ ] fix cancel drawing on Esc key

### General coding, coding style, code review
- [ ] do the file upload with html5 only
- [ ] [fullscreen](http://www.html5rocks.com/en/mobile/fullscreen/) mobile view
- [ ] make the code overall less redundant (loading forms elements and building lists for `<select>` )
- [ ] implement templating for i18n

#### Making the code more maintainable
- [ ] create build script with minification (closure compiler) for deployment
- [ ] implement .getScript() for lazy loading scripts that are not required globally
- [ ] implement html templates/imports for the sidebar to be able to reuse the tabs layout

#### Future prospects
- [ ] allow users to upload geotagged images, bypassing marker creation form
- [ ] implement bootstrap v4
- [ ] implement [cards](http://v4-alpha.getbootstrap.com/components/card/) in the bottom panel
- [ ] localized calendat, tag cloud and gallery in the bottom bar
- [ ] upload images to the garbageplanet [imgur.com](https://api.imgur.com/oauth2) account 

Current issues for this branch [issues](https://github.com/garbageplanet/web-ui/labels/branch%3Abottom-bar).

#### Licence
This code is available under the MIT licence but some parts have a different copyright information, see [this file](https://github.com/garbageplanet/web-ui/blob/bottom-bar/license.md).