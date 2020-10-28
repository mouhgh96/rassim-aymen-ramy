import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSpinner,
  IonText,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { Protected } from "../../components";
import { client } from "../../utils";
export interface Me {
  firstName: string;
  lastName: string;
  function: string;
  tel: string;
  email: string;
  id: string;
}
export let Profile: React.FC = () => {
  let [me, setMe] = useState<Me>();

  useEffect(() => {
    let fetchMe = async () => {
      let response = await client.get<Me>("/users/me");
      setMe(response.data);
    };
    fetchMe();
  }, []);
  if (!me) {
    return (
      <Protected>
        <div className="spinner">
          <IonSpinner color="primary" />
        </div>
      </Protected>
    );
  }
  return (
    <Protected>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            {me.firstName} {me.lastName}
          </IonCardTitle>
          <IonCardSubtitle>{me.function}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            <IonListHeader>Vos Information</IonListHeader>
            <IonItem>
              <IonText slot="start">Matricule</IonText>
              <IonLabel>
                <p>{me.id}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonText slot="start">Prenom</IonText>
              <IonLabel>
                <p>{me.firstName}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonText slot="start">Famille</IonText>
              <IonLabel>
                <p>{me.lastName}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonText slot="start">Fonction</IonText>
              <IonLabel>
                <p>{me.function}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonText slot="start">Numero</IonText>
              <IonLabel>
                <p>{me.tel}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonText slot="start">Email</IonText>
              <IonLabel>
                <p>{me.email}</p>
              </IonLabel>
            </IonItem>
          </IonList>
        </IonCardContent>
      </IonCard>
    </Protected>
  );
};
