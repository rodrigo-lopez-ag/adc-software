import * as ko from 'knockout';
import * as data from "text!../models/test.json";
import ArrayDataProvider = require('ojs/ojarraydataprovider');
import "ojs/ojknockout";
import "ojs/ojchart";

import { Constants } from '../utils/constants';
import axios, { AxiosResponse } from 'axios';

class MetricsViewModel {
    dataProvider: ArrayDataProvider<any, any>;
    metrics: ko.ObservableArray<Object>;
    json: string;
    
    constructor() {
        this.json = "";
        this.metrics = ko.observableArray<Object>([]);
        this.loadMetrics();
        this.dataProvider = new ArrayDataProvider(JSON.parse(data), {
            keyAttributes: 'id'
        });
        const jsonarray = JSON.stringify(this.metrics());
        console.log(jsonarray);
    }

    loadMetrics = async() => {
        const metrics = await this.fetchProgress();
        let id = 0;
        metrics.map((e: any) => {
            if (e.IDMeta === "000001") {
                const n = this.unixToXValues(e.FechaRegistro);
                this.metrics.push({ id: id++, series: 'Serie 1', group: 'Grupo A', x: n, y: e.ValorActual });
            }
        });
        const jsonarray = JSON.stringify(this.metrics());
        console.log(this.metrics());
    }

    unixToXValues = (timestamp: number): number => {
        return Math.floor(timestamp) / 1000;
    }

    fetchProgress = async() => {
        try {
            const response: AxiosResponse<any> = await axios.get(Constants.API_BASE_URL + Constants.PROGRESS_PATH);
            return response.data;
        } catch (error) {
            this.handleApiError(error);
            throw error;
        }
    }

    handleApiError = (error: any) => {
        console.error('API Error:', error.message);
    }
}

export = MetricsViewModel;