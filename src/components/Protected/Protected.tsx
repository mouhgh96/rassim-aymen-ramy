import { LocalNotificationActionPerformed, Plugins } from "@capacitor/core";
import { IonContent, IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router";
import { Header } from "../Header/Header";
import { socket } from "../socket";

const { Storage, LocalNotifications } = Plugins;
export let Protected: React.FC = ({ children }) => {
  let [isAuth, setIsAuth] = useState<boolean>(true);
  let history = useHistory();
  useEffect(() => {
    let verify = async () => {
      try {
        let { value: token } = await Storage.get({ key: "token" });
        if (!token) {
          setIsAuth(false);
          socket.disconnect();
          return;
        }
        // let { value: grade } = await Storage.get({ key: "grade" });

        LocalNotifications.addListener(
          "localNotificationActionPerformed",
          (action: LocalNotificationActionPerformed) => {
            if (!action.notification.extra) {
              return;
            }
            history.push(action.notification.extra.path || "/");
          }
        );
      } catch (error) {
        setIsAuth(false);
      }
    };
    verify();
  }, []);
  return isAuth ? (
    <IonPage>
      <Header />
      <IonContent>{children}</IonContent>
    </IonPage>
  ) : (
    <Redirect to="/login" />
  );
};
