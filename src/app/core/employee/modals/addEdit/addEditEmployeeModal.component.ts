import { Component, ViewChild, EventEmitter, NgModule, Input } from '@angular/core';
import { Employee } from '../../employee';
import { Status } from '../../../common/status.enum';
import { EmployeeService } from '../../services/employee.service';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { FileItem } from 'ng2-file-upload/file-upload/file-item.class.d';
import { NgClass, NgStyle } from '@angular/common';
import { FaComponent } from 'angular2-fontawesome/components';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDirective } from 'ng2-bootstrap';
import { CompleterService, CompleterData } from 'ng2-completer';
import { ImageResizer } from '../../../../common/files/ImageResizer';
import { UrlHelper } from "../../../../common/company/urlHelper";
import { AuthService } from "../../../../common/authorization/services/auth.service";
import * as moment from 'moment';

@Component({
    selector: 'add-edit-employee',
    templateUrl: 'addEditEmployeeModal.template.html',
    styleUrls: ['./addEditEmployeeModal.style.css'],
    providers: [EmployeeService, ImageResizer, AuthService],
    outputs: ['employeeSaved']
})

export class AddEditEmployeeModalComponent {
    @Input() activeModulesConfiguration: Array<any>;
    @ViewChild('addModal') public childModal: ModalDirective;
    public addEditForm: FormGroup;
    public actionName: string;
    public employeeSaved = new EventEmitter<any>();
    public employee: Employee = new Employee();

    public statuses: Array<any> = [
        { id: Status.Hired, value: Status[Status.Hired] },
        { id: Status.Dismissed, value: Status[Status.Dismissed] }];
    public selectedStatus: number = 0;

    public selectedCountry: string;
    public selectedCity: string;

    public officeLocations: Array<any>;
    
    public datePickersValidationRules: any = {
        birthday: {
            minDate: new Date(),
            maxDate: new Date()
        },
        startDate: {
            minDate: new Date(),
            maxDate: new Date()
        },
        terminationDate: {
            minDate: new Date(),
            maxDate: new Date()
        }
    }   

    public technologiesAutoCompleteDataService: CompleterData;
    private technologies: Array<any> = [
        { name: ".NET" },
        { name: "Java" },
        { name: "php" },
        { name: "JavaScript" },
        { name: "iPhone" },
        { name: "Android" },
        { name: "Python" },
    ];

    public messengersAutoCompleteDataService: CompleterData;
    private messengers: Array<any> = [
        { name: "WhatsApp" },
        { name: "Facebook Messenger" },
        { name: "Slack" },
        { name: "Skype" },
        { name: "Viber" }
    ];

    public phoneMask: Array<string | RegExp> = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    public isBirthdayPickerOpened: boolean = false;
    public isStartDatePickerOpened: boolean = false;
    public isTerminationDatePickerOpened: boolean = false;

    public fileToPreviewSorces: string[] = [];

    public uploaderBio: FileUploader;
    public uploaderPhoto: FileUploader;

    private apiUrl: string;
    private megabyteInBytes: number = 10000000;
    private accessToken: string;

    private employeeIdForFiles: string;
    private bioFileErrorMessage: string = "";
    private photoFileErrorMessage: string = "";   

    constructor(private _employeeService: EmployeeService,
        private formBuilder: FormBuilder,
        private completerService: CompleterService,
        private imageResizer: ImageResizer,
        private _urlHelper: UrlHelper,
        private _authService: AuthService) {

        this.addEditForm = formBuilder.group({
            fullName: [this.employee.fullName, Validators.required],
            fullNameCyrillic: [this.employee.fullNameCyrillic],
            patronymicCyrillic: [this.employee.patronymicCyrillic],
            jobTitle: [this.employee.jobTitle, Validators.required],
            technology: [this.employee.technology],
            projectName: [this.employee.projectName],
            departmentName: [this.employee.departmentName, Validators.required],
            country: [this.employee.country, Validators.required],
            city: [this.employee.city, Validators.required],
            companyEmail: [this.employee.companyEmail, [Validators.required, Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/)]],
            personalEmail: [this.employee.personalEmail],//, Validators.pattern('^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$')],
            messengerName: [this.employee.messengerName],
            messengerLogin: [this.employee.messengerLogin],
            mobileNumber: [this.employee.mobileNumber],
            additionalMobileNumber: [this.employee.additionalMobileNumber],
            birthday: [this.employee.birthday],
            birthdayPicker: ['birthdayPicker'],
            status: [this.employee.status, Validators.required],
            startDate: [this.employee.startDate],
            terminationDate: [this.employee.terminationDate],
            daysSkipped: [this.employee.daysSkipped],
            notes: [this.employee.notes]
        });

        this.technologiesAutoCompleteDataService = completerService.local(this.technologies, 'name', 'name');
        this.messengersAutoCompleteDataService = completerService.local(this.messengers, 'name', 'name');

        this.accessToken = "Bearer " + this._authService.getAccessToken();
        this.employeeIdForFiles = this.getGuid();

        this.apiUrl = _urlHelper.getApiUrl(location.hostname);

        this.uploaderBio = new FileUploader({
            url: this.apiUrl + 'Api/UploadBio',
            authToken: this.accessToken,
            allowedFileType: ["docx", "doc"],
            maxFileSize: this.megabyteInBytes * 10,
            queueLimit: 1,
            headers: [{ name: "EmployeeIdForFiles", value: this.employeeIdForFiles }]
        });

        this.uploaderPhoto = new FileUploader({
            url: this.apiUrl+ "Api/UploadPhoto",
            authToken: this.accessToken,
            allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
            maxFileSize: this.megabyteInBytes * 10,
            queueLimit: 1,
            headers: [{ name: "EmployeeIdForFiles", value: this.employeeIdForFiles }]
        });

        // fill uploaderBio queue
        this.initFileUploaders();
    }

    private getGuid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    private initFileUploaders(): void {
        // let url = 'api/containers/comK/download/IMG_20130731_211048.jpg';
        // $http.get(url,{responseType: "blob"}).
        // success(function(data, status, headers, config) {
        //     let mimetype = data.type;
        //     let file = new File([data], "IMG_20130731_211048.jpg",{type:mimetype});
        //     let dummy = new FileItem(this.uploaderBio, file, {});
        //     dummy._file = file;
        //     dummy.progress = 100;
        //     dummy.isUploaded = true;
        //     dummy.isSuccess = true;
        //     this.uploadBio.queue.push(dummy);
        // }).
        // error(function(data, status, headers, config) {
        // alert("The url could not be loaded...\n (network error? non-valid url? server offline? etc?)");
        // });

        // ["url1", "url2"].forEach(element => {
        //     let dummy = new FileItem(this.uploaderBio, new File([], ""), {
        //         //lastModifiedDate: new Date(),
        //        // size: 1e6,
        //         url: element
        //     });

        //     dummy.progress = 100;
        //     dummy.isUploaded = true;
        //     dummy.isSuccess = true;

        //    // this.uploaderBio.uploadItem()
        //     this.uploaderBio.queue.push(dummy)
        // });

    }

    public isPAModuleActive(): boolean{
        if(!this.activeModulesConfiguration){
            return false;
        }
        
        return this.activeModulesConfiguration.some(x => x == "PA");
    }

    public showChildModal(actionName: string, officeLocations: Array<any>, row: Employee = null): void {
        this.actionName = actionName;

        // if object is not empty
        if (Object.keys(row).length != 0) {
            //this.employee = row;
            let rowCopy: Employee = <Employee>JSON.parse(JSON.stringify(row));
            this.employee = rowCopy;
        } else {
            this.employee = new Employee();
            this.employee.daysSkipped = 0;
        }

        this.init(officeLocations);

        this.childModal.config.backdrop = false; // workaround 
        this.childModal.show();
    }    

    private init(officeLocations: Array<any>): void {
        this.selectedStatus = this.employee.status ? this.employee.status : this.statuses[0].id;
        this.employee.status = this.selectedStatus;

        this.officeLocations = officeLocations;

        this.selectedCountry = this.employee.country ? this.employee.country : officeLocations[0].Country;
        this.selectedCity = this.employee.city ? this.employee.city : officeLocations[0].Cities[0];

        this.employee.country = this.selectedCountry;
        this.employee.city = this.selectedCity;

        this.disableControl(this.employee.messengerName, 'messengerLogin');

        this.initDatePickers();
    }

    private disableControl(value: string, controlName: string): void {
        if (!value) {
            this.addEditForm.get(controlName).disable();
        } else {
            this.addEditForm.get(controlName).enable();
        }
    }

    private initDatePickers(): void {
        let date: Date = new Date();
        this.datePickersValidationRules.birthday.minDate.setFullYear(date.getFullYear() - 100);
        this.datePickersValidationRules.birthday.maxDate.setFullYear(date.getFullYear() - 16);
        this.datePickersValidationRules.startDate.minDate.setFullYear(date.getFullYear() - 20);
        this.setStartDateMaxDate();
        this.setTerminationDateMinDate();
    }

    public getCities(country: string): Array<string> {
        if (!country) {
            return [];
        }

        let cities = new Array<string>();

        let selectedCountry = this.selectedCountry;
        this.officeLocations.map(loc => {
            if (loc.Country == selectedCountry) {
                Array.prototype.push.apply(cities, (loc.Cities));
            }
        });

        return cities;
    }

    public onCityChanged(): void {
        if (!this.selectedCountry) {
            this.addEditForm.controls['city'].disable();
        } else {
            this.addEditForm.controls['city'].enable();
        }
    } 

    public save(): void {
        this.employee.country = this.selectedCountry;
        this.employee.city = this.selectedCity;
        if (!this.employee.messengerName) {
            this.employee.messengerLogin = '';
        }

        this.employee.employeeIdForFiles = this.employeeIdForFiles;

        this.employeeSaved.emit(this.employee);
        
        this.addEditForm.reset();
        this.hideChildModal();
    }

    private hideChildModal(): void {
        this.childModal.hide();
    }  

    
    public openBirthdayPicker(): void {
        this.isBirthdayPickerOpened = !this.isBirthdayPickerOpened;

        if (this.isBirthdayPickerOpened) {
            //close other calendars
            this.isStartDatePickerOpened = false;
            this.isTerminationDatePickerOpened = false;
        }
    }

    public openStartDatePicker():void {
        this.isStartDatePickerOpened = !this.isStartDatePickerOpened;

        if (this.isStartDatePickerOpened) {
            //close other calendars
            this.isBirthdayPickerOpened = false;
            this.isTerminationDatePickerOpened = false;

            this.setStartDateMaxDate();
        }
    }

    private setStartDateMaxDate(): void {
        if (this.employee.terminationDate) {
            this.datePickersValidationRules.startDate.maxDate = new Date(Date.parse(this.employee.terminationDate.toString()));
        } else {
            this.datePickersValidationRules.startDate.maxDate = new Date();
        }
    }
    
    public openTerminationDatePicker(): void {
        this.isTerminationDatePickerOpened = !this.isTerminationDatePickerOpened;

        if (this.isTerminationDatePickerOpened) {
            //close other calendars
            this.isBirthdayPickerOpened = false;
            this.isStartDatePickerOpened = false;

            this.setTerminationDateMinDate();
        }
    }    

    private setTerminationDateMinDate(): void {
        if (this.employee.startDate) {
            this.datePickersValidationRules.terminationDate.minDate = new Date(Date.parse(this.employee.startDate.toString()));
        } else {
            this.datePickersValidationRules.terminationDate.minDate.setFullYear(new Date().getFullYear() - 20);
        }
    }

    public setStatus(status: number): void {
        this.employee.status = status;
    }

    public validateBioFile($event): void {
        let file: any = $event.target.files[0];
        let size: number = file.size;

        if (size > this.megabyteInBytes * 10) {
            this.bioFileErrorMessage = "Uploaded file is too large";

            setTimeout(() => {
                this.bioFileErrorMessage = "";
            }, 4000);

            return;
        }

        let extenstion: string = file.name.substr(file.name.lastIndexOf('.') + 1);
        extenstion = extenstion.toLowerCase();

        if (extenstion != "doc" && extenstion != "docx") {
            this.bioFileErrorMessage = "Uploaded file has an unsupported format";

            setTimeout(() => {
                this.bioFileErrorMessage = "";
            }, 4000);

            return;
        }
    }

    public validatePhotoFile($event): void {
        let file: any = $event.target.files[0];
        let size: number = file.size;

        if (size > this.megabyteInBytes * 10) {
            this.photoFileErrorMessage = "Uploaded file is too large";

            setTimeout(() => {
                this.photoFileErrorMessage = "";
            }, 4000);

            return;
        }

        let extenstion: string = file.name.substr(file.name.lastIndexOf('.') + 1);
        extenstion = extenstion.toLowerCase();

        if (extenstion != "jpeg" && extenstion != "jpg" && extenstion != "png") {
            this.photoFileErrorMessage = "Uploaded file has an unsupported format";

            setTimeout(() => {
                this.photoFileErrorMessage = "";
            }, 4000);

            return;
        }
    }

    public getResizedFiles(input: any): void {
        this.fileToPreviewSorces = this.imageResizer.getResizedFiles(input.files);
    }    

    public deleteBio(item: any): void {
        this._employeeService.deleteBio(item.file.name, this.employee.id, this.employeeIdForFiles)
            .subscribe(
            response => {
                if (response) {
                    //item.remove();
                    //let a = this.uploaderBio;//.removeFromQueue()
                }
            },
            error => console.log("file was not removed")//this.handleError(error)
            );

        item.remove();
    }

    public deletePhoto(item: any): void {
        this._employeeService.deletePhoto(item.file.name, this.employee.id, this.employeeIdForFiles)
            .subscribe(
            response => {
                if (response) {
                    this.fileToPreviewSorces = [];
                    //item.remove();
                    //let a = this.uploaderBio;//.removeFromQueue()
                }
            },
            error => console.log("file was not removed")//this.handleError(error)
            );

        item.remove();
    }
}