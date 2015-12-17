<!-- This is the template component for the elements shared by all forms -->
<style lang ="sass">
/*
button,
input,
textarea
  .alert
  .btn,
  .btn-group>.btn:last-child,
  .btn-group> btn:first-child,
  .form-control,
  .input-group-addon
      border-radius: 0
*/
</style>

<template>

<div id="form-base" class="container">

  <h2 v-for"value in coordinates">You are creating near {{ $key }} {{ value }} {{  $key }} {{ value }}.</h2>

  <create-cleaning v-if="elements" is="{{ Cleaning }}">
  </create-cleaning>

  <create-garbage v-if="elements" is="{{ Garbage }}">
  </create-garbage>

  <create-live v-if="elements" is="{{ Live }}">
  </create-live>

  <create-tile v-if="elements" is="{{ Tile }}">
  </create-tile>

  <create-polyline v-if="elements" is="{{ Polyline }}">
  </create-polyline>

  <create-polygon v-if="elements" is="{{ Polygon }}">
  </create-polygon>

  <form-social>
  </form-social>

  <form-upload>
  </form-upload>

  <div class="btn-group btn-group-justified" role="group" >

      <div class="btn-group btn-group-lg btn-save btn-save" role="group">
          <button class="btn btn-success">
            <i class="fa fa-check fa-fw"></i><span class="hidden-xs">Save</span>
          </button>
      </div>

      <div class="btn-group btn-group-lg" role="group">
          <button class="btn btn-danger btn-cancel">
            <i class="fa fa-times fa-fw"></i><span class="hidden-xs hidden-sm">Cancel</span>
          </button>
      </div>

  </div>

</div>

</template>

<script>

var CreateCleaning = require('./CreateCleaning.vue')
var CreateGarbage = require('./CreateGarbage.vue')
var CreateLive = require('./CreateLive.vue')
var CreateTile= require('./CreateTile.vue')
var CreatePolyline = require('./CreatePolyline.vue')
var CreatePolygon = require('./CreatePolygon.vue')
var FormSocial = require('./FormSocial.vue')
var FormUpload = require('./FormUpload.vue')

var FormBase = Vue.extend({
  el: 'form-base',
  components: {},
  /* need to get the latlng from leaflet */
  data: {}
})

Vue.component('form-base', FormBase)



</script>
