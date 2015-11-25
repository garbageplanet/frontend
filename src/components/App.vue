<!-- src/components/App.vue

This is the main canvas for the map and the sidebar

-->

<template>

  <div id="map">
    <router-view></router-view>
  </div>

  <div id="sidebar">
    <div class="sidebar-container">
      <router-view></router-view>
    </div>
  </div>

</template>
