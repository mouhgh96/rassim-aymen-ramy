import { Plugins } from "@capacitor/core";
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
} from "@ionic/react";
import { format, isAfter } from "date-fns";
import { pencil } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Protected } from "../../components";
import { Exit } from "../../model";
import { client } from "../../utils";
import "./Exits.css";

export const Exits: React.FC = () => {
  let params = useParams();
  let [exit, setExit] = useState<Exit>();
  let [grade, setGrade] = useState<number>(0);
  let [motif, setMotif] = useState<string>("");
  let [error, setError] = useState<string>("");
  let history = useHistory();
  let [isCancelling, setIsCancelling] = useState<boolean>(false);
  useEffect(() => {
    let fetchExit = async () => {
      //@ts-ignore
      let response = await client.get(`/exits/${params.id}`);
      setExit(response.data);
    };
    fetchExit();
  }, []);
  useEffect(() => {
    let resolve = async () => {
      //@ts-ignore
      let { value } = await Plugins.Storage.get({ key: "grade" });
      setGrade(value ? +value : 0);
    };
    resolve();
  }, []);
  if (!exit) {
    return (
      <Protected>
        <h1>eber ....</h1>
      </Protected>
    );
  }

  let confirmRequest = async () => {
    setIsCancelling(false);
    //@ts-ignore
    let response = await client.patch(`/exits/${params.id}`, {
      decision: true,
    });
    setExit(response.data);
  };
  let cancelRequest = async () => {
    if (!motif.trim()) {
      setError("donnez un motif svp");
      return;
    }
    //@ts-ignore
    let response = await client.patch(`/exits/${params.id}`, {
      decision: false,
      motif,
    });
    setExit(response.data);
    history.replace("/");
    debugger;
  };
  let stateText = "En Attente";
  if (exit.state == 1) {
    stateText = "Accepté";
  } else if (exit.state == 2) {
    stateText = "Refusé";
  }
  let editable: boolean =
    exit.state == 0 &&
    grade !== 2 &&
    isAfter(new Date(exit.exitDay), Date.now());
  return (
    <Protected>
      <div className="ion-padding">
        <div className="detail_header">
          <h1>Detail de la demande de Sortie</h1>
          {editable && (
            <IonButton
              routerLink={`/exits/edit/${exit.id}`}
              className="ion-margin-start"
            >
              <IonIcon
                slot="icon-only"
                icon={pencil}
                className="ion-margin-horizontal"
              />
            </IonButton>
          )}
        </div>
        <ul className="info">
          <li className="info-item">
            <span className="info-key">Nom:</span>
            <span className="info-value">{exit.user.lastName}</span>
          </li>

          <li className="info-item">
            <span className="info-key">Prenom:</span>
            <span className="info-value">{exit.user.firstName}</span>
          </li>
          <li className="info-item">
            <span className="info-key">fonction:</span>
            <span className="info-value">{exit.user.function}</span>
          </li>
          <li className="info-item">
            <span className="info-key">destination:</span>
            <span className="info-value">{exit.destination}</span>
          </li>
          <li className="info-item">
            <span className="info-key">Date Debut:</span>
            <span className="info-value">
              {format(new Date(exit.exitDay), "yyyy-MM-dd")}
            </span>
          </li>
          <li className="info-item">
            <span className="info-key">Heure de Sortie:</span>
            <span className="info-value">{exit.exitHour}</span>
          </li>
          <li className="info-item">
            <span className="info-key">Heure d'Entré:</span>
            <span className="info-value">{exit.returnHour}</span>
          </li>
          <li className="info-item">
            <span className="info-key">Etat:</span>
            <span className={`info-value state state${exit.state}`}>
              {stateText}
            </span>
          </li>
          {exit.motif && (
            <li className="info-item">
              <span className="info-key">motif:</span>
              <span className={`info-value`}>{exit.motif}</span>
            </li>
          )}
        </ul>
        <IonItemDivider />
        <div className="description">{exit.description}</div>
        {grade == 2 && exit.state === 0 && (
          <div className="btn-actions">
            <button
              className="cancel"
              onClick={() => setIsCancelling((old) => !old)}
            >
              {!isCancelling ? "Refuser" : "Annuler"}
            </button>
            <button className="confirm" onClick={confirmRequest}>
              Accepter
            </button>
          </div>
        )}
      </div>
      {isCancelling && (
        <>
          <IonItem>
            <IonLabel position="floating">Motif</IonLabel>
            <IonInput
              onIonChange={(e) => {
                setError("");
                setMotif(e.detail.value || "");
              }}
              placeholder="Donnez un motif de refus"
            />
          </IonItem>
          <div className="refus">
            <button className="submit_cancel" onClick={cancelRequest}>
              confirmer
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </>
      )}
    </Protected>
  );
};
