import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

http.interceptors.request.use((req) => {
  return req;
});

http.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response.status === 400) {
      console.log("Bad request");
    }
    if (err.response.status === 401) {
      console.log("Unauthorized");
    }
    if (err.response.status === 403) {
      console.log("Forbidden");
    }
    if (err.response.status === 404) {
      console.log("Not found");
    }
    if (err.response.status === 500) {
      console.log("Internal server error");
    }
    return Promise.reject(err);
  }
);

export default http;
