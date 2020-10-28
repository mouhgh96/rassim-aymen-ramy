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
import "./LeaveEdit.scss";

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
    .required("la description est requise"),
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
export let LeaveEdit: React.FC<Props> = () => {
  let params = useParams();
  let history = useHistory();
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
    let response = await client.put(`/leaves/${params.id}`, data);
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
      let response = await client.get(`/leaves/${params.id}`);
      Object.keys(response.data).forEach((key) =>
        setValue(key, response.data[key], { shouldDirty: true })
      );
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
  // if (loading) {
  //   return (
  //     <Protected>
  //       <div className="spinner">
  //         <IonSpinner color="primary" />
  //       </div>
  //     </Protected>
  //   );
  // }

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
              console.log(props);
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
                  value={value}
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
      <IonToast
        color="primary"
        isOpen={success}
        // onDidDismiss={() => setShowToast1(false)}
        message="Votre Congé à etait modifé"
        duration={1500}
      />
    </Protected>
  );
};
