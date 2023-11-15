import * as ko from 'knockout';
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import { MessageBannerItem, MessageBannerElement } from 'ojs/ojmessagebanner';
import MutableArrayDataProvider = require('ojs/ojmutablearraydataprovider');
import { ojDialog } from "ojs/ojdialog";
import { ojButton } from "ojs/ojbutton";
import "ojs/ojknockout";
import "ojs/ojinputtext";
import "ojs/ojdialog";
import "ojs/ojbutton";
import 'ojs/ojlabelvalue';
import 'ojs/ojtable';
import "ojs/ojformlayout";
import 'ojs/ojmessagebanner';

import { Constants } from "../utils/constants";
import { Goals, Routines } from '../models/responsesInterfaces';
import axios, { AxiosResponse } from "axios";

type DemoMessageBannerItem = MessageBannerItem & {
  id: string;
};

class DashboardViewModel {
  readonly messages: MutableArrayDataProvider<string, DemoMessageBannerItem>;

  goalsDataProvider: ArrayDataProvider<Object[], Object>;
  routinesDataProvider: ArrayDataProvider<Object[], Object>;
  kgoals: ko.ObservableArray<Object> = ko.observableArray();
  kroutines: ko.ObservableArray<Object> = ko.observableArray();

  goalType: ko.Observable<string>;
  goalObjective: ko.Observable<number | undefined>;
  goalDescription: ko.Observable<string>;

  
  readonly routinesColumns: Object[] = [
    { headerText: 'Tipo', field: 'Tipo', id: 'Tipo' },
    { headerText: 'Nombre', field: 'NombreEjercicio', id: 'Nombre' },
    { headerText: 'Descripcion', field: 'Descripcion', id: 'Descripcion' },
    { headerText: 'Repeticiones', field: 'Repeticiones', id: 'Repeticiones' },
    { headerText: 'Duracion', field: 'Duracion', id: 'Duracion' },
    { headerText: 'Series', field: 'Series', id: 'Series' }
  ]

  readonly goalsColumns: Object[] = [
    { headerText: 'Descripcion', field: 'DescripcionMeta', id: 'Descripcion' },
  ]

  constructor() {
    this.messages = new MutableArrayDataProvider([], {
      keyAttributes: 'id'
    });

    this.goalType = ko.observable("");
    this.goalObjective = ko.observable();
    this.goalDescription = ko.observable("");

    this.goalsDataProvider = new ArrayDataProvider([]);
    this.routinesDataProvider = new ArrayDataProvider([]);

    this.loadGoals();
    this.loadRoutines();
  }

  generateRandomId = () => {
    return Math.floor(Math.random() * 1000000) + 1;
  }

  generateUnixTimestamp = () => {
    return new Date().getTime();
  }

  fetchAllRoutines = async(): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await axios.get(Constants.API_BASE_URL + Constants.ROUTINES_PATH);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  fetchAllGoals = async(): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await axios.get(Constants.API_BASE_URL + Constants.GOALS_PATH);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  loadGoals = async (): Promise<void> => {
    const goals = this.fetchAllGoals();
    goals.then(data => {
      data.map((e: any) => {
        const { IDMeta, DescripcionMeta } = e;
        this.kgoals.push({ IDMeta, DescripcionMeta });
      });
    });
    this.goalsDataProvider = new ArrayDataProvider(this.kgoals ,{
      keyAttributes: 'IDMeta'
    });
  }

  loadRoutines = async(): Promise<void> => {
    const routines = this.fetchAllRoutines();
    routines.then(data => {
      data.map((e: any) => {
        const { ID, Tipo, NombreEjercicio, Descripcion, Repeticiones, Duracion, Series } = e;
        this.kroutines.push({ ID, Tipo, NombreEjercicio, Descripcion, Repeticiones, Duracion, Series });
      });
    });
    this.routinesDataProvider = new ArrayDataProvider(this.kroutines ,{
      keyAttributes: 'ID'
    });
  }

  handleApiError = (error: any) => {
    console.error('API Error:', error.message);
  }

  validateGoalPayload = (payload: Goals): boolean => {
    if (typeof payload.TipoMeta !== 'string' || payload.TipoMeta.trim() === '') {
      return false;  
    }

    if (typeof payload.ValorObjetivo !== 'number') {
      return false;
    }

    if (typeof payload.DescripcionMeta !== 'string' || payload.DescripcionMeta.trim() === '') {
      return false;
    }
    return true;
  }

  public addGoal = async(event: ojButton.ojAction) => {
    const id = this.generateRandomId().toString();
    const date = Number(this.generateUnixTimestamp());

    const payload = {
      IDUsuario: '1',
      IDMeta: id,
      ValorObjetivo: Number(this.goalObjective()),
      TipoMeta: this.goalType(),
      DescripcionMeta: this.goalDescription(),
      FechaCreacion: date
    };
    if (this.validateGoalPayload(payload)) {
      const postUrl = Constants.API_BASE_URL + Constants.GOALS_PATH;
      const response: AxiosResponse<any> = await axios.post(postUrl, payload);

      const addedGoal = await response.data;
      console.log(addedGoal);
      this.loadGoals();

      (document.getElementById("modalDialog1") as ojDialog).close();
    } else {
      let data = this.messages.data.slice();
      data.push({ id: 'message', severity: 'error', summary: 'Los campos requeridos no pueden estar vacios'});
      this.messages.data = data;
    }
  }

  public close(event: ojButton.ojAction) {
    (document.getElementById("modalDialog1") as ojDialog).close();
  }

  public open(event: ojButton.ojAction) {
    (document.getElementById("modalDialog1") as ojDialog).open();
  }

  readonly closeMessage = (event: MessageBannerElement.ojClose<string, DemoMessageBannerItem>) => {
    let data = this.messages.data.slice();
    const closeMessageKey = event.detail.key;

    data = data.filter((message) => (message as any).id !== closeMessageKey);
    this.messages.data = data;
  };
}

export = DashboardViewModel;
