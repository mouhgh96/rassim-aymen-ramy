import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";
import { Exit, Leave } from "../../model";
import "./Card.scss";
export let Card: React.FC<(Leave | Exit) & { route: string }> = ({
  id,
  description,
  user: { firstName, lastName },
  state,
  updatedAt,
  route,
}) => {
  let stateText = "En Attente";
  if (state == 1) {
    stateText = "Accepté";
  } else if (state == 2) {
    stateText = "Refusé";
  }
  return (
    <IonCard routerLink={`/${route}/${id}`} className="Card">
      <IonCardHeader>
        <IonCardTitle className="Card__header">
          <p>
            {firstName} {lastName}
          </p>
          <div className={`state state${state}`}>{stateText}</div>
        </IonCardTitle>
        <IonCardSubtitle>
          {formatRelative(new Date(updatedAt), Date.now(), { locale: fr })}
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>{description}</IonCardContent>
    </IonCard>
  );
};
