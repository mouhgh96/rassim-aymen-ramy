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
import { logOut } from "ionicons/icons";
import React from "react";

export let Header: React.FC = ({ children }) => {
  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>pfe</IonTitle>
        <IonButtons slot="end">
          <IonButton href="/logout">
            <IonIcon slot="icon-only" icon={logOut} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};
