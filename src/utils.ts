import { Plugins } from "@capacitor/core";
import Axios from "axios";

export let url = "http://localhost:3333";
let client = Axios.create({
  baseURL: `${url}/api`,
});

client.interceptors.request.use(async (config) => {
  // let token = localStorage.getItem('access_token');
  let { value: token } = await Plugins.Storage.get({ key: "token" });
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export { client };
