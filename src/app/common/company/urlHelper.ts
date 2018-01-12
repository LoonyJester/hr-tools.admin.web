export class UrlHelper{
    public getAuthUrl(host: string): string{
        switch(host){
            case "localhost":{
                return  "https://teaminternational.auth:44311/"; //"http://localhost:61717/";//
            }
            case "teaminternational.admin":{
                return "https://teaminternational.auth:44311/"; //"http://localhost:61717/";//
            }
            case "company.admin":{
                return "https://company.auth:44314/";
            }
            default:{
              return "https://hrtools.auth:44310/";
            }
        }
    }

    public getApiUrl(host: string): string{
        switch(host){
            case "localhost":{
                return "http://teaminternational.admin:8086/"; // "http://localhost:58969/";
            }
            case "teaminternational.admin":{
                return "http://teaminternational.admin:8086/"; // "http://localhost:58969/";
            }
            case "company.admin":{
                return "http://company.admin:8096/";
            }
        }
    }
}