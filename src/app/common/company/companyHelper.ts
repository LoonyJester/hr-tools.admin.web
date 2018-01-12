export class CompanyHelper{
    public getCompanyName(host: string): string{
        switch(host){
            case "localhost":{
                return "teaminternational";
            }
            case "teaminternational.admin":{
                return "teaminternational";
            }
            case "company.admin":{
                return "company";
            }
        }
    }

    public getCompanyDisplayName(host: string): string{
        switch(host){
            case "localhost":{
                return "Team International Services Inc.";
            }
            case "teaminternational.admin":{
                return "Team International Services Inc.";
            }
            case "company.admin":{
                return "Company";
            }
        }
    }

    public getCompanyUrl(host: string): string{
        switch(host){
            case "localhost":{
                return "http://www.teaminternational.com/";
            }
            case "teaminternational.admin":{
                return "http://www.teaminternational.com/";
            }
            case "company.admin":{
                return "https://www.google.com.ua/";
            }
        }
    }

    public isCompanyPrimary(host: string): boolean{
        return this.getCompanyName(host) == "teaminternational";
    }
}