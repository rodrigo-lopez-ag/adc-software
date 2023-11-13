/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import * as AccUtils from "../accUtils";
import * as ko from 'knockout';

import 'ojs/ojtable';
import "ojs/ojdialog";
import "ojs/ojformlayout";
import "ojs/ojinputtext";

import ArrayDataProvider = require("ojs/ojarraydataprovider");
import { Constants } from "../utils/constants";
import axios, { AxiosResponse } from "axios";

class DashboardViewModel {
  goalsDataProvider: ArrayDataProvider<Object[], Object>;
  routinesDataProvider: ArrayDataProvider<Object[], Object>;
  kgoals: ko.ObservableArray<Object> = ko.observableArray();
  kroutines: ko.ObservableArray<Object> = ko.observableArray();
  
  readonly routinesColumns: Object[] = [
    { headerText: 'Tipo', field: 'Tipo', id: 'Tipo' },
    { headerText: 'Nombre', field: 'Nombre', id: 'Nombre' },
    { headerText: 'Descripcion', field: 'Descripcion', id: 'Descripcion' },
    { headerText: 'Repeticiones', field: 'Repeticiones', id: 'Repeticiones' },
    { headerText: 'Duracion', field: 'Duracion', id: 'Duracion' },
    { headerText: 'Series', field: 'Series', id: 'Series' }
  ]

  readonly goalsColumns: Object[] = [
    { headerText: 'Descripcion', field: 'DescripcionMeta', id: 'Descripcion' },
  ]

  constructor() {
    this.goalsDataProvider = new ArrayDataProvider([]);
    this.routinesDataProvider = new ArrayDataProvider([]);

    this.loadGoals();
    this.loadRoutines();
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
  };

  /**
   * Optional ViewModel method invoked after the View is inserted into the
   * document DOM.  The application can put logic that requires the DOM being
   * attached here.
   * This method might be called multiple times - after the View is created
   * and inserted into the DOM and after the View is reconnected
   * after being disconnected.
   */
  connected(): void {
    AccUtils.announce("Dashboard page loaded.");
    document.title = "Sistema de gestionamiento de ejercicio";
    // implement further logic if needed
  }

  /**
   * Optional ViewModel method invoked after the View is disconnected from the DOM.
   */
  disconnected(): void {
    // implement if needed
  }

  /**
   * Optional ViewModel method invoked after transition to the new View is complete.
   * That includes any possible animation between the old and the new View.
   */
  transitionCompleted(): void {
    // implement if needed
  }
}

export = DashboardViewModel;
