const chalk = require('chalk');

export default class Stylize
{
    public static success(label: string | number): string
    {
        return chalk.green(label);
    }

    public static danger(label: string | number): string
    {
        return chalk.red(label);
    }

    public static fonBlue(label: string | number): string
    {
        return chalk.hex('#00A6E4')(label);
    }

    public static info(label: string | number): string
    {
        return chalk.cyan(label);
    }

    public static white(label:string | number): string
    {
        return chalk.white(label);
    }

    public static query(query:string | number): string
    {
        let greenQuery = <string> chalk.greenBright(query);

        // console.log(greenQuery);

        // let finalQuery = greenQuery.replace(/(SELECT)/g,Stylize.info('SELECT'));

        return greenQuery;
    }

    public static gray(label:string | number): string
    {
        return chalk.gray(label);
    }

    public static bold(label:string | number): string
    {
        return chalk.bold(label);
    }
}
