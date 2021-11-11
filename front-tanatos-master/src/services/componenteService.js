import axios from "axios"
import { data } from "browserslist";
import { getHeader } from "../config/config";

const url = process.env.VUE_APP_API_URL

export const listar = async function(page,limit){
  let {data} = await axios.get(`${url}/componente?page=${page}&limit=${limit}`, {headers: getHeader()});
  return data;
}

export const guardar = async function(datos){
  let {data} = await axios.post(`${url}/componente`, datos, {headers: getHeader()});
  return data;
}

export const modificar = async function(datos, id){
  let {data} = await axios.put(`${url}/componente/${id}`, datos, {headers: getHeader()});
  return data;
}

export const eliminar = async function(id){
  let {data} = await axios.delete(`${url}/componente/${id}`, {headers: getHeader()});
  return data;
}
