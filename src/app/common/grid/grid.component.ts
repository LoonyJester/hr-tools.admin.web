import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { Sorter } from './sorter';
import { GridSettings } from './gridSettings';

@Component({
    selector: 'grid',
    templateUrl: './grid.template.html',
    styleUrls: ['./grid.css'],
    outputs: ['cellClicked', 'gridStateChanged']
})

export class GridComponent {
    @Input() columns: Array<any>;
    @Input() rows: Array<any>;
    @Input() settings: GridSettings;

    cellClicked = new EventEmitter<any>();
    gridStateChanged = new EventEmitter<GridSettings>();

    private sorter = new Sorter();

    public onCellClicked(event: any): void {
        if (event.column == "edit") {
            this.cellClicked.emit(event);
        } else if (event.column == "_delete") {
            this.cellClicked.emit(event);
        } else if (event.column == "activate") {
            this.cellClicked.emit(event);
        }
    }

    public onChangeTable(event: any): void {
        if (this.rows) {
            let sortingInfo: any = this.sorter.getSortConfig(this.rows, this.columns);

            if (event) {
                this.settings.currentPage = event.page;
            }

            let gridData: GridSettings = new GridSettings(this.settings.totalCount, this.settings.currentPage, this.settings.itemsPerPage, sortingInfo.sortColumnName, sortingInfo.isDescending);
            this.gridStateChanged.emit(gridData);
        }
    }
}