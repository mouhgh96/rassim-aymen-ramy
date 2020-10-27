import { Plugins } from "@capacitor/core";
import React from "react";
import io from "socket.io-client";
import { url } from "../utils";
import { Notification } from "./../model/Notifcation";

let socket = io(url);

let SocketContext = React.createContext(socket);

socket.on("auth", async () => {
  console.log("auth");
  let { value: token } = await Plugins.Storage.get({ key: "token" });
  if (!token) {
    socket.disconnect();
    return;
  }
  socket.emit("auth", { token });
});
socket.on("notif", (payload: any) => {
  console.log("hna", payload);
  notify(payload).then(() => {
    console.log("notification cbn");
  });
});

let notify = async (payload: Notification[]) => {
  let granted = await Plugins.LocalNotifications.requestPermission();
  console.log("hna", granted);
  if (!granted) {
    alert("enable notification ida bghit za3ma");
    return;
  }
  let notifications = payload.map((notif) => ({
    ...notif,
    id: Math.ceil(Math.random() * 100),
  }));
  const notifs = await Plugins.LocalNotifications.schedule({
    notifications,
  });
};

export { socket, SocketContext };
