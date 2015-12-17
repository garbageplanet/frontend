 <!--
This is the container for the UserInfo, Login (Logout),
Register and ProjectInfo elements
-->

<style lang="sass">

</style>

<template>

<div id="menu" class="container">

    <ul  class="nav nav-pills nav-justified">

        <li>
            <a  href="#information" data-toggle="tab">
              <span class="fa fa-fw fa-info fa-white"></span>
            </a>
        </li>

        <li>
            <a href="#2a" data-toggle="tab">
              <span class="fa fa-fw fa-globe fa-white"></span>
            </a>
        </li>

        <li>
            <a href="#3a" data-toggle="tab">
              <span class="fa fa-fw fa-user fa-white"></span>
            </a>
        </li>

    </ul>

    <div class="tab-content clearfix">

        <div class="tab-pane active" id="information">

          <information-view>
          </information-view>

        </div>

        <div class="tab-pane" id="map-tools">

          <map-tools-view>
          </map-tools-view>

        </div>

        <div class="tab-pane" id="user-menu">

          <user-menu-view>
          </user-menu-view>

        </div>

    </div>

</div>


</template>

<script>

var MapTools = require('./MapTools.vue')
var SearchTools = require('./SearchTools.vue')
var UserTools = require('./UserTools.vue')

var MenuView = Vue.extend({
  el: '#menu'
})

Vue.component('menu-view', MenuView)

</script>
