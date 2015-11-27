<!-- Add garbage form -->

<style lang="sass">

@import 'skeleton.css'
@import 'normalize.css'

</style>

<template>

<div id="add-trash-form">
  <div class="row">
    <ul>
      <li>lat: {{ newMarkerLat }}</li>
      <li>lng: {{ newMarkerLng }}</li>
    </ul>
  </div>
  <div class="row">
    <select type="amount" name="amount" class="u-full-width">
      <option value="0">0</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
    </select>
  </div>
  <div class="row">
    <select name="types" multiple class="u-full-width">
      <option value="bottles">bottles</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
    </select>
  </div>
  <div class="row">
      <button v-on:click="createMarker($event)" class="u-full-width">Add new marker</button>
  </div>
</div>

</template>



<script>
</script>
