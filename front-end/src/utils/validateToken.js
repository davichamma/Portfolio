import Cookies from "js-cookie";

export const validateToken = (status) => {
  if (status === 401) {
    sessionStorage.clear();
    Cookies.remove("token");
    window.location.href = "/";
  }
};
