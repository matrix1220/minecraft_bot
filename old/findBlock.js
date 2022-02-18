const FindBlockState = (function(){
    function FindBlockState(bot)
    {
        this.bot = bot;
        this.active = false;
        this.stateName = 'myStateName';
    }

    FindBlockState.prototype.onStateEntered = function () {
        console.log(`${this.bot.username} has entered the ${this.stateName} state.`);
    };
    FindBlockState.prototype.onStateExited = function () {
        console.log(`${this.bot.username} has left the ${this.stateName} state.`);
    };

    return FindBlockState;
}());

module.exports = FindBlockState