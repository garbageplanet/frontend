<!-- src/components/main.vue This is the main menu for user actions on the map -->
<style>

</style>

<template>

 <div id="create-feature">

   <h1>Action for this location</h1>

   <template v-for="element in elements">

     <button class="btn btn-primary"  v-link="{ path: '/Create{{ element.type  }}' }">Add a {{ element.type }} marker</button>

   </template>

 </div>

</template>

<script>

var CreateFeature = Vue.extend({
  el: '#create-feature',
  data: {}
})

Vue.component('create-feature', CreateFeature)

</script>
