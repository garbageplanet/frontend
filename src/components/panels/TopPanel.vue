<!-- This is the component for the top panel, set the height in the leaflet plugin -->
<style lang="sass">


</style>

<template>

  <div id="top-panel" class="container">

    <div class="row">

      <div class="pull-left hidden-xs hidden-sm col-md-4 col-lg-4 col-xl-3">

        <div class="main-title"><a href="http://www.garbagepla.net" target="_blank">Garbagepla.net</a></div>

      </div>

      <div class"pull-right col-sm-12 col-md-6 col-lg-4 col-xl-3">

        <menu>
        </menu>

      </div>

    </div>

  </div>

</template>

<script>

var TopPanel = L.control.bar('top-panel',{
    position:'top',
    visible:true
});
map.addControl(TopPanel);

var Menu = require('../../components/menus/Menu.vue')

var TopPanelView = Vue.extend({
  el: '#top-panel',
  data: {},
  components: {
    'MenuView': menu-view,
    'TitleView': title-view,
  }
})

Vue.component('top-panel-view', TopPanelView)

</script>

</script>
