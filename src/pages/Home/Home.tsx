import { Plugins } from "@capacitor/core";
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { add } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { AddExit, AddLeave, Card, Protected } from "../../components";
import { Exit, Leave } from "../../model";
import { client } from "../../utils";
import "./Home.css";

export const Home: React.FC = () => {
  let [leaves, setLeaves] = useState<Leave[]>([]);
  let [exits, setExits] = useState<Exit[]>([]);
  let [selected, setSelected] = useState<string>("leaves");
  let [isAdding, setIsAdding] = useState<boolean>(false);
  let [grade, setGrade] = useState<number>(0);
  let fetchLeaves = async () => {
    let response = await client.get("/leaves");
    setLeaves(response.data);
  };
  let fetchExits = async () => {
    let response = await client.get("/exits");
    setExits(response.data);
  };
  let submitLeave = async (data: any) => {
    try {
      let response = await client.post("/leaves", data);
      setIsAdding(false);
      setLeaves((old) => [{ ...response.data }, ...old]);
    } catch (error) {
      debugger;
    }
  };
  let submitExit = async (data: Exit) => {
    try {
      let response = await client.post("/exits", data);
      setIsAdding(false);
      setExits((old) => [{ ...response.data }, ...old]);
    } catch (error) {
      debugger;
    }
  };
  useEffect(() => {
    let getGrade = async () => {
      let { value } = await Plugins.Storage.get({ key: "grade" });
      setGrade(value ? +value : 0);
    };

    getGrade();
  }, []);
  useEffect(() => {
    if (selected === "leaves") {
      fetchLeaves();
    } else {
      fetchExits();
    }
  }, [selected, isAdding]);
  let toggle = (
    <div className="toggle">
      <button
        onClick={() => setSelected("leaves")}
        className={selected === "leaves" ? "selected" : ""}
        title="Toggle iOS mode"
      >
        Congé
      </button>
      <button
        onClick={() => setSelected("exits")}
        title="Toggle Android mode"
        className={selected === "exits" ? "selected" : ""}
      >
        Sortie
      </button>
    </div>
  );
  let onReset = () => {
    setIsAdding(false);
  };
  if (isAdding) {
    return (
      <Protected>
        <IonContent>
          {toggle}
          {selected === "leaves" ? (
            <AddLeave onSubmit={submitLeave} onReset={onReset} />
          ) : (
            <AddExit onSubmit={submitExit} onReset={onReset} />
          )}
        </IonContent>
      </Protected>
    );
  }

  return (
    <Protected>
      <IonContent>
        <IonRefresher
          slot="fixed"
          onIonRefresh={async (event) => {
            await fetchLeaves();
            event.detail.complete();
          }}
        >
          <IonRefresherContent />
        </IonRefresher>
        {toggle}
        {selected === "leaves"
          ? leaves?.map((leave: Leave) => (
              <Card key={leave.id} {...leave} route="leaves" />
            ))
          : exits?.map((exit: Exit) => (
              <Card key={exit.id} {...exit} route="exits" />
            ))}

        {grade < 2 && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => setIsAdding(true)}>
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </IonFab>
        )}
      </IonContent>
    </Protected>
  );
};
