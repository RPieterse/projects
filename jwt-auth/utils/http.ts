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

http.interceptors.response.use((res) => {
  if (res.status === 400) {
    console.log("Bad request");
  }
  if (res.status === 401) {
    console.log("Unauthorized");
  }
  if (res.status === 403) {
    console.log("Forbidden");
  }
  if (res.status === 404) {
    console.log("Not found");
  }
  if (res.status === 500) {
    console.log("Internal server error");
  }
  return res;
});

export default http;
