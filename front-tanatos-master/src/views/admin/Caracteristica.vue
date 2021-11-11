<template >
  <div >
    <v-container backgroundcolor  ="#0d2340"  >
       
      <v-data-table
        :headers="headers"
        :items="lista_caracteristica"
        sort-by=""
        class="elevation-1"
        :loading="cargando"
        loading-text="Cargando... Espere por favor"
        :search="search"
        :footer-props="{
        showFirstLastPage: true,
        firstIcon: 'mdi-arrow-collapse-left',
        lastIcon: 'mdi-arrow-collapse-right',
        prevIcon: 'mdi-arrow-left',
        nextIcon: 'mdi-arrow-right',
           'items-per-page-text':'Items por página'
      }"
      
      >
        <template v-slot:top>
          <v-toolbar
            flat
            
          >
            <v-toolbar-title>Caracteristicas</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Búsqueda"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-dialog
              v-model="dialog"
              max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="#0aa696"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Nueva Caracteristica
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitulo }}</span>
                </v-card-title>
                
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="12"
                        md="8"
                      >
                        <v-text-field
                          v-model="caracteristica.descripcion"
                          label="Caracteristica"
                          color="#0aa696"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="4"
                      >
                        <v-text-field
                          v-model="caracteristica.medicion"
                          label="Medición"
                          color="#0aa696"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="12"
                      >
                        <!-- <v-text-field
                          v-model="caracteristica.categorias[0].categoriaId"
                          label="Categoria"
                          hint="Ejemplo: Intel"
                        ></v-text-field> -->
                        <v-select
                          v-model="caracteristica.categorias"
                          :items="lista_categoria"
                          item-text="descripcion"
                          item-value="id"
                          label="Categoria"
                          color="#0aa696"
                          multiple
                        >
                        </v-select>
                        
                        {{caracteristica}}
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="#0aa696"
                    text
                    @click="close"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="#1bf2cb"
                    :loading="estadoBoton"
                    text
                    @click="guardar"
                  >
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title  class="text-h5">Está seguro de eliminar la caracteristica?</v-card-title>
				<v-spacer></v-spacer>
                <v-card-subtitle class="text-h6">{{caracteristica.descripcion}}</v-card-subtitle>					 																							
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="#0aa696" text @click="closeEliminar">Cancelar</v-btn>
                  <v-btn color="#1bf2cb" text @click="eliminarCaracteristicaConfirm">Eliminar</v-btn>

                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          {{item.id}}
          <v-btn class="ma-1" fab dark x-small color="#88f2f2" @click="editarCaracteristica(item)">
            <v-icon
              dark
              small
              class="ma-2"
            >
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn class="ma-1" fab dark x-small color="#1bf2cb" @click="eliminarCaracteristica(item)">
            <v-icon
              dark
              small
              class="ma-2"
            >
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import * as carService from "./../../services/caracteristicaService"
import * as catService from "./../../services/categoriaService"

export default {
  data() {
    return {
      estadoBoton: false,
      dialog: false,
      dialogDelete: false,
      lista_caracteristica: [],
      lista_categoria: [],
      selectedCategory: [],
      cargando: true,
      caracteristica: {
        descripcion:'',
        medicion: '',
        categorias:[]
      },
      search: '',
      headers: [
        { text: 'Descripción', value: 'descripcion' },
        { text: 'Medicion', value: 'medicion' },
        { text: 'Acciones', value: 'acciones', sortable: false, align:'center'},
      ],
      editedIndex: -1,
      defaultCaracteristica: {
        descripcion: '',
        medicion: '',
        categorias:[]
      },
    }
  },
  computed: {
    formTitulo () {
      return this.editedIndex === -1 ? 'Nueva Caracteristica' : 'Editar Caracteristica'
    },
  },
  watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeEliminar()
      },
    },

  async mounted(){
    // let datos = await carService.listar()
    // console.log(datos);
    // this.lista_caracteristica = datos
    // this.cargando = false
    this.obtener();
    this.obtenerCategoria();
  },

  methods: {
    async obtener() {
      let datos = await carService.listar()
      //console.log(datos);
      this.lista_caracteristica = datos
      this.cargando = false
    },

    async obtenerCategoria() {
      let datos = await catService.listarSelect()
      //console.log(datos);
      this.lista_categoria = datos
      console.log(this.lista_categoria);
      //this.cargando = false
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.caracteristica = Object.assign({}, this.defaultCaracteristica)
        this.editedIndex = -1
      })
	  this.estadoBoton = false;						
    },
    async guardar () {
      this.estadoBoton = true;
      if (this.editedIndex > -1) {
        let car = this.lista_caracteristica[this.editedIndex]
        await carService.modificar(this.caracteristica, car.id)
        Object.assign(this.lista_caracteristica[this.editedIndex], this.caracteristica)
      } else {
        await carService.guardar(this.caracteristica)
        this.lista_caracteristica.push(this.caracteristica)
      }
      this.obtener();
      this.estadoBoton = false;
      this.close()
    },
    editarCaracteristica (item) {
      this.editedIndex = this.lista_caracteristica.indexOf(item)
    
      this.caracteristica = Object.assign({}, item)
      this.dialog = true
    },
    eliminarCaracteristica (item) {
      this.editedIndex = this.lista_caracteristica.indexOf(item)
      this.caracteristica = Object.assign({}, item)
      this.dialogDelete = true
    },
    async eliminarCaracteristicaConfirm () {
      try {
        let car = this.lista_caracteristica[this.editedIndex]
        let res = await carService.eliminar(car.id);
        if(!res.error){
          this.lista_caracteristica.splice(this.editedIndex, 1)
        }
        this.closeEliminar()
      } catch (error) {        
      }
    },
    closeEliminar () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.caracteristica = Object.assign({}, this.defaultCaracteristica)
        this.editedIndex = -1
      })
    },
  },
}
</script>

<style>

</style>