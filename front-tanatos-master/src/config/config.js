export const urlbase = "http://127.0.0.1:3000/api";

export const getHeader = function(){
  const access_token = JSON.parse(atob(localStorage.getItem("access_token")))
  const headers = {
    'Accept': 'application/json',
    'Authorization': "Bearer "+access_token.token
  }
  return headers
}