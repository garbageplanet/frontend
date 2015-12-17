<!-- This is where the login/logout form comes -->

<style>
</style>

<template>

  <div id="">

    <form id="login-form" class="form-group">

        <div class="form-group form-group-lg">

            <div>
                <input type="email"
                       name="email"
                       class="form-control"
                       placeholder="Email"
                       id="login-email">
            </div>

            <br>

            <div>
                <input type="password"
                       name="password"
                       class="form-control"
                       placeholder="Password"
                       id="login-password">
            </div>

            <br>

            <div>
                <div>
                    <button type="submit"
                            id="send"
                            v-on:click="login"
                            class="btn btn-info btn-lg btn-block">Login &raquo
                    </button>
                </div>

            </div>

        </div>

    </form>

  </div>

</template>

<script>

var Login = Vue.extend({
  el: 'login',
  components: {}
})

Vue.component('login', Login)

</script>
