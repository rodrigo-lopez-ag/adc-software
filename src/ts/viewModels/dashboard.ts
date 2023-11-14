import * as ko from 'knockout';
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import { ojDialog } from "ojs/ojdialog";
import { ojButton } from "ojs/ojbutton";
import "ojs/ojknockout";
import "ojs/ojinputtext";
import "ojs/ojdialog";
import "ojs/ojbutton";
import 'ojs/ojvalidationgroup';
import 'ojs/ojlabelvalue';
import 'ojs/ojtable';
import "ojs/ojdialog";
import "ojs/ojformlayout";

import { Constants } from "../utils/constants";
import axios, { AxiosResponse } from "axios";

class DashboardViewModel {
  goalsDataProvider: ArrayDataProvider<Object[], Object>;
  routinesDataProvider: ArrayDataProvider<Object[], Object>;
  kgoals: ko.ObservableArray<Object> = ko.observableArray();
  kroutines: ko.ObservableArray<Object> = ko.observableArray();

  goalType: ko.Observable<string>;
  goalObjective: ko.Observable<string>;
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
    const self = this;
    this.goalType = ko.observable("");
    this.goalObjective = ko.observable("");
    this.goalDescription = ko.observable("");

    this.goalsDataProvider = new ArrayDataProvider([]);
    this.routinesDataProvider = new ArrayDataProvider([]);

    this.loadGoals();
    this.loadRoutines();
  }

  generateRandomId = () => {
    return Math.floor(Math.random() * 1000000) + 1;
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

  public addGoal(event: ojButton.ojAction) {
    console.log(this.goalDescription());
    (document.getElementById("modalDialog1") as ojDialog).close();
  }

  public close(event: ojButton.ojAction) {
    (document.getElementById("modalDialog1") as ojDialog).close();
  }

  public open(event: ojButton.ojAction) {
    (document.getElementById("modalDialog1") as ojDialog).open();
  }
}

export = DashboardViewModel;
