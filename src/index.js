// Load base components
var Vue = require('../node_modules/vue')
var App = require('./components/App.vue')
var BottomPanel = require('./components/panels/BottomPanel.vue')
var SidePanel = require('./components/panels/SidePanel.vue')
var TopPanel = require('./components/panels/TopPanel.vue')
var Map = require('./components/map/Map.vue')
var CreateFeature = require('./components/forms/CreateFeature.vue')

// Import other vue components
var VueRouter = require('../node_modules/vue-router')
var VueResource = require('../node_modules/vue-resource')
// var VueStrap = require( '../node_modules/vue-strap')
// var VueDateTime = require( '../node_modules/vue-datetime-picker')
// var VueValidator = require( '../node_modules/vue-validator')
// var Vuei18n = require( '../../node_modules/vue-i18-plugin')

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(VueAlert)
Vue.use(VueDateTime)
Vue.use(VueValidator)
Vue.use(Vuei18n)

var router = new VueRouter()

// Set up routing
router.map({
    '/panels/top-panel': {
        component: TopPanel,
            subRoutes: {

                'menu': {
                    component: Menu,
                        subRoutes: {

                        'map-tools': {
                        component: MapTools,
                        },

                        'search-tools': {
                        component: SearchView,
                        },

                        'user-tools': {
                        component: UserTools,
                        }
                    }
                },

                '/Title': {
                component: Title,
                }
        }
    },

  'side-panel': {
    component: SidePanel,
    subRoutes: { }
  },

  'bottom-panel': {
    component: BottomPanel,
    subRoutes: { }
  },

  'map': {
    component: Map,
  }
})

// Redirect to the main menu by default
router.redirect({
  '*': '/Map'
})

// Target div
router.start(App, 'body')
