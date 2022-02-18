import { Bot } from "mineflayer";
import { StateBehavior } from "mineflayer-statemachine";

export class FindBlockState implements StateBehavior
{
    active: boolean = false;
    stateName: string = 'stateName';
    bot: Bot;

    constructor(bot: Bot)
    {
        this.bot = bot;
    }

    onStateEntered(): void
    {
        console.log(`${this.bot.username} has entered the ${this.stateName} state.`);
    }

    onStateExited(): void
    {
        console.log(`${this.bot.username} has left the ${this.stateName} state.`);
    };
}