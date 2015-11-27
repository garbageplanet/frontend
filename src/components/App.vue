<!-- src/components/App.vue

This is the main canvas for the map and the sidebar

-->

<template>

  <div id="map">
    <router-view> <!-- map div --> </router-view>
  </div>

  <div id="sidebar">

      <router-view> <!-- Sidebar div --> </router-view>

  </div>

</template>
