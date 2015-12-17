<style lang="sass">
</style>

<template>

  <div>
    
    <div>
      <input type="search"
             name="search"
             placeholder="search ..."
             id="search-box">
    </div>

    <div id="search-results">
        <ul v-for="">
          <li></li>
        </ul>
    </div>

  </div>

</template>

<script>

var SearchTools = Vue.extend({
  el: 'search-tools'
})

Vue.component('search-tools', SearchTools)

</script>
