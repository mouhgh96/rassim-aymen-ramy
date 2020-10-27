import { yupResolver } from "@hookform/resolvers/yup";
import {
  IonButton,
  IonDatetime,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/react";
import { addDays } from "date-fns";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import "./AddExit.scss";

interface Props {
  onSubmit: (data: any) => Promise<void>;
  onReset: () => void;
}
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
export let AddExit: React.FC<Props> = ({ onSubmit, onReset }) => {
  let [exitDay, setExitDaty] = useState<string>(new Date().toISOString());
  let { handleSubmit, control, errors, clearErrors } = useForm({
    resolver: yupResolver(schema),
  });
  let getError = () => {
    if (Object.keys(errors).length < 1) {
      return;
    }
    let [first] = Object.keys(errors);
    return errors[`${first}`]["message"];
  };
  return (
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
            let { onChange, onBlur } = props;
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
            console.log(props);
            let { onChange, onBlur } = props;
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

                  onChange(date.getHours());
                  clearErrors();
                }}
                name={props.name}
                displayFormat="HH"
                pickerFormat="HH"
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
            let { onChange, onBlur } = props;
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

                  onChange(date.getHours());
                  clearErrors();
                }}
                name={props.name}
                displayFormat="HH"
                pickerFormat="HH"
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
          Register
        </IonButton>
      </div>
    </form>
  );
};
