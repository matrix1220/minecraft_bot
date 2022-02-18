const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: 'serverimiz.ga', // skyblock.ibrohimov.ga
  username: 'matrix1220',
})
var password = 'qaz123098'
var master = 'matrix_1220'

bot.loadPlugin(require('mineflayer-pathfinder').pathfinder);

const {
    StateTransition,
    BotStateMachine,
    EntityFilters,
    BehaviorFollowEntity,
    BehaviorLookAtEntity,
    BehaviorGetClosestEntity,
    BehaviorIdle,
    NestedStateMachine,
} = require("mineflayer-statemachine");

const createFollowEntityState = require('./followEntity.js')
//const { FindBlockState } = require('./findBlock.js')
const FindBlockState = require('./findBlock.js')

bot.on('chat', (username, message) => {
	if (username === bot.username) return
	//bot.chat(message)
	if (username==master) {

	}
})
bot.on('whisper', (username, message) => {
	if (username === bot.username) return
	if (username === master) {
		if (message=='follow') {
			followPlayerStateTransition.trigger()
		} else if (message=='find') {
			
		} else {
			bot.chat(message)
		}
	}
})

// bot.on('login', () => {
// })

const idleState = new BehaviorIdle();

function entityFilter(entity)
{
	return entity.type == 'player' && entity.username == 'matrix_1220';
}
let followPlayerState;
const followPlayerStateTransition = new StateTransition({
    parent: idleState,
    child: followPlayerState,
})
//const findBlockState = new FindBlockState(bot);


bot.once("spawn", () =>
{
	bot.chat(`/login ${password}`)
	//bot.chat(`/pw matrix_1220.test`)
	followPlayerState = createFollowEntityState(bot, entityFilter);
	const transitions = [
		followPlayerStateTransition,
	    new StateTransition({
	        parent: followPlayerState,
	        child: idleState,
	        shouldTransition: () => followPlayerState.isFinished(),
	    }),
	];
	const rootState = new NestedStateMachine(transitions, idleState);
    new BotStateMachine(bot, rootState);
});

bot.on('kicked', console.log)
bot.on('error', console.log)