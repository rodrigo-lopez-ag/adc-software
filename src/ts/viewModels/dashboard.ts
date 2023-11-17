import * as ko from 'knockout';
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import MutableArrayDataProvider = require('ojs/ojmutablearraydataprovider');
import { MessageBannerItem, MessageBannerElement } from 'ojs/ojmessagebanner';
import { ojDialog } from "ojs/ojdialog";
import { ojButton } from "ojs/ojbutton";
import { KeySetImpl } from 'ojs/ojkeyset';
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
  readonly selectedItems = ko.observable({
    row: new KeySetImpl()
  });
  readonly messagesGoals: MutableArrayDataProvider<string, DemoMessageBannerItem>;
  readonly messagesRoutines: MutableArrayDataProvider<string, DemoMessageBannerItem>;

  goalsDataProvider: ArrayDataProvider<Object[], Object>;
  routinesDataProvider: ArrayDataProvider<Object[], Object>;
  kgoals: ko.ObservableArray<Object> = ko.observableArray();
  kroutines: ko.ObservableArray<Object> = ko.observableArray();
  key: ko.Observable<string>;

  goalType: ko.Observable<string>;
  goalObjective: ko.Observable<number | undefined>;
  goalDescription: ko.Observable<string>;

  routineName: ko.Observable<string>;
  routineDescription: ko.Observable<string>;
  routineType: ko.Observable<string>;
  routineDuration: ko.Observable<number | undefined>;
  routineReps: ko.Observable<number | undefined>;
  routineSeries: ko.Observable<number | undefined>;
  
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
    this.messagesGoals = new MutableArrayDataProvider([], {
      keyAttributes: 'id'
    });
    this.messagesRoutines = new MutableArrayDataProvider([], {
      keyAttributes: 'id'
    });
    this.key = ko.observable("");

    this.goalType = ko.observable("");
    this.goalObjective = ko.observable();
    this.goalDescription = ko.observable("");

    this.routineName = ko.observable("");
    this.routineDescription = ko.observable("");
    this.routineType = ko.observable("");
    this.routineDuration = ko.observable();
    this.routineReps = ko.observable();
    this.routineSeries = ko.observable();

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

  postGoal = async(payload: Goals): Promise<any> => {
    const postUrl = Constants.API_BASE_URL + Constants.GOALS_PATH;
    const response: AxiosResponse<any> = await axios.post(postUrl, payload);
    return response.data;
  };

  postRoutine = async(payload: Routines): Promise<any> => {
    const postUrl = Constants.API_BASE_URL + Constants.ROUTINES_PATH;
    const response: AxiosResponse<any> = await axios.post(postUrl, payload);
    return response.data;
  };

  loadGoals = async (): Promise<void> => {
    const goals = this.fetchAllGoals();
    goals.then(data => {
      data.map((e: any) => {
        const { IDMeta, DescripcionMeta, ValorObjetivo, TipoMeta, objectId } = e;
        this.kgoals.push({ IDMeta, DescripcionMeta, ValorObjetivo, TipoMeta, objectId });
      });
    });
    this.goalsDataProvider = new ArrayDataProvider(this.kgoals ,{
      keyAttributes: 'IDMeta'
    });
    this.clearGoalFields();
  }

  loadRoutines = async(): Promise<void> => {
    const routines = this.fetchAllRoutines();
    routines.then(data => {
      data.map((e: any) => {
        const { ID, Tipo, NombreEjercicio, Descripcion, Repeticiones, Duracion, Series, objectId } = e;
        this.kroutines.push({ ID, Tipo, NombreEjercicio, Descripcion, Repeticiones, Duracion, Series, objectId });
      });
    });
    this.routinesDataProvider = new ArrayDataProvider(this.kroutines ,{
      keyAttributes: 'ID'
    });
    this.clearRoutineFields();
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
      IDMeta: id,
      IDUsuario: '1',
      ValorObjetivo: Number(this.goalObjective()),
      TipoMeta: this.goalType(),
      DescripcionMeta: this.goalDescription(),
      FechaCreacion: date
    };
    if (this.validateGoalPayload(payload)) {
      this.postGoal(payload);
      this.loadGoals();
      (document.getElementById("modalDialog1") as ojDialog).close();
    } else {
      let data = this.messagesGoals.data.slice();
      data.push({ id: 'message', severity: 'error', summary: 'Los campos requeridos no pueden estar vacios'});
      this.messagesGoals.data = data;
    }
  }

  public addRoutine = async(event: ojButton.ojAction) => {
    const id = this.generateRandomId().toString();
    
    const payload = {
      ID: id,
      IDUsuario: '1',
      NombreEjercicio: this.routineName(),
      Descripcion: this.routineDescription(),
      Tipo: this.routineType(),
      Duracion: Number(this.routineDuration()),
      Repeticiones: Number(this.routineReps()),
      Series: Number(this.routineSeries())
    };
    if (this.validateRoutinelPayload(payload)) {
      const response = this.postRoutine(payload);
      console.log(response);
      this.loadRoutines();
      (document.getElementById("modalDialog2") as ojDialog).close();
    } else {
      let data = this.messagesRoutines.data.slice();
      data.push({ id: 'message', severity: 'error', summary: 'Los campos requeridos no pueden estar vacios'});
      this.messagesRoutines.data = data;
    }
  }

  validateRoutinelPayload = (payload: Routines): boolean => {
    if (typeof payload.NombreEjercicio !== 'string' || payload.NombreEjercicio.trim() === '') {
      return false;  
    }
    if (typeof payload.Descripcion !== 'string' || payload.Descripcion.trim() === '') {
      return false;
    }
    if (typeof payload.Tipo !== 'string' || payload.Tipo.trim() === '') {
      return false;
    }
    return true;
  }

  public close1 = (event: ojButton.ojAction) => {
    (document.getElementById("modalDialog1") as ojDialog).close();
    this.clearSelection();
  }

  public open1 = (event: ojButton.ojAction) => {
    this.clearGoalFields();
    (document.getElementById("modalDialog1") as ojDialog).open();
  }

  public close2 = (event: ojButton.ojAction) => {
    (document.getElementById("modalDialog2") as ojDialog).close();
    this.clearSelection();
  }

  public open2 = (event: ojButton.ojAction) => {
    this.clearRoutineFields();
    (document.getElementById("modalDialog2") as ojDialog).open();
  }

  public updateGoals = async(event: CustomEvent) => {
    const { key } = event.detail.context;
    this.key(key);
    let id = "";
    this.kgoals().map((e: any) => {
      if (key === e.IDMeta) {
        const { TipoMeta, ValorObjetivo, DescripcionMeta, objectId } = event.detail.context.data;
        this.goalType(TipoMeta);
        this.goalObjective(ValorObjetivo);
        this.goalDescription(DescripcionMeta);
        id = objectId;
      }
    });
    const payload = {
      ValorObjetivo: this.goalObjective(),
      TipoMeta: this.goalType(),
      DescripcionMeta: this.goalDescription()
    };

    // const payload = {
    //   IDMeta: id,
    //   IDUsuario: '1',
    //   ValorObjetivo: Number(this.goalObjective()),
    //   TipoMeta: this.goalType(),
    //   DescripcionMeta: this.goalDescription(),
    //   FechaCreacion: date
    // };
    (document.getElementById("modalDialog1") as ojDialog).open();
  }

  public updateRoutines = (event: CustomEvent) => {
    const { key } = event.detail.context;
    this.key(key);
    this.kroutines().map((e: any) => {
      if (key === e.ID) {
        const { Tipo, NombreEjercicio, Descripcion, Repeticiones, Duracion, Series, objectId } = e
        this.routineDescription(Descripcion);
        this.routineDuration(Duracion);
        this.routineName(NombreEjercicio);
        this.routineReps(Repeticiones)
        this.routineType(Tipo);
        this.routineSeries(Series);
      }
    });

    (document.getElementById("modalDialog2") as ojDialog).open();
  }

  private updateGoalByObjectId = async(payload: any, objectId: string): Promise<void> => {
    const url = Constants.API_BASE_URL + Constants.GOALS_PAHT_OBJECTID(objectId);
    const response: AxiosResponse<any> = await axios.put(url, payload);
    return response.data;
  }

  public clearSelection = () => {
    this.selectedItems({ row: new KeySetImpl() });
  }

  public clearGoalFields = () => {
    this.goalType("");
    this.goalObjective(undefined);
    this.goalDescription("");
  }

  public clearRoutineFields = () => {
    this.routineName("");
    this.routineDescription("");
    this.routineType("");
    this.routineDuration(undefined);
    this.routineReps(undefined);
    this.routineSeries(undefined);
  }

  readonly closeMessageGoals = (event: MessageBannerElement.ojClose<string, DemoMessageBannerItem>) => {
    let data = this.messagesGoals.data.slice();
    const closeMessageKey = event.detail.key;

    data = data.filter((message) => (message as any).id !== closeMessageKey);
    this.messagesGoals.data = data;
  }

  readonly closeMessageRoutines = (event: MessageBannerElement.ojClose<string, DemoMessageBannerItem>) => {
    let data = this.messagesRoutines.data.slice();
    const closeMessageKey = event.detail.key;

    data = data.filter((message) => (message as any).id !== closeMessageKey);
    this.messagesRoutines.data = data;
  }
}

export = DashboardViewModel;
