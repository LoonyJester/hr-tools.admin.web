import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../common/company/services/configuration.service';
import { ModuleName } from "../../common/company/moduleName";

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.template.html'
})

export class LandingPageComponent implements OnInit {
  public isCoreModuleActive: boolean = true;

  public constructor(private _configurationService: ConfigurationService) {
  }

  ngOnInit() {
    this.isModulesActive();
  }

  private isModulesActive(): boolean {
    let that = this;

    this._configurationService.getActiveModulesConfiguration()
      .subscribe(response => {
        that.isCoreModuleActive = that.isModuleActive(response, ModuleName.Core);
      }
      , error => { debugger; that.isCoreModuleActive = false; });

    return that.isCoreModuleActive;
  }

  private isModuleActive(activeModules: Array<string>, moduleName: ModuleName): boolean {
    if (!activeModules) {
      return false;
    }

    return activeModules.some(x => x == moduleName);
  }
}
