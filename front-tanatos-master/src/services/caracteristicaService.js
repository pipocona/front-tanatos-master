import axios from "axios"
import { data } from "browserslist";
import { getHeader } from "../config/config";

//const url = "http://127.0.0.1:3000/api"
const url = process.env.VUE_APP_API_URL

export const listar = async function(){
  let {data} = await axios.get(`${url}/caracteristica`, {headers: getHeader()});
  return data;
}

export const guardar = async function(datos){
  let {data} = await axios.post(`${url}/caracteristica`, datos, {headers: getHeader()});
  return data;
}

export const modificar = async function(datos, id){
  let {data} = await axios.put(`${url}/caracteristica/${id}`, datos, {headers: getHeader()});
  return data;
}

export const eliminar = async function(id){
  let {data} = await axios.delete(`${url}/caracteristica/${id}`, {headers: getHeader()});
  return data;
}