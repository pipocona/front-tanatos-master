<template>
  <div>
    <v-container>
      <v-data-table
        :headers="headers"
        :items="lista_modelo"
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
            <v-toolbar-title>Modelos</v-toolbar-title>
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
                  Nuevo Modelo
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
                          v-model="modelo.descripcion"
                          label="Descripción"
                          color="#0aa696"
                          hint="Ejemplo: Core i7"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="12"
                      >
                        <v-text-field
                          v-model="modelo.marcaId"
                          label="Marca"
                          color="#0aa696"
                          hint="Ejemplo: Intel"
                        ></v-text-field>
                        <!-- <v-autocomplete
                          :items="['Intel', 'Genius']"
                          label="Marca"
                        ></v-autocomplete> -->
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
                <v-card-title class="text-h5">Está seguro de eliminar el modelo?</v-card-title>
                <v-spacer></v-spacer>
                <v-card-subtitle class="text-h6">{{modelo.descripcion}}</v-card-subtitle>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="#0aa696" text @click="closeEliminar">Cancelar</v-btn>
                  <v-btn color="#1bf2cb" text @click="eliminarModeloConfirm">Eliminar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          {{item.id}}
          <v-btn class="ma-1" fab dark x-small color="#88f2f2" @click="editarModelo(item)">
            <v-icon
              dark
              small
              class="ma-2"
              
            >
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn class="ma-1" fab dark x-small color="#1bf2cb" @click="eliminarModelo(item)">
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
import * as modService from "./../../services/modeloService"

export default {
  data() {
    return {
      page: 1,
      totalItems: 0,
      opciones: {},
      estadoBoton: false,
      dialog: false,
      dialogDelete: false,
      lista_modelo: [],
      cargando: true,
      modelo: {
        descripcion:'',
        marcaId:''
      },

      search: '',
      headers: [
        {
          text: 'Descripción',
          align: 'start',
          value: 'descripcion',
        },
        { text: 'Marca', value: 'marcaId' },
        { text: 'Acciones', value: 'acciones', sortable: false, align:'center'},
      ],
      editedIndex: -1,
      defaultModelo: {
        descripcion: '',
        marcaId:''
      },
    }
  },
  computed: {
    formTitulo () {
      return this.editedIndex === -1 ? 'Nuevo Modelo' : 'Editar Modelo'
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
      const datos = await modService.listar(pagina, limite)
      console.log(datos);
      this.lista_modelo = datos.rows
      this.cargando = false;
      this.totalItems = datos.count
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.modelo = Object.assign({}, this.defaultModelo)
        this.editedIndex = -1
      })
      this.estadoBoton = false;
    },
    async guardar () {
      this.estadoBoton = true;
      if (this.editedIndex > -1) {
        let mod = this.lista_modelo[this.editedIndex]
        await modService.modificar(this.modelo, mod.id)
        Object.assign(this.lista_modelo[this.editedIndex], this.modelo)
      } else {
        await modService.guardar(this.modelo)
        this.lista_modelo.push(this.modelo)
      }
      this.estadoBoton = false;
      this.close()
    },
    editarModelo (item) {
      this.editedIndex = this.lista_modelo.indexOf(item)
      this.modelo = Object.assign({}, item)
      this.dialog = true
    },

    eliminarModelo (item) {
      this.editedIndex = this.lista_modelo.indexOf(item)
      this.modelo = Object.assign({}, item)
      this.dialogDelete = true
    },

    async eliminarModeloConfirm () {
      try {
        let mod = this.lista_modelo[this.editedIndex]
        let res = await modService.eliminar(mod.id);
        if(!res.error){
          this.lista_modelo.splice(this.editedIndex, 1)
        }
        this.closeEliminar()
      } catch (error) {
        
      }
    },
    closeEliminar () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.modelo = Object.assign({}, this.defaultModelo)
        this.editedIndex = -1
      })
    },
  },
}
</script>

<style>

</style>