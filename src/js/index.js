// Load base components
import Vue from 'vue'
import App from './components/App.vue'
import Sidebar from './components/Sidebar.vue'
import Main from './components/Main.vue'

// Load account components
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

// Import other vue components
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.use(VueRouter)

export var router = new VueRouter()

// Set up routing
router.map({
  'Sidebar': {
    component: Sidebar,
    subRoutes: {

      '/Main': {
        component: Main,
            subRoutes: {
              '/UserInfo': {
                component: UserInfo,
              },
              '/Login': {
                component: Login,
              },
              '/UserInfo': {
                component: UserInfo,
              },
              '/Register': {
                component: Register,
              },
              '/ProjectInfo': {
                component: UserInfo,
              },
            }
      },

      '/FormBase': {
        component: FormBase,
            subRoutes: {
              '/FormUpload': {
                component: FormUpload,
              },
              '/FormSocial': {
                component: FormSocial,
              }
            }
      },

      '/CreateFeature': {
        component: CreateFeature,
          subRoutes: {
            '/CreateCleaning': {
              component: CreateCleaning,
            },
            '/CreateGarbage': {
              component: CreateGarbage,
            },
            '/CreateTile': {
              component: CreateTile,
            },
            '/CreateLive': {
              component: CreateLive,
            },
            '/CreatePolyline': {
              component: CreatePolyline,
            },
            '/CreatePolygon': {
              component: CreatePolygon,
            }
          }
      },

      '/FeatureInfo': {
        component: FeatureInfo,
            subRoutes: {
              '/FeatureData': {
                component: FeatureData,
              },
              '/FeatureMedia': {
                component: FeatureMedia,
              },
              '/FeatureFile': {
                component: FeatureFile,
              }
            }
        },
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
})

// Redirect to the main menu by default
router.redirect({
  '*': '/Main'
})

// Target div
router.start(App, '#app')
