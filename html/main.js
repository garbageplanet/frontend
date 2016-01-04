/*window.addEventListener('HTMLImportsLoaded', function (e) {
    "use strict";

    var links,
        i,
        content;

    links = document.querySelectorAll('link[rel="import"]');

    for (i = 0; i < links.length; i += 1) {
        content = links[i].import;
        alert(content);
    }
}); */

// Import html templates for UI elements
var uiLinks = document.querySelectorAll("#maplink, #toplink, #sidelink, #bottomlink");
// var uiLinks = document.querySelector(".main-content");


    var content = uiLinks.import;

    // Grab DOM from warning.html's document.
    var el = content.querySelector('template');

    document.body.appendChild(el.cloneNode(true));



// Clone the <template> in the import.
// var template = uiLinks.import.querySelectorAll('template');
// var clone = document.importNode(template.content, true);

// document.body.appendChild(clone);