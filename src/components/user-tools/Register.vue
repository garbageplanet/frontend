<!-- Regitration form -- >

<style lang="sass">


</style>

<template>

<div id="register-form">

  <form id="registration"
        class="form-group"
        data-toggle="validator"
        role="form">

        <div class="form-group form-group-lg">

          <input type="text"
                 name="name"
                 id="register-name"
                 class="form-control"
                 placeholder="Username (min 4 characters)"
                 required>

                 <div class="help-block with-errors"></div>

        </div>

        <div class="form-group form-group-lg">

          <input type="email"
                 name="email"
                 class="form-control"
                 placeholder="Use a fake email for the demo"
                 id="register-email">

                 <div class="help-block with-errors"></div>

        </div>

<div class="form-group form-group-lg">

<input id="register-password"
   type="password"
   class="form-control"
   placeholder="Password min 6 characters"
   name="password"
   required>
<div class="help-block with-errors"></div>
</div>
</form>

</div>

</template>

<script>

var Register = Vue.extend({
  el: 'register'
  components: {}
})

Vue.component('register', Register)

</script>
