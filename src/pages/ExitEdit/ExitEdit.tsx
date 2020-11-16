import { yupResolver } from "@hookform/resolvers/yup";
import {
  IonButton,
  IonDatetime,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonToast,
} from "@ionic/react";
import { addDays } from "date-fns";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import * as Yup from "yup";
import { Protected } from "../../components";
import { client } from "../../utils";
import "./ExitEdit.css";

const schema = Yup.object().shape({
  exitHour: Yup.number()
    .integer("Veuillez entrer une description")
    .min(8, "l'heure de sortie doit etre entre 8h et 14h")
    .max(16, "l'heure de sortie doit etre entre 8h et 14h")
    .required("l'heure de sorite est requise"),
  returnHour: Yup.number()
    .integer("Veuillez entrer une description")
    .min(8, "l'heure d'entrée doit etre entre 8h et 14h")
    .max(16, "l'heure d'entrée doit etre entre 8h et 16h")
    .moreThan(
      Yup.ref("exitHour"),
      "l'heure de retour doit etre superieur à l'heure de sorte"
    )
    .required("l'heure d'entrée est requise"),
  destination: Yup.string().trim().required("une destination est requise"),
  description: Yup.string().trim().required("une description est requise"),
  exitDay: Yup.date()
    .min(addDays(Date.now(), 1))
    .required("le jour de sortie est requis"),
});
export let ExitEdit: React.FC = () => {
  let params = useParams();
  let history = useHistory();
  let [exitDay, setExitDaty] = useState<string>(new Date().toISOString());
  let [exitHour, setExitHour] = useState<string>(new Date().toISOString());
  let [returnHour, setReturnHour] = useState<string>(new Date().toISOString());
  let [success, setSuccess] = useState<boolean>(false);
  let [loading, setLoading] = useState<boolean>(true);
  let {
    handleSubmit,
    control,
    errors,
    clearErrors,
    setValue,
    formState,
  } = useForm({
    resolver: yupResolver(schema),
  });
  let onSubmit = async (data: any) => {
    debugger;

    //@ts-ignore
    let response = await client.put(`/exits/${params.id}`, data);
    setSuccess(true);
    setTimeout(() => {
      history.replace("/");
    }, 1400);
  };
  let onReset = async (data: any) => {
    debugger;
    history.replace("/");
  };
  useEffect(() => {
    let fetchLeave = async () => {
      //@ts-ignore
      let response = await client.get(`/exits/${params.id}`);
      let tmp = new Date();
      Object.keys(response.data).forEach((key) => {
        if (key === "exitHour") {
          tmp.setHours(response.data[key]);
          setExitHour(tmp.toISOString());
        }
        if (key === "returnHour") {
          tmp.setHours(response.data[key]);
          setReturnHour(tmp.toISOString());
        }
        setValue(key, response.data[key], { shouldDirty: true });
      });
      setLoading(false);
    };
    fetchLeave();
  }, []);

  let getError = () => {
    if (Object.keys(errors).length < 1) {
      return;
    }
    let [first] = Object.keys(errors);
    //@ts-ignore
    return errors[`${first}`]["message"];
  };

  return (
    <Protected>
      <form
        className="ion-padding AddLeave"
        onSubmit={handleSubmit(onSubmit)}
        onReset={onReset}
      >
        <IonText color="danger" mode="md" className="ion-text-center">
          <h3>{getError()}</h3>
        </IonText>
        <IonItem>
          <IonLabel position="floating">description</IonLabel>
          <Controller
            render={(props) => {
              let { onChange, onBlur, value } = props;
              return (
                <IonInput
                  onBlur={onBlur}
                  onIonChange={(e) => {
                    onChange(e.detail.value);
                    clearErrors();
                  }}
                  name={props.name}
                  value={value}
                />
              );
            }}
            control={control}
            name="description"
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">destination</IonLabel>
          <Controller
            render={(props) => {
              let { onChange, onBlur, value } = props;
              return (
                <IonInput
                  onBlur={onBlur}
                  onIonChange={(e) => {
                    onChange(e.detail.value);
                    clearErrors();
                  }}
                  name={props.name}
                  value={value}
                />
              );
            }}
            control={control}
            name="destination"
          />
        </IonItem>

        <IonItem>
          <IonLabel>Jour de Sortie</IonLabel>
          <Controller
            render={(props) => {
              console.log(props);
              let { onChange, onBlur, value } = props;
              return (
                <IonDatetime
                  min={new Date(addDays(Date.now(), 1)).toISOString()}
                  placeholder="Sectioner le jour"
                  onBlur={onBlur}
                  onIonChange={(e) => {
                    onChange(e.detail.value);
                    setExitDaty(e.detail.value || exitDay);

                    clearErrors();
                  }}
                  name={props.name}
                  value={value}
                />
              );
            }}
            control={control}
            name="exitDay"
          />
        </IonItem>

        <IonItem>
          <IonLabel>Heure de Sortie</IonLabel>
          <Controller
            render={(props) => {
              let { onChange, onBlur, value } = props;
              return (
                <IonDatetime
                  min={new Date("2020-10-28T09:00:00").toISOString()}
                  max={new Date("2020-10-28T17:00:00").toISOString()}
                  placeholder="Sectioner l'heure"
                  onBlur={onBlur}
                  onIonChange={(e) => {
                    let date = new Date(
                      e.detail.value ?? new Date().toISOString()
                    );
                    setExitHour(e.detail.value ?? "");

                    onChange(date.getHours());
                    clearErrors();
                  }}
                  name={props.name}
                  displayFormat="HH"
                  pickerFormat="HH"
                  value={exitHour}
                />
              );
            }}
            control={control}
            name="exitHour"
          />
        </IonItem>
        <IonItem>
          <IonLabel>Heure d' Entrée</IonLabel>
          <Controller
            render={(props) => {
              console.log(props);
              let { onChange, onBlur, value } = props;
              return (
                <IonDatetime
                  min={new Date("2020-10-28T09:00:00").toISOString()}
                  max={new Date("2020-10-28T17:00:00").toISOString()}
                  placeholder="Sectioner l'heure"
                  onBlur={onBlur}
                  onIonChange={(e) => {
                    let date = new Date(
                      e.detail.value ?? new Date().toISOString()
                    );
                    setReturnHour(e.detail.value ?? "");
                    onChange(date.getHours());
                    clearErrors();
                  }}
                  name={props.name}
                  displayFormat="HH"
                  pickerFormat="HH"
                  value={returnHour}
                />
              );
            }}
            control={control}
            name="returnHour"
          />
        </IonItem>

        <div className="btn-group">
          <IonButton
            type="reset"
            className="ion-margin-top"
            size="large"
            color="light"
          >
            Annuler
          </IonButton>
          <IonButton type="submit" className="ion-margin-top" size="large">
            Confirmer
          </IonButton>
        </div>
      </form>
      <IonToast
        color="primary"
        isOpen={success}
        // onDidDismiss={() => setShowToast1(false)}
        message="Votre Sortie à etait modifé"
        duration={1500}
      />
    </Protected>
  );
};
