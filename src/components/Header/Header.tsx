// import "./Header.scss";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { home, logOut, person } from "ionicons/icons";
import React from "react";
import { useLocation } from "react-router";

export let Header: React.FC = ({ children }) => {
  let location = useLocation();
  console.log(location);
  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>SONATRACH</IonTitle>
        <IonButtons slot="end">
          {location.pathname == "/profile" ? (
            <IonButton href="/">
              <IonIcon slot="icon-only" icon={home} />
            </IonButton>
          ) : (
            <IonButton href="/profile">
              <IonIcon slot="icon-only" icon={person} />
            </IonButton>
          )}
          <IonButton href="/logout">
            <IonIcon slot="icon-only" icon={logOut} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};
