import Stylize from "./Stylize";

export default class OutputMessage
{
    static endCommand(commandName?: string): void
    {
        let commandLabel = !!commandName ? `${commandName} command` : `Command`;

        console.log(`${Stylize.bold(`${commandLabel} completed!`)} Good-bye, Mr. Anderson.`);
    }
}
