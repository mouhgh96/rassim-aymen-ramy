import { Plugins } from "@capacitor/core";
import {
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonText,
} from "@ionic/react";
import { addDays, format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Protected } from "../../components";
import { Leave as LeaveModel } from "../../model";
import { client } from "../../utils";
import "./Leaves.scss";

export const Leave: React.FC = () => {
  let params = useParams();
  let [leave, setLeave] = useState<LeaveModel>();
  let [grade, setGrade] = useState<number>(0);
  let [motif, setMotif] = useState<string>("");
  let [error, setError] = useState<string>("");
  let history = useHistory();
  let [isCancelling, setIsCancelling] = useState<boolean>(false);
  useEffect(() => {
    let fetchLeave = async () => {
      //@ts-ignore
      let response = await client.get(`/leaves/${params.id}`);
      setLeave(response.data);
    };
    fetchLeave();
  }, []);
  useEffect(() => {
    let resolve = async () => {
      //@ts-ignore
      let { value } = await Plugins.Storage.get({ key: "grade" });
      setGrade(value ? +value : 0);
    };
    resolve();
  }, []);
  if (!leave) {
    return (
      <Protected>
        <h1>eber ....</h1>
      </Protected>
    );
  }

  let confirmRequest = async () => {
    setIsCancelling(false);
    //@ts-ignore
    let response = await client.patch(`/leaves/${params.id}`, {
      decision: true,
    });
    setLeave(response.data);
  };
  let cancelRequest = async () => {
    if (!motif.trim()) {
      setError("donnez un motif svp");
      return;
    }
    //@ts-ignore
    let response = await client.patch(`/leaves/${params.id}`, {
      decision: false,
      motif,
    });
    setLeave(response.data);
    history.replace("/");
  };
  let stateText = "En Attente";
  if (leave.state == 1) {
    stateText = "Accepté";
  } else if (leave.state == 2) {
    stateText = "Refusé";
  }
  return (
    <Protected>
      <div className="ion-padding">
        <IonText>
          <h1>Detail de la demande de Congé</h1>
        </IonText>
        <ul className="info">
          <li className="info-item">
            <span className="info-key">Nom:</span>
            <span className="info-value">{leave.user.lastName}</span>
          </li>

          <li className="info-item">
            <span className="info-key">Prenom:</span>
            <span className="info-value">{leave.user.firstName}</span>
          </li>
          <li className="info-item">
            <span className="info-key">fonction:</span>
            <span className="info-value">{leave.user.function}</span>
          </li>
          <li className="info-item">
            <span className="info-key">destination:</span>
            <span className="info-value">{leave.destination}</span>
          </li>
          <li className="info-item">
            <span className="info-key">Date Debut:</span>
            <span className="info-value">
              {format(new Date(leave.leaveDay), "yyyy-MM-dd")}
            </span>
          </li>
          <li className="info-item">
            <span className="info-key">Date Fin:</span>
            <span className="info-value">
              {format(
                addDays(new Date(leave.leaveDay), +leave.duration),
                "yyyy-MM-dd"
              )}
            </span>
          </li>
          <li className="info-item">
            <span className="info-key">Etat:</span>
            <span className={`info-value state state${leave.state}`}>
              {stateText}
            </span>
          </li>
          {leave.motif && (
            <li className="info-item">
              <span className="info-key">motif:</span>
              <span className={`info-value`}>{leave.motif}</span>
            </li>
          )}
        </ul>
        <IonItemDivider />
        <div className="description">{leave.description}</div>
        {grade == 2 && leave.state === 0 && (
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
