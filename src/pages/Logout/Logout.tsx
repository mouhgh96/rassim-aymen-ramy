import { Plugins } from "@capacitor/core";
import { IonSpinner } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { Protected } from "../../components";
import { socket } from "../../components/socket";

export let Logout = () => {
  let [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  useEffect(() => {
    let logout = async () => {
      try {
        await Plugins.Storage.clear();
        setIsLoggedIn(false);
        socket.disconnect();
        // may be add some login to not send a notification when a user is Logged Out
      } catch (error) {
        debugger;
      }
    };
    logout();
  });
  return (
    <Protected>
      {isLoggedIn ? (
        <IonSpinner color="primary" duration={4000} name="circular" />
      ) : (
        <Redirect to="/login" />
      )}
    </Protected>
  );
};
