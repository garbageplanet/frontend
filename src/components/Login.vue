<!-- This is where the login/logout form comes -->

<template>

  <div id="login-form">
          <div class="row">
              <input type="email" name="email" placeholder="email" class="u-full-width">
          </div>
          <div class="row">
              <input type="password" name="password" placeholder="password" class="u-full-width">
          </div>
          <div class="row">
              <button type="submit" v-on:click="login" class="u-full-width">Login (click it to show marker add)</button>
          </div>
  </div>

  <div id="logout-form">
      <button type="button" class="u-full-width" v-on:click="logout">Logout (show login forms)</button>
  </div>

</template>
