import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

@Component({
    selector: 'page-step-seven',
    templateUrl: 'step-seven.html'
})
export class StepSevenPage {

    public items: any = [
        {
            name: 'Tiempo de Entrega (días)'
        },
        {
            name: 'Valor Propuesta'
        },
        {
            name: 'Años de Experiencia'
        },
        {
            name: 'Calificación Proveedor en Ormigga.com'
        },
        {
            name: 'Forma de Pago'
        },
        {
            name: 'Calidad del Producto/Servicio'
        }];

    constructor(public _navCtrl: NavController,
        private _dragulaService: DragulaService) {
        _dragulaService.drag.subscribe((val) => {});

        _dragulaService.drop.subscribe((val) => {
            this.onDrop(val[2]);
        });
    }

    onDrop(val: any): void {
        this.items = [];

        val.childNodes.forEach((item) => {
            if (item.id !== undefined) {
                this.items.push({ name: item.id });
            }
        });
    }

    /**
     * Function to go back in step six
     */
    goToStepSix(): void {
        this._navCtrl.pop();
    }

    /**
     * Function to create quotation
     */
    createQuotation(): void {

    }
}