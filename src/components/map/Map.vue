<!-- This is the component for the map, styles are at the bottom -->
<template>

  <div id="map"></div>

  <map-toolbars></map-toolbars>

</template>

<script>

var MapToolbars = require('./MapToolbars.vue')

var MapView = Vue.extend({
  el: '#map',
  data: {},
  props: {},
})

Vue.component('map-view', MapView)

</script>

</style>
