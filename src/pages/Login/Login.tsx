import { Plugins } from "@capacitor/core";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
} from "@ionic/react";
import React, { SyntheticEvent, useState } from "react";
import { useHistory } from "react-router";
import { client } from "../../utils";
import "./Login.css";

let { Storage } = Plugins;
export const Login: React.FC = () => {
  let [id, setId] = useState<string>();
  let [password, setPassword] = useState<string>();
  let [error, setError] = useState("");
  let history = useHistory();
  let onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      if (!id) {
        setError("veuillez entrez votre matricule");
        return;
      }
      if (!password) {
        setError("veuillez entrez votre mot de passe");
        return;
      }
      let response = await client.post("/auth/login", {
        id,
        password,
      });
      let { access_token, grade } = response.data;
      await Storage.set({
        key: "token",
        value: access_token,
      });
      await Storage.set({
        key: "grade",
        value: grade,
      });
      history.replace("/profile");
    } catch (error) {
      let response = error.response;
      if (response) {
        if (response.status === 404 || response.status === 401) {
          let error = response.data.error || "";
          setError(error);
        }
      }
      console.log(error);
      // debu
    }
  };
  let handleMatricule = (e: any) => {
    setError("");
    setId(e.target.value);
  };
  let handlePassword = (e: any) => {
    setError("");
    setPassword(e.target.value);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <form className="ion-padding Login" onSubmit={onSubmit}>
          <img src="/assets/logo.svg" alt="" />
          <IonText color="danger" mode="md">
            <p className="Login__error">{error}</p>
          </IonText>
          <IonItem>
            <IonLabel position="floating">Matricle</IonLabel>
            <IonInput value={id} onIonChange={handleMatricule} />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Mot de Passe</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={handlePassword}
            />
          </IonItem>
          <IonButton className="ion-margin-top" type="submit" expand="block">
            Connexion
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};
