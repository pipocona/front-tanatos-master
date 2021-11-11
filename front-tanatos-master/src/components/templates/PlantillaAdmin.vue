<template>
  <v-app>
    <Navegacion></Navegacion>
    <v-main>
      <router-view></router-view>
    </v-main>

  </v-app>
</template>

<script>
import Navegacion from "./../navegacion/Navegacion.vue"

export default {
  components:{
    Navegacion
  },
  data() {
    return {
      drawer: null
    }
  },
}
</script>

<style>

</style>