<!-- src/components/main.vue This is the main menu for user actions on the map -->

<template>
 <div class="sidebar-content">
   <h1>Action for this location</h1>
   <button class="btn btn-primary" v-on:click="CreateGarbage()">Add a garbage marker</button>
   <button class="btn btn-primary" v-on:click="CreateCleaning()">Organize a cleaning event</button>
   <button class="btn btn-primary" v-on:click="CreateTile()">Activate a tile</button>
   <button class="btn btn-primary" v-on:click="CreateLive()">Create a live event</button>
   <button class="btn btn-primary" v-on:click="CreatePolygon()">Create a live event</button>
   <button class="btn btn-primary" v-on:click="CreatePolyline()">Create a live event</button>
 </div>
</template>

<script>
...
</script>
