<template>
  <div>
    <v-container>
      <v-data-table
        :headers="headers"
        :items="lista_marca"
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
            <v-toolbar-title>Marcas</v-toolbar-title>
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
                  Nueva Marca
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
                        md="12"
                      >
                        <v-text-field
                          v-model="marca.descripcion"
                          color= "#0aa696"
                          label="Marca"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="#0AA696"
                    text
                    @click="close"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="#1BF2CB"
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
                <v-card-title class="text-h5">Está seguro de eliminar la marca?</v-card-title>
				<v-spacer></v-spacer>
                <v-card-subtitle class="text-h6">{{marca.descripcion}}</v-card-subtitle>					 																							
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="#0aa696" text @click="closeEliminar">Cancelar</v-btn>
                  <v-btn color="#1bf2cb" text @click="eliminarMarcaConfirm">Eliminar</v-btn>

                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-btn class="ma-1" fab dark x-small color="#88f2f2" @click="editarMarca(item)">
            <v-icon
              dark
              small
              class="ma-2"
            >
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn class="ma-1" fab dark x-small color="#1bf2cb" @click="eliminarMarca(item)">
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
import * as marService from "./../../services/marcaService"

export default {
  data() {
    return {
      estadoBoton: false,
      dialog: false,
      dialogDelete: false,
      lista_marca: [],
      cargando: true,
      marca: {
        descripcion:'',
        categorias: [
          {categoriaId: 45}
        ]
      },

      search: '',
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Descripción', value: 'descripcion' },
        { text: 'Acciones', value: 'acciones', sortable: false, align:'center'},
      ],
      editedIndex: -1,
      defaultMarca: {
        descripcion: '',
        categorias: [
          {categoriaId: ''}
        ]
      },
    }
  },
  computed: {
    formTitulo () {
      return this.editedIndex === -1 ? 'Nueva Marca' : 'Editar Marca'
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
    // let datos = await marService.listar()
    // console.log(datos);
    // this.lista_marca = datos
    // this.cargando = false
    this.obtener()
  },

  methods: { 

    async obtener() {
      let datos = await marService.listar()
      console.log(datos);
      this.lista_marca = datos
      this.cargando = false
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.marca = Object.assign({}, this.defaultMarca)
        this.editedIndex = -1
      })
	  this.estadoBoton = false;						
    },
    async guardar () {
      this.estadoBoton = true;
      if (this.editedIndex > -1) {
        let mar = this.lista_marca[this.editedIndex]
        await marService.modificar(this.marca, mar.id)
        Object.assign(this.lista_marca[this.editedIndex], this.marca)
      } else {
        await marService.guardar(this.marca)
        this.lista_marca.push(this.marca)
      }
      this.obtener();
      this.estadoBoton = false;
      this.close()
    },
    editarMarca (item) {
      this.editedIndex = this.lista_marca.indexOf(item)
      this.marca = Object.assign({}, item)
      this.dialog = true
    },
    eliminarMarca (item) {
      this.editedIndex = this.lista_marca.indexOf(item)
      this.marca = Object.assign({}, item)
      this.dialogDelete = true
    },
    async eliminarMarcaConfirm () {
      try {
        let mar = this.lista_marca[this.editedIndex]
        let res = await marService.eliminar(mar.id);
        if(!res.error){
          this.lista_marca.splice(this.editedIndex, 1)
        }
        this.closeEliminar()
      } catch (error) {        
      }
    },
    closeEliminar () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.marca = Object.assign({}, this.defaultMarca)
        this.editedIndex = -1
      })
    },
  },
}
</script>

<style>

</style>