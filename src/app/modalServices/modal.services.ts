import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
    private modals: any[] = [];
    public modalsData = {};

    add(modal: any) {
        // add modal to array of active modals
        this.modals.push(modal);
    }

    remove(id: string) {
        // remove modal from array of active modals
        this.modals = this.modals.filter(x => x.id !== id);
    }

    open(id: string, data: any = null) {
        // open modal specified by id
        let modal: any = this.modals.filter(x => x.id === id)[0];
        if (modal == null || modal == false) return;
        this.modalsData[id] = data;
        modal.open();
    }

    close(id: string) {
        // close modal specified by id
        let modal: any = this.modals.filter(x => x.id === id)[0];
        modal.close();
    }

    getModalData = (id:string) => {
        const d = this.modalsData[id];
        if (typeof d === 'undefined') return null;
        return d;
    }

    callbackModal = (id:string, toPass:any) => {
        if (this.modalsData[id] && this.modalsData[id].callbackFunction) {
            this.modalsData[id].callbackFunction(toPass);
        }
    }
}