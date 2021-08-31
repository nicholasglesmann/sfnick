const Table = require('cli-table3');
import Stylize from "./Stylize";

export default class OutputTable
{
    private _table: typeof Table

    private _tableHead: string[]

    private _columnWidths: number[]

    private _tableRows: string[][]

    constructor()
    {
        this._tableHead = [];
        this._columnWidths = [];
        this._tableRows = [];
    }

    public setTableHead(tableHead: string[]): void
    {
        this._tableHead = tableHead;
    }

    public setColumnWidths(columnWidths: number[]): void
    {
        this._columnWidths = columnWidths;
    }

    public addRow(tableRow: string[]): void
    {
        this._tableRows.push(tableRow);
    }

    public addRows(tableRows: string[][]): void
    {
        this._tableRows.push(...tableRows);
    }

    public render(): void
    {
        this._compile();

        this._display();
    }

    public static isMatch(firstElement: any, secondElement: any): string
    {
        if (firstElement == secondElement)
        {
            return Stylize.success('Yes');
        }

        return Stylize.danger('No');
    }

    public sortNonMatchingRowsToTop(args: { indexOfColumnToSortOn: number }): void
    {
        let indexOfColumnToSortOn = args.indexOfColumnToSortOn;

        this._tableRows.sort((a, b) =>
            {
                return (a[indexOfColumnToSortOn] > b[indexOfColumnToSortOn])
                ? 1
                : ((b[indexOfColumnToSortOn] > a[indexOfColumnToSortOn]) ? -1 : 0);
            }
        );
    }

    private _compile(): void
    {
        this._table = new Table({
            head: this._tableHead,
            colWidths: this._columnWidths
        });

        this._table.push(...this._tableRows);
    }

    private _display(): void
    {
        console.log(this._table.toString());
    }
}
