/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(4);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// Load base components
	var Vue = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../node_modules/vue\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var App = __webpack_require__(5);
	var Sidebar = __webpack_require__(7);
	var Main = __webpack_require__(8);

	// Load account components
	/*
	import Register from './components/Register.vue'
	import Login from './components/Login.vue'
	import UserInfo from './components/UserInfo.vue'
	import UserInfo from './components/ProjectInfo.vue'

	// Load map components
	import Map from './components/Map.vue'
	import MapToolbars from './components/MapToolbars.vue'

	// Load actions components
	import CreateFeature from './components/CreateFeature.vue'
	import CreateCleaning from './components/CreateCleaning.vue'
	import CreateGarbage from './components/CreateGarbage.vue'
	import CreatePolyline from './components/CreatePolyline.vue'
	import CreatePolygon from './components/CreatePolygon.vue'
	import CreateLive from './components/CreateLive.vue'
	import CreateTile from './components/CreateTile.vue'

	// Load forms and modules
	import FormBase from './components/FormBase.vue'
	import FormSocial from './components/FormSocial.vue'
	import FormUpload from './components/FormUpload.vue'

	//Load markers and features (tiles, polygon, polylines) info modules
	import FeatureInfo from './components/FeatureInfo.vue'
	import FeatureData from './components/FeatureData.vue'
	import FeatureMedia from './components/FeatureMedia.vue'
	import FeatureFile from './components/FeatureFile.vue'
	*/

	// Import other vue components
	var VueRouter = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../node_modules/vue-router\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var VueResource = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../node_modules/vue-resource\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	Vue.use(VueResource);
	Vue.use(VueRouter);

	var router = new VueRouter();

	// Set up routing
	router.map({
	  'Sidebar': {
	    component: Sidebar,
	    subRoutes: {

	      '/Main': {
	        component: Main,
	        subRoutes: {
	          '/UserInfo': {
	            component: UserInfo
	          },
	          '/Login': {
	            component: Login
	          },
	          '/UserInfo': {
	            component: UserInfo
	          },
	          '/Register': {
	            component: Register
	          },
	          '/ProjectInfo': {
	            component: UserInfo
	          }
	        }
	      },

	      '/FormBase': {
	        component: FormBase,
	        subRoutes: {
	          '/FormUpload': {
	            component: FormUpload
	          },
	          '/FormSocial': {
	            component: FormSocial
	          }
	        }
	      },

	      '/CreateFeature': {
	        component: CreateFeature,
	        subRoutes: {
	          '/CreateCleaning': {
	            component: CreateCleaning
	          },
	          '/CreateGarbage': {
	            component: CreateGarbage
	          },
	          '/CreateTile': {
	            component: CreateTile
	          },
	          '/CreateLive': {
	            component: CreateLive
	          },
	          '/CreatePolyline': {
	            component: CreatePolyline
	          },
	          '/CreatePolygon': {
	            component: CreatePolygon
	          }
	        }
	      },

	      '/FeatureInfo': {
	        component: FeatureInfo,
	        subRoutes: {
	          '/FeatureData': {
	            component: FeatureData
	          },
	          '/FeatureMedia': {
	            component: FeatureMedia
	          },
	          '/FeatureFile': {
	            component: FeatureFile
	          }
	        }
	      }
	    }
	  },

	  '/map': {
	    component: Map,
	    subRoutes: {
	      '/MapToolbars': {
	        component: MapToolbars
	      }
	    }
	  }
	});

	// Redirect to the main menu by default
	router.redirect({
	  '*': '/Main'
	});

	// Target div
	router.start(App, '#app');

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	;(typeof module.exports === "function" ? module.exports.options : module.exports).template = __webpack_require__(6)
	if (false) {
	(function () {
	var hotAPI = require("vue-hot-reload-api")
	hotAPI.install(require("vue"))
	if (!hotAPI.compatible) return
	var id = "-!vue-html-loader!./../../../node_modules/vue-loader/lib/selector.js?type=template&index=0!./App.vue"
	hotAPI.createRecord(id, module.exports)
	module.hot.accept(["-!vue-html-loader!./../../../node_modules/vue-loader/lib/selector.js?type=template&index=0!./App.vue"], function () {
	var newOptions = null
	if (newOptions && newOptions.__esModule) newOptions = newOptions.default
	var newTemplate = require("-!vue-html-loader!./../../../node_modules/vue-loader/lib/selector.js?type=template&index=0!./App.vue")
	hotAPI.update(id, newOptions, newTemplate)
	})
	})()
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = "<div id=\"map\">\n    <router-view></router-view>\n  </div>\n\n  <div id=\"sidebar\">\n    <div class=\"sidebar-container\">\n      <router-view></router-view>\n    </div>\n  </div>";

/***/ },
/* 7 */
/***/ function(module, exports) {

	

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"-!babel-loader?presets[]=es2015&plugins[]=transform-runtime!./../../../node_modules/vue-loader/lib/selector.js?type=script&index=0!./Main.vue\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	if (module.exports.__esModule) module.exports = module.exports.default
	;(typeof module.exports === "function" ? module.exports.options : module.exports).template = __webpack_require__(10)
	if (false) {
	(function () {
	var hotAPI = require("vue-hot-reload-api")
	hotAPI.install(require("vue"))
	if (!hotAPI.compatible) return
	var id = "-!babel-loader?presets[]=es2015&plugins[]=transform-runtime!./../../../node_modules/vue-loader/lib/selector.js?type=script&index=0!./Main.vue"
	hotAPI.createRecord(id, module.exports)
	module.hot.accept(["-!babel-loader?presets[]=es2015&plugins[]=transform-runtime!./../../../node_modules/vue-loader/lib/selector.js?type=script&index=0!./Main.vue","-!vue-html-loader!./../../../node_modules/vue-loader/lib/selector.js?type=template&index=0!./Main.vue"], function () {
	var newOptions = require("-!babel-loader?presets[]=es2015&plugins[]=transform-runtime!./../../../node_modules/vue-loader/lib/selector.js?type=script&index=0!./Main.vue")
	if (newOptions && newOptions.__esModule) newOptions = newOptions.default
	var newTemplate = require("-!vue-html-loader!./../../../node_modules/vue-loader/lib/selector.js?type=template&index=0!./Main.vue")
	hotAPI.update(id, newOptions, newTemplate)
	})
	})()
	}

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports) {

	module.exports = "<div class=\"sidebar-content\">\n    <h1>Garbagepla.net</h1>\n    <div class=\"container\">\n      <router-view></router-view>\n    </div>\n    <p>About this project</p>\n  </div>";

/***/ }
/******/ ]);