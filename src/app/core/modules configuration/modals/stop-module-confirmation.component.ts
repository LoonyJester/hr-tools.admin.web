import { Component, ViewChild, EventEmitter, Input } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';

@Component({
    selector: 'stop-confirm',
    templateUrl: 'stop-module-confirmation.template.html',
    outputs: ['canBeStopped']
})

export class StopModuleConfirmationModalComponent {
    @Input() message: string;
    @ViewChild('smModal') childModal: ModalDirective;
    
    public canBeStopped = new EventEmitter<any>();

    private data: any;

    public show(data: any = null): void {
        if (data != null) {
            this.data = data;
        }

        this.childModal.config.backdrop = false; // workaround 
        this.childModal.show();
    }

    public hide(): void {
        this.childModal.hide();
    }

    public stop() {
        this.canBeStopped.emit(this.data);
        this.hide();
    }
}