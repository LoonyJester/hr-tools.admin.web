import { Component, TemplateRef, ViewContainerRef, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { AlertType } from "../../common/alerts/alertType";
import { Technology } from "./technology";
import { TechnologyService } from "./services/technology.service";
import { TechnologyComponent } from "./technology.component";
import { AuthService } from '../../common/authorization/services/auth.service';

@Component({
    selector: 'technology-list',
    templateUrl: 'technology-list.template.html',
    providers: [TechnologyService]
})

export class TechnologyListComponent {
    @ViewChild('addTechnologyTarget', { read: ViewContainerRef }) addTechnologyTarget;

    public technologyList: Array<Technology>;
    public alerts: any = [];
    public isInAdd: boolean;
    public isLoading: boolean = true;    

    constructor(private _technologyService: TechnologyService,
        private _authService: AuthService,
        private template: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver) {

        this.getAll();
    }    

    public addRow(): void {
        let factory = this.componentFactoryResolver.resolveComponentFactory(TechnologyComponent);
        let componentRef = this.addTechnologyTarget.createComponent(factory);
        this.isInAdd = true;

        componentRef.instance.operationStarted.subscribe(val => {
            this.isLoading = true;
        });

        componentRef.instance.operationCompleted.subscribe(val => {
            this.onOperationCompleted(val);
            this.addTechnologyTarget.remove();
            this.isInAdd = false;
            this.isLoading = false;
        });

        componentRef.instance.technologyRemoved.subscribe(val => {
            this.addTechnologyTarget.remove();
            this.isInAdd = false;
        });
    }

    public onOperationStarted(): void{
        this.isLoading = true;
    }

    public onOperationCompleted(event: any): void {
        this.showResult(event.wasOperationSucceed, event.message, event.type);

        if (event.wasOperationSucceed) {
            this.getAll();
        }
    }

    public onTechnologyRemoved(): void {
        this.technologyList.pop();
    }

    public onTechnologyDeleted(id: number): boolean {
        let wasDeleted: boolean;

        this._technologyService.delete(id)
            .subscribe(
            response => {
                wasDeleted = response;

                if (wasDeleted) {
                    this.getAll();
                    this.showResult(wasDeleted, "Technology was successfully deleted", AlertType.Success);
                } else {
                    this.showResult(wasDeleted, "Technology was not deleted", AlertType.Error);
                }
            },
            error => this.handleError(error)
            );

        this.getAll();

        return wasDeleted;
    }

    private getAll(): Array<Technology> {
        this._technologyService.getAll()
            .subscribe(response => {
                this.technologyList = response;
                this.isLoading = false;
            }
            , error => this.handleError(error));

        return this.technologyList;
    }

    public isTechnologyListEmpty(): boolean {
        return this.technologyList && this.technologyList.length == 0;
    }

    private handleError(error: any): void {
        let errorMessage: string = "Some error has occured";

        if (error._body) {
            let errorBody = JSON.parse(error._body);
            if(errorBody.Message){
                errorMessage = errorBody.Message;
            }else{
                errorMessage = errorBody;
            }  
        }

        if (error.status == 401) {
            errorMessage = "You don't have permissions to make a request. Please, contact your administrator.";
            this._authService.handleUnauhorizedError();
        }

        this.isLoading = false;
        this.showResult(false, errorMessage, AlertType.Error);
        console.log(error);
    }

    private showResult(wasOperationSucceed: boolean, message: string, type: string) {
        this.isLoading = false;
        
        this.alerts.push({
            type: type,
            msg: message,
            timeout: 4000
        });
    }
}