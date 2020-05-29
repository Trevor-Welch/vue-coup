<template>
  <div id="app">
    <router-link to="/" tag="h1">Vue Coup</router-link>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'VueCoup'
}
</script>

<style lang="scss">
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1:hover {
  color: green;
  cursor: pointer;
}
</style>
