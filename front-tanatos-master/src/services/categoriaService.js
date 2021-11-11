import axios from "axios"
import { data } from "browserslist";
import { getHeader } from "../config/config";

const url = process.env.VUE_APP_API_URL

export const listar = async function(page,limit){
  let {data} = await axios.get(`${url}/categoria?page=${page}&limit=${limit}`, {headers: getHeader()});
  return data;
}

export const listarSelect = async function(){
  let {data} = await axios.get(`${url}/categorias`, {headers: getHeader()});
  return data;
}

export const guardar = async function(datos){
  let {data} = await axios.post(`${url}/categoria`, datos, {headers: getHeader()});
  return data;
}

export const modificar = async function(datos, id){
  let {data} = await axios.put(`${url}/categoria/${id}`, datos, {headers: getHeader()});
  return data;
}

export const eliminar = async function(id){
  let {data} = await axios.delete(`${url}/categoria/${id}`, {headers: getHeader()});
  return data;
}
