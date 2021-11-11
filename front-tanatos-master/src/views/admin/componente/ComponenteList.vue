<template>
  <div>
    <v-container>
      <v-data-table
        :headers="headers"
        :items="lista_componente"
        :page="page"
        :options.sync="opciones"
        :server-items-length="totalItems"
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
            <v-toolbar-title>Lista de Componentes</v-toolbar-title>
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
            
            <!-- <v-dialog
              v-model="dialog"
              max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }"> -->
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  
                >
                  Nuevo Componente
                </v-btn>
              <!-- </template>
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
                          v-model="componente.categoriaId"
                          label="Descripcion"
                          
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="close"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="green darken-1"
                    :loading="estadoBoton"
                    text
                    @click="guardar"
                  >
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog> -->

            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">Está seguro de eliminar el componente?</v-card-title>
                <v-spacer></v-spacer>
                <v-card-subtitle class="text-h6">{{componente.categoriaId}}</v-card-subtitle>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeEliminar">Cancelar</v-btn>
                  <v-btn color="red darken-1" text @click="eliminarComponenteConfirm">Eliminar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          {{item.id}}
          <v-btn class="ma-1" fab dark x-small color="primary darken-3" @click="verComponente(item)">
            <v-icon
              dark
              small
              class="ma-2"
            >
              mdi-eye
            </v-icon>
          </v-btn>
          <v-btn class="ma-1" fab dark x-small color="primary darken-3" @click="editarComponente(item)">
            <v-icon
              dark
              small
              class="ma-2"
            >
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn class="ma-1" fab dark x-small color="red darken-2" @click="eliminarComponente(item)">
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
import * as compService from "./../../../services/componenteService"

export default {
data() {
    return {
      page: 1,
      totalItems: 0,
      opciones: {},
      estadoBoton: false,
      dialog: false,
      dialogDelete: false,
      lista_componente: [],
      cargando: true,
      componente: {
        codigoActivo:'',
        categoriaId:''
      },

      search: '',
      headers: [
        {
          text: 'Codigo Activo',
          align: 'start',
          sortable: true,
          value: 'codigoActivo',
        },
        { text: 'Categoria', value: 'categoriaId' },
        { text: 'Marca', value: 'marcaId' },
        { text: 'Modelo', value: 'modeloId' },
        { text: 'Estado', value: 'estadoComponente' },
        { text: 'Acciones', value: 'acciones', sortable: false, align:'center'},
      ],
      editedIndex: -1,
      // editedItem: {
      //   id: '',
      //   descripcion: '',
      //   acciones: '',
      // },
      defaultComponente: {
        codigoActivo:'',
        categoriaId: '',
      },
    }
  },
  // computed: {
  //   formTitulo () {
  //     return this.editedIndex === -1 ? 'Nuevo Componente' : 'Editar Componente'
  //   },
  // },
  watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeEliminar()
      },
      opciones: {
        handler(){
          this.obtener();
        }
      }
    },

  // async mounted(){
  //   let datos = await compService.listar()
  //   console.log(datos);
  //   this.lista_componente = datos
  //   this.cargando = false
  // },

  methods: { 
    
    async obtener(){
      this.cargando = true
      const {page, itemsPerPage} = this.opciones;
      let pagina = page;
      let limite = itemsPerPage;
      const datos = await compService.listar(pagina, limite)
      console.log(datos);
      this.lista_componente = datos.rows
      this.cargando = false;
      this.totalItems = datos.count
    },    
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.componente = Object.assign({}, this.defaultComponente)
        this.editedIndex = -1
      })
      this.estadoBoton = false;
    },
    async guardar () {
      this.estadoBoton = true;
      if (this.editedIndex > -1) {
        let cat = this.lista_componente[this.editedIndex]
        await compService.modificar(this.componente, cat.id)
        Object.assign(this.lista_componente[this.editedIndex], this.componente)
      } else {
        await compService.guardar(this.componente)
        this.lista_componente.push(this.componente)
      }
      this.estadoBoton = false;
      this.close()
    },

    editarComponente (item) {
      this.editedIndex = this.lista_componente.indexOf(item)
      this.componente = Object.assign({}, item)
      this.dialog = true
    },

    eliminarComponente (item) {
      this.editedIndex = this.lista_componente.indexOf(item)
      this.componente = Object.assign({}, item)
      this.dialogDelete = true
    },

    async eliminarComponenteConfirm () {
      try {
        let comp = this.lista_componente[this.editedIndex]
        let res = await compService.eliminar(comp.id);
        if(!res.error){
          this.lista_componente.splice(this.editedIndex, 1)
        }
        this.closeEliminar()
      } catch (error) {
        
      }
    },

    closeEliminar () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.componente = Object.assign({}, this.defaultComponente)
        this.editedIndex = -1
      })
    },
  },
}
</script>

<style>

</style>