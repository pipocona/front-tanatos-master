import Vue from 'vue'
import VueRouter from 'vue-router'
import PlantillaPagina from '../components/templates/PlantillaPagina.vue'
import PlantillaAdmin from '../components/templates/PlantillaAdmin.vue'
import Inicio from '../views/pagina/Inicio.vue'
import Login from '../views/pagina/Login.vue'
//import admin
import Categoria from '../views/admin/Categoria.vue'
import Marca from '../views/admin/Marca.vue'
import Modelo from '../views/admin/Modelo.vue'
import Caracteristica from '../views/admin/Caracteristica.vue'
import ComponenteList from '../views/admin/componente/ComponenteList.vue'
import ComponenteAdd from '../views/admin/componente/ComponenteAdd.vue'

//Guard
import {authGuard} from './../guards/authGuard'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: PlantillaPagina,
    children: [
      {
        path: '/',
        name: "Inicio",
        component: Inicio
      },
      {
        path: '/login',
        name: "Login",
        component: Login
      }
    ]
  },
  {
    path: '/admin',
    component: PlantillaAdmin,
    beforeEnter: authGuard,
    children:[
      {
        path: 'categoria',
        name: "Categoria",
        component: Categoria
      },
      {
        path: 'marca',
        name: "Marca",
        component: Marca
      },
      {
        path: 'modelo',
        name: "Modelo",
        component: Modelo
      },
      {
        path: 'caracteristica',
        name: "Caracteristica",
        component: Caracteristica
      },
      {
        path: 'componente',
        name: "ComponenteList",
        component: ComponenteList
      },
      {
        path: 'componente/add',
        name: "ComponenteAdd",
        component: ComponenteAdd
      }
    ]
    //component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
