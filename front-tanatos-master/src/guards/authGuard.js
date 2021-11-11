export const authGuard = function(to, from, next){
  try {
    const access_token = JSON.parse(atob(localStorage.getItem("access_token")))
    if(access_token && access_token.token){
      next();
    }else{
      next({name: "Login"})
    }
  } catch (error) {
    localStorage.clear();
    next({name: "Login"})
  }
  
}