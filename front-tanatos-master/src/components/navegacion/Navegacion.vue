<template>
  <div>
    <v-navigation-drawer
  
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      style="background-color: #165873">
      <v-list dense class="white--text">
        <template v-for="item in items"
        color="white">
          <v-row
            v-if="item.heading"
            :key="item.heading"
            align="center"                    
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading" 
              >
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-center"
            >
              <a
                href="#!"
                class="body-2 white--text"
                                
              >EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
             v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""            
          >
            <template v-slot:activator >
              <v-list-item-content class="white--text" >
                <v-list-item-title  
                >
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              link
              :to="child.url" 
            >
              <v-list-item-action v-if="child.icon" >
                <v-icon
                color="white">{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content class="white--text">
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            link
            :to="item.url"
            class="white--text"
          >
            <v-list-item-action >
              <v-icon
              color="white">
              {{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content >
              <v-list-item-title >
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color ="#0d2340"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
      </v-app-bar-nav-icon>    
      <v-toolbar-title style="width: 300px"
                       class="ml-0 pl-4">
          <v-avatar size="50" PADDING=left>
              <img src="@/assets/tanato_1.png"
                   alt="TANATOS">
          </v-avatar>

          <span  class="hidden-sm-and-down">Sistema Tanatos</span>



      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-avatar color="indigo" size="36">
        <img
        src="https://cdn.vuetifyjs.com/images/john.jpg"
        alt="John"
      >
      </v-avatar>
        <v-btn icon @click="salir()">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
        <!-- <v-btn icon>
          <v-icon>mdi-bell</v-icon>
        </v-btn> -->
        
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
      items: [
        {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-cellphone-link',
          text: 'Componentes',
          model: false,
          children: [
            { icon: 'mdi-plus', text: 'Lista de Componentes', url: '/admin/componente' },
            { icon: 'mdi-plus', text: 'Nuevo Componente', url: '/admin/componente/add' },
          ],
        },
        {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-keyboard',
          text: 'Mantenimientos',
          model: false,
          children: [
            { icon: 'mdi-plus', text: 'Lista de Mantenimientos' },
            { icon: 'mdi-plus', text: 'Nuevo Mantenimiento' },
          ],
        },
        { icon: 'mdi-cog', text: 'Categorias', url: '/admin/categoria' },
        { icon: 'mdi-history', text: 'Marcas', url: '/admin/marca' },
        { icon: 'mdi-content-copy', text: 'Modelos', url: '/admin/modelo' },     
        { icon: 'mdi-message', text: 'Caracteristicas', url: '/admin/caracteristica' },
        { icon: 'mdi-help-circle', text: 'Baja de Componentes' },
        { icon: 'mdi-contacts', text: 'Usuarios', url: '/admin/usuario' },
      ],
    }
  },

  methods: {
    salir(){
      localStorage.clear();
      this.$router.push("/login")
    }
  }
}
</script>