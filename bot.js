const mineflayer = require('mineflayer')
const { Vec3 } = require('vec3')

const bot = mineflayer.createBot({
  host: 'serverimiz.ga',
  // localhost
  // skyblock.ibrohimov.ga
  // serverimiz.ga
  username: 'matrix1220',
})
exports.bot = bot

const password = 'qaz123098'
const master = 'matrix_1220'

class ListenerManager {
	constructor(bot) {
		this.bot = bot
		this.listeners = {}
	}
	addListener(listenerType, listener) {
		if(!(listenerType in this.listeners)) {
			this.listeners[listenerType] = []
			this.bot.on(listenerType, (...args) => {
				this.listeners[listenerType].forEach(listener => listener(...args))
			})
		}
		return this.listeners[listenerType].push(listener) - 1;
	}
	removeListener(listenerType, listenerPosition) {
		this.listeners[listenerType].splice(listenerPosition, 1); 
	}
}
let listenerManager = new ListenerManager(bot);
exports.listenerManager = listenerManager
//bot.listenerManager = listenerManager
//listenerManager.addListener('chat', )

// bot.on('chat', (username, message) => {
// 	if (username === bot.username) return
// 	if (username==master) {

// 	}
// })

bot.on('kicked', console.log)
bot.on('error', console.log)

const { Movements, pathfinder } = require('mineflayer-pathfinder')
bot.loadPlugin(pathfinder);

bot.once("spawn", () => {
	bot.chat(`/login ${password}`)
	const mcData = require('minecraft-data')(bot.version)
	const defaultMove = new Movements(bot, mcData)
	bot.pathfinder.setMovements(defaultMove)

	//bot.chat(`/pw matrix_1220.test`)
})

const CollectTree = require('./collectTree.js')
const PathfinderSetGoal = require('./pathfinderSetGoal.js')
const { GoalNear, GoalFollow } = require('mineflayer-pathfinder').goals

const Dig = require('./dig.js')

bot.on('whisper', (username, message) => {
	if (username === bot.username) return;
	if (username !== master) {
		return;
	}
	if (message=='follow') {
		//
	} else if (message=='find') {
		//console.log(findPoint('test'))
	} else if (message=='come') {
		if(!(master in bot.players)) {
			console.log('cant see you')
			return;
		}
		let pathfinderSetGoal = new PathfinderSetGoal(new GoalFollow(bot.players[master].entity))
		pathfinderSetGoal.then(()=> console.log('came') )
	} else if (message=='dig') {
		if(!(master in bot.players)) {
			console.log('cant see you')
			return;
		}
		const position = bot.players[master].entity.position;
		for (let x = -4; x < 4; x++) {
			for (let z = -4; z < 4; z++) {
				let pos = position.offset(x, 1, z);
				//console.log(pos)
				let block = bot.blockAt(pos);
				if(block.name=='air') continue;
				let dig = new Dig(block)
				dig.then(()=> {

				})
				//console.log(block)
				//return;
			}
		}
	} else if (message=='sneak') {
		bot.setControlState("sneak", true)
		//bot.setControlState("sneak", false)
	} else if (message=='tree') {
		let position = findPoint('tree');
		console.log(position)
		let collectTree = new CollectTree(position)
		collectTree.then(()=> console.log("tree done") )
	} else if (message=='collect') {
	} else {
		bot.chat(message)
	}
})


function findPoint(name) {
	block_positions = bot.findBlocks({
		matching: (block) => block.name.endsWith('sign'),
		//maxDistance: 5,
	})
	for (let position of block_positions) {
		block = bot.blockAt(position)
		if (!block.blockEntity) continue
		if (block.blockEntity.Text1.text =='[point]' && block.blockEntity.Text2.text == name)
			return block.position;
	}
}
