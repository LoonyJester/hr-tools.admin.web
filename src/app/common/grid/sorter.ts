export class Sorter {
    sortColumnName: string;
    isDescending: boolean;

    public getSortConfig(data: any, columns: any): any {
        let columnName: string = void 0;
        let sort: string = void 0;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].sort !== '' && columns[i].sort !== false) {
                columnName = columns[i].name;
                sort = columns[i].sort;
            }
        }

        if (!columnName) {
            return data;
        }

        // simple sorting - client side
        // return data.sort((previous: any, current: any) => {
        //     if (previous[columnName] > current[columnName]) {
        //         return sort === 'desc' ? -1 : 1;
        //     } else if (previous[columnName] < current[columnName]) {
        //         return sort === 'asc' ? -1 : 1;
        //     }
        //     return 0;
        // });

        return {
            sortColumnName: columnName,
            isDescending: sort === 'desc' ? true : false
        };
    }
}