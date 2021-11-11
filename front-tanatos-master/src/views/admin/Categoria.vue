<template>
  <div>
    <v-container>
      <v-data-table
        :headers="headers"
        :items="lista_categoria"
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
            <v-toolbar-title>Categorias</v-toolbar-title>
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
                  color="#0AA696"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Nueva Categoria
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
                          v-model="categoria.descripcion"
                          label="Descripción"
                          color= "#0aa696"
                          hint="Ejemplo: Procesador"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="12"
                      >
                        <!-- <v-text-field
                          v-model="modelo.marcaId"
                          label="Marca"
                          hint="Ejemplo: Intel"
                        ></v-text-field> -->
                        <v-autocomplete
                          :items="['Frecuencia', 'Almacenamiento']"
                          color= "#0aa696"
                          label="Caracteristica"
                        ></v-autocomplete>
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
                <v-card-title class="text-h5">Está seguro de eliminar la categoria?</v-card-title>
                <v-spacer></v-spacer>
                <v-card-subtitle class="text-h6">{{categoria.descripcion}}</v-card-subtitle>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="#0aa696" text @click="closeEliminar">Cancelar</v-btn>
                  <v-btn color="#1bf2cb" text @click="eliminarCategoriaConfirm">Eliminar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          {{item.id}}
          <v-btn class="ma-1" fab dark x-small color="#88F2F2" @click="editarCategoria(item)">
            <v-icon
              dark
              small
              class="ma-2"
            >
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn class="ma-1" fab dark x-small color="#1BF2CB" @click="eliminarCategoria(item)">
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
import * as catService from "./../../services/categoriaService"
import * as carService from "./../../services/caracteristicaService"

export default {
  data() {
    return {
      page: 1,
      totalItems: 0,
      opciones: {},
      estadoBoton: false,
      dialog: false,
      dialogDelete: false,
      lista_categoria: [],
      cargando: true,
      categoria: {
        descripcion:'',
        caracteristicas: [
          {caracteristicaId: 2},
          {caracteristicaId: 3}
          ],
        marcas: [
          {marcaId: 1}
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
      // editedItem: {
      //   id: '',
      //   descripcion: '',
      //   acciones: '',
      // },
      defaultCategoria: {
        descripcion: '',
        caracteristicas: [],
        marcas: []
      },
    }
  },
  
  computed: {
    formTitulo () {
      return this.editedIndex === -1 ? 'Nueva Categoria' : 'Editar Categoria'
    },
  },
  
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

  methods: { 

    async obtener(){
      this.cargando = true
      const {page, itemsPerPage} = this.opciones;
      let pagina = page;
      let limite = itemsPerPage;
      const datos = await catService.listar(pagina, limite)
      console.log(datos);
      this.lista_categoria = datos.rows
      this.cargando = false;
      this.totalItems = datos.count
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.categoria = Object.assign({}, this.defaultCategoria)
        this.editedIndex = -1
      })
      this.estadoBoton = false;
    },
    async guardar () {
      this.estadoBoton = true;
      if (this.editedIndex > -1) {
        let cat = this.lista_categoria[this.editedIndex]
        await catService.modificar(this.categoria, cat.id)
        Object.assign(this.lista_categoria[this.editedIndex], this.categoria)
      } else {
        await catService.guardar(this.categoria)
        this.lista_categoria.push(this.categoria)
      }
      this.obtener();
      this.estadoBoton = false;
      this.close()
    },
     
    editarCategoria (item) {
      this.editedIndex = this.lista_categoria.indexOf(item)
      this.categoria = Object.assign({}, item)
      this.dialog = true
    },

    eliminarCategoria (item) {
      this.editedIndex = this.lista_categoria.indexOf(item)
      this.categoria = Object.assign({}, item)
      this.dialogDelete = true
    },

    async eliminarCategoriaConfirm () {
      try {
        let cat = this.lista_categoria[this.editedIndex]
        let res = await catService.eliminar(cat.id);
        if(!res.error){
          this.lista_categoria.splice(this.editedIndex, 1)
        }
        this.closeEliminar()
      } catch (error) {
        
      }
    },

    closeEliminar () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.categoria = Object.assign({}, this.defaultCategoria)
        this.editedIndex = -1
      })
    },
    
  },
}
</script>

<style>

</style>