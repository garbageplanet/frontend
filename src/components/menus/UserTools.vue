<style lang="sass">
</style>

<template>

  <div id"user-tools">

    <register>
    </register>

    <login>
    </login>

    <glome>
    </glome>

    <user-info>
    </user-info>

  </div>

</template>

<script>

var Glome = require('../../components/user-tools/Glome.vue')
var Login = require('../../components/user-tools/Login.vue')
var Register = require('../../components/user-tools/Register.vue')
var UserInfo = require('../../components/user-tools/UserInfo.vue')


var UserTools = Vue.extend({
  el: 'user-tools',
  components: {}
})

Vue.component('user-tools', UserTools)

</script>
