<template>
  <div id="app">
      <v-app id="inspire">
          <v-responsive>

              




                  <v-app id="inspire">
                      <v-main>

                          <v-img src="@/assets/login_tanatos.svg"
                                 aspect-ratio="1,1">

                              <v-container class="fill-height"
                                           fluid>
                                  <v-row align="center"
                                         justify="center">
                                      <v-col cols="12"
                                             sm="8"
                                             md="4">
                                          <v-card class="elevation-12">
                                              <v-toolbar color="#0D2340"
                                                         dark
                                                         flat>
                                                  <v-toolbar-title>INGRESAR</v-toolbar-title>
                                                  <v-spacer></v-spacer>
                                                  <!-- <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              :href="source"
                              icon
                              large
                              target="_blank"
                              v-on="on"
                            >
                              <v-icon>mdi-code-tags</v-icon>
                            </v-btn>
                          </template>
                          <span>Source</span>
                        </v-tooltip> -->
                                              </v-toolbar>
                                              <v-card-text>
                                                  <v-form ref="form" v-model="valid">
                                                      <v-text-field label="Usuario"
                                                                    name="login"
                                                                    prepend-icon="mdi-account"
                                                                    type="text"
                                                                    v-model="usuario.user"
                                                                    :counter="50"
                                                                    :rules="userRules"></v-text-field>

                                                      <v-text-field id="password"
                                                                    label="Contraseña"
                                                                    name="password"
                                                                    prepend-icon="mdi-lock"
                                                                    type="password"
                                                                    v-model="usuario.password"
                                                                    :rules="passwordRules"></v-text-field>
                                                  </v-form>
                                              </v-card-text>
                                              <v-card-actions>
                                                  <v-spacer></v-spacer>
                                                  <v-btn color="#0AA696" text-white @click="ingresar()" :disabled="!valid">Iniciar Sesión</v-btn>
                                              </v-card-actions>
                                          </v-card>
                                      </v-col>
                                  </v-row>
                                  <v-snackbar v-model="snackbar"
                                              :timeout="timeout"
                                              color="red darken-2">
                                      {{ text }}

                                      <template v-slot:action="{ attrs }">
                                          <v-btn color=""
                                                 text
                                                 v-bind="attrs"
                                                 @click="snackbar = false">
                                              Cerrar
                                          </v-btn>
                                      </template>
                                  </v-snackbar>
                              </v-container>
                          </v-img>
              </v-main>
</v-app>
              

          </v-responsive>
      </v-app>
</div>
</template>

<script>
import axios from "axios"


export default {
  data(){
    return {
      usuario: {
        user: '',
        password: ''
      },
      color: '',
      snackbar: false,
      text: '',
      timeout: 3000,
      valid: true,
      userRules: [
        v => !!v || 'El usuario es requerido',
        v => (v && v.length <= 10) || 'El usuario debe ser menor a 50 caracteres',
      ],
      passwordRules : [
        v => !!v || 'La contraseña es requerida',
        //v => (v && v.length <= 10) || 'El usuario debe ser menor a 50 caracteres',
      ],
    }
  },
  methods: {
    async ingresar(){
      this.validate();
      const url = process.env.VUE_APP_API_URL
      let {data} = await axios.post(`${url}/auth/login`, this.usuario);
      console.log(data);
      localStorage.setItem("access_token", btoa(JSON.stringify(data)))
      if(!data.error){
        this.text = "Bienvenido Usuario"
        this.snackbar = true
        this.color = "green"
        //redirect
        this.$router.push("admin")
      }else{
        //guardar token
        
        this.text = data.mensaje
        this.snackbar = true
        this.color = "dark-red"
      }
    },
    validate(){
      this.$refs.form.validate()
    }
  }
}
</script>

<style>

</style>