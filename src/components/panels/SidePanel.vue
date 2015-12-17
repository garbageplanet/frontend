<!-- This is the component for the side panel, set the width in the leaflet plugin -->
<style lang="sass">


</style>

<template>

  <div id="side-panel">

    <div class="back-link">
      <span class="fa fa-fw fa-grey fa-chevron-circle-left pull-left"></span>
    </div>

    <form-base v-if=""> // show the form if a marker if the click originates from the CreaeFeature dialog or an 'edit-link'
    </form-base>

    <create-feature v-if=""> // show the CreateFeature dialog if the click originates from the map
    </create-feature>

  <div>

</template>

<script>

var SidePanel = L.control.sidebar('side-panel', {
        position: 'right',
        closebutton: 'false',
        });
map.addControl(SidePanel);

var FormBase = require('../../components/forms/FormBase.vue')
var CreateFeature = require('../../components/forms/CreateFeature.vue')

var SidePanelView = Vue.extend({
  el: '#side-panel',
})

Vue.component('side-panel-view', SidePanelView)


</script>
