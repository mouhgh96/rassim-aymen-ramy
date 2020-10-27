import { Plugins } from "@capacitor/core";
import Axios from "axios";

export let url = "http://681b9e3e1d32.ngrok.io";
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
