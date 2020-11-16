import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/typography.css";
import React from "react";
import { Route } from "react-router-dom";
import "./global.css";
import {
  ExitEdit,
  Exits,
  Home,
  Leave,
  LeaveEdit,
  Login,
  Logout,
  Profile,
} from "./pages";
/* Theme variables */
import "./theme/variables.css";

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet id="main">
        <Route path="/" component={Home} exact={true} />

        <Route path="/login" component={Login} exact={true} />
        <Route path="/logout" component={Logout} exact={true} />
        <Route path="/profile" component={Profile} exact={true} />
        <Route path="/leaves/edit/:id" component={LeaveEdit} exact={true} />
        <Route path="/exits/edit/:id" component={ExitEdit} exact={true} />
        <Route path="/leaves/:id" component={Leave} exact={true} />
        <Route path="/exits/:id" component={Exits} exact={true} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
