<template>
  <div id="app">
    <Overlay/>
  </div>
</template>

<script>
import Overlay from './components/Overlay.vue';

export default {
  name: 'App',
  components: {
    Overlay,
  },
};
</script>

<style lang="sass">
@import ./variables.sass
@import ~frow/frow.sass
//;

#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60px
</style>
