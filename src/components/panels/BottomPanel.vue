<!-- This is the component for the bottom panel, set the height in the leaflet plugin -->
<style lang="sass">



</style>

<template>

  <div v-for="" id="bottom-panel">

    <div></div>

    <feature-card> // show if map zoom is close (12-20) on feature click
    </feature-card>

    <feature-summary-card> // show if map zoom is far (6-13) on feature click
    </feature-summary-card>

  </div>

</template>

<script>

var BottomPanel = L.control.bar('bottom-panel',{
    position:'bottom',
    visible:true
});
map.addControl(BottomPanel);

var BottomPanelView = Vue.extend({
  el: 'bottom-panel-view',
  data: {},
  components: {}
})

Vue.component('bottom-panel-view', BottomPanelView)


</script>
