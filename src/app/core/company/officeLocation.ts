import {Injectable} from '@angular/core';

@Injectable()
export class Country{
    public id: number;
    public name: string;

    constructor(id: number, name: string){
        this.id = id;
        this.name = name;
    }
}

@Injectable()
export class City{
    public id: number;
    public name: string;
    public country: Country;

    constructor(id: number, name: string, countryId: number, countryName: string){
        this.id = id;
        this.name = name;
        this.country = new Country(countryId, countryName);
    }
}

