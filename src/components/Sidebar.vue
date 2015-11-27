<!-- This is the component for the sidebar -->
<style lang="sass">

*
  font-family: 'Work Sans', sans-serif;
  font-weight: 200

=border-radius($radius)
  -webkit-border-radius: $radius
     -moz-border-radius: $radius
      -ms-border-radius: $radius
          border-radius: $radius
*
    +border-radius(0px !important)

a
  .fa
    vertical-align: middle
    text-decoration: none

    /* Icons color shortcuts */
    .green
      color: limegreen

    .red
      color: orangered

    .blue
      color: dodgerblue

    .yellow
      color: yellow

    .black
      color: black

    .white
      color: white

    .gray
      color: lightgray

    .darkgray
      color: #464646

    .seagreen
      color: mediumseagreen

    .orange
      color: orange;


.sidebar
    padding: 0px
    .close
        right: 10px
        top: 10px

.panel,
.panel-group
.panel-heading+.panel-collapse>.panel-body
    border: none
    box-shadow: none
    -webkit-box-shadow: none

a
    menu-backlink
        color: lightgray

.container
  padding-top: 20px
  padding-bottom: 20px

#sidebar
  z-index:10000
  height: 100%
  width: 300px
  position: absolute
  top: 0
  right: 0
  background-color: #fff
  padding: 20px 20px 20px 20px

pre
  background-color: #e7e7e8
  color: #000

</style>

<template>

    <router-view v-if="userIsLoggedIn">

      <router-view> <!-- logout div --> </router-view>

      <router-view> <!-- add garbage div --> </router-view>

      <router-view> v-else> <!-- Register form --> </router-view>

    </router-view>

</template>

<script>

</script>
