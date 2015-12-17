<!-- src/components/App.vue

This is the main canvas for the map and the top, bottom and side panels.

-->

<style lang="sass">

</style>

<template>

  <top-panel-view>
  </top-panel-view>

  <side-panel-view>
  </side-panel-view>

  <bottom-panel-view>
  </bottom-panel-view>

  <map-view>
  </map-view>

</template>

<script>

var TopPanel = require('components/panels/TopPanel.vue')
var SidePanel = require('components/panels/SidePanel.vue')
var BottomPanel = require('components/panels/BottomPanel.vue')
var Map = require('components/map/Map.vue')

var App = new Vue({
  el: 'app'
})

Vue.component('app', App)

export default {
  components: {
    TopPanel,
    SidePanel,
    BottomPanel,
    Map
  }
}

</script>
