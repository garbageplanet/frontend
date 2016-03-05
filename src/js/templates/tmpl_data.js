/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
/* Javascript Templates HOWTO
   Use this file to create the objects that will contain the
   data used to fill the templates and create the templates 
   each in their own *.html file with 
   <script type="text/x-tmpl" id="template-id"></script> tags
   Once both the data and the temlates are ready, build
   the templates with tmpl.js and node.js by calling
   all the template html files from command line
   tmpl.js template_a.html template_b.html > tmpl.min.js
   For each template / file combination, add
   document.getElementById('element to fill').innerHTML = tmpl("template-id", data);
   or call tmpl() with dynamic data inside another 
   function in the same way as above add tmpl.min.js after 
   template.js in the body of your main html file. */



var templatedata = {
  "social" : {
      "network": [
          {
            "iconclass": "fa-facebook" ,
            "btnclass": "btn-facebook",
            "title": "Share on Facebook",
            "targeturl": ""
          },
          {
            "iconclass": "fa-twitter",
            "btnclass": "btn-twitter",
            "title": "Share on Twitter",
            "targeturl": ""
          },
          {
            "iconclass": "fa-google-plus",
            "btnclass": "btn-google-plus",
            "title": "Share on Google+",
            "targeturl": ""
          },
          {
            "iconclass": "fa-reddit fa-lg fa-icon-centered",
            "btnclass": "btn-reddit",
            "title": "Share on Reddit",
            "targeturl": ""
          },
          {
            "iconclass": "fa-tumblr",
            "btnclass": "btn-tumblr",
            "title": "Share on Tumblr",
            "targeturl": ""
          },
          {
            "iconclass": "fa-vk fa-icon-centered",
            "btnclass": "btn-vk",
            "title": "Share on V-Kontakti",
            "targeturl": ""
          },
          {
            "iconclass": "fa-whatsapp fa-lg fa-icon-centered",
            "btnclass": "btn-whatsapp",
            "title": "Share on Whatsapp",
            "targeturl": ""
          }
    ]
},
  "credits" : [
       {
            "title":"Mapbox",
            "linkurl":"https://www.mapbox.com/",
            "text":"Basemaps imagery ©"
      },
      {
            "title":"Openstreetmap and contributors",
            "linkurl":"http://www.openstreetmap.org/",
            "text":"Maps and underlying data ©"
      },
      {
            "title":"Overpass API",
            "linkurl":"http://www.overpass-api.de/",
            "text":"POIs retrieved using the"
      },
      {
            "title":"Leaflet",
            "linkurl":"http://leafletjs.com/",
            "text":"Mapping done with "
      },
      {
            "title":"FontAwesome",
            "linkurl":"http://fontawesome.io/",
            "text":"Icons by"
      },
      {
            "title":"Bootstrap 3",
            "linkurl":"http://getbootstrap.com/",
            "text":"Built with"
      },
       {
            "title":"JQuery",
            "linkurl":"https://jquery.com/",
            "text":"Runs on"
      },
      {
            "title":"Laravel 5.1",
            "linkurl":"https://laravel.com/",
            "text":"Backed by"
      },
      {
            "title":"JavaScript-Templates",
            "linkurl":"https://github.com/blueimp/JavaScript-Templates",
            "text":"Templating with"
      },
      {
            "title":"Github",
            "linkurl":"https://github.com/garbageplanet",
            "text":"Source code available on"
      }
  ]
};