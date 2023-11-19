import * as ko from 'knockout';
import ArrayDataProvider = require('ojs/ojarraydataprovider');
import MutableArrayDataProvider = require('ojs/ojmutablearraydataprovider');
import { MessageBannerItem, MessageBannerElement } from 'ojs/ojmessagebanner';
import { ojDialog } from "ojs/ojdialog";
import { ojButton } from "ojs/ojbutton";
import { KeySetImpl } from 'ojs/ojkeyset';
import "ojs/ojknockout";
import "ojs/ojselectsingle";
import "ojs/ojinputtext";
import "ojs/ojdialog";
import "ojs/ojbutton";
import 'ojs/ojlabelvalue';
import 'ojs/ojtable';
import "ojs/ojformlayout";
import 'ojs/ojmessagebanner';

import { Constants } from '../utils/constants';
import axios, { AxiosResponse } from 'axios';

type DemoMessageBannerItem = MessageBannerItem & {
    id: string;
};

class NotificationsViewModel {
    notificationProvider: ArrayDataProvider<Object[], Object>;
    periodsProvider: ArrayDataProvider<Object[], Object>;
    
    readonly selectedItems = ko.observable({
        row: new KeySetImpl()
    });
    readonly messages: MutableArrayDataProvider<string, DemoMessageBannerItem>;
    
    knotifications: ko.ObservableArray<Object>;
    notificationDescription: ko.Observable<string>;
    notificationPeriod: ko.Observable<string>;
    notificationValue: ko.Observable<number | undefined>;

    readonly notificationsColumns: Object[] = [
        { headerText: 'Descripcion', field: 'Descripcion', id: 'Descripcion' }
    ]

    private readonly periods = [
        { value: 'daily', label: 'Diario' },
        { value: 'weekly', label: 'Semanal' },
        { value: 'monthly', label: 'Mensual' },
    ]

    constructor() {
        this.messages = new MutableArrayDataProvider([], {
            keyAttributes: 'id'
        });
        this.notificationProvider = new ArrayDataProvider([]);
        this.periodsProvider = new ArrayDataProvider(this.periods, {
            keyAttributes: 'value'
        });
        this.knotifications = ko.observableArray();
        this.notificationDescription = ko.observable("");
        this.notificationPeriod = ko.observable("");
        this.notificationValue = ko.observable();

        this.loadNotifications();
    }

    postNotification = async(payload: any): Promise<any> => {
        const postUrl = Constants.API_BASE_URL + Constants.NOTIFICATIONS_PATH;
        const response: AxiosResponse<any> = await axios.post(postUrl, payload);
        return response.data;
    }

    fetchNotifications = async(): Promise<any> => {
        try {
            const response: AxiosResponse<any> = await axios.get(Constants.API_BASE_URL + Constants.NOTIFICATIONS_PATH);
            return response.data;
        } catch (error) {
            this.handleApiError(error);
            throw error;
        }
    }

    handleApiError = (error: any) => {
        console.error('API Error:', error.message);
    }

    loadNotifications = async(): Promise<void> => {
        this.knotifications([]);
        const notifications = this.fetchNotifications();
        notifications.then(data => {
            data.map((e: any) => {
                const { created, Descripcion, Periodo, Valor, objectId } = e;
                this.knotifications.push({ created, Descripcion, Periodo, Valor, objectId });
            }); 
        });
        this.notificationProvider = new ArrayDataProvider(this.knotifications, {
            keyAttributes: 'created'
        });
        console.log(this.knotifications());
    }

    generateRandomId = () => {
        return Math.floor(Math.random() * 1000000) + 1;
    }

    generateUnixTimestamp = () => {
        return new Date().getTime();
    }

    public updateNotifications = async(event: CustomEvent) => {

    }

    public addNotification = async(event: ojButton.ojAction) => {
        const id = this.generateRandomId().toString();
        const date = Number(this.generateUnixTimestamp());
    }

    public open = (event: ojButton.ojAction) => {
        (document.getElementById("modalDialog") as ojDialog).open();
    }

    public close = (event: ojButton.ojAction) => {
        (document.getElementById("modalDialog") as ojDialog).close();
        this.clearSelection();
    }

    readonly closeMessages = (event: MessageBannerElement.ojClose<string, DemoMessageBannerItem>) => {
        let data = this.messages.data.slice();
        const closeMessageKey = event.detail.key;

        data = data.filter((message) => (message as any).id !== closeMessageKey);
        this.messages.data = data;
    }

    private clearSelection = () => {
        this.selectedItems({ row: new KeySetImpl() });
    }
}

export = NotificationsViewModel;