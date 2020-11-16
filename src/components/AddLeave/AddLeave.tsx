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
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import "./AddLeave.css";

interface Props {
  onSubmit: (data: any) => Promise<void>;
  onReset: () => void;
}
const schema = Yup.object().shape({
  description: Yup.string()
    .trim("Veuillez entrer une description")
    .required("la description est requise"),
  destination: Yup.string()
    .trim("Veuillez entrer une destination")
    .required("la destination est requise"),
  duration: Yup.string()
    .matches(/^[1-9][0-9]*$/, "la duré doit etre plus de 0")

    .required("la duré en jours est requisee"),
  leaveDay: Yup.date()
    .min(
      addDays(Date.now(), 1),
      "le jour doit congé doit au moin commencé demain"
    )
    .required("la jour de congé est requis"),
});
export let AddLeave: React.FC<Props> = ({ onSubmit, onReset }) => {
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
        <IonLabel>Jour de Congé</IonLabel>
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
                  clearErrors();
                }}
                name={props.name}
              />
            );
          }}
          control={control}
          name="leaveDay"
        />
      </IonItem>

      <IonItem>
        <IonLabel position="floating">Durée en jour</IonLabel>
        <Controller
          render={(props) => {
            console.log(props);
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
          name="duration"
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
  );
};
