const { bot, listenerManager } = require('./bot.js')
const PathfinderSetGoal = require('./pathfinderSetGoal.js')
const { GoalNear, GoalFollow } = require('mineflayer-pathfinder').goals

class GetItem {
	constructor(entity) {
		this.entity = entity
		this.pathfinderSetGoal = null
	}
	then(resolve, reject) {
		this.resolve = resolve
		this.reject = reject
		this.run()
	}
	run() {
		// this.playerCollectPosition = listenerManager.addListener('playerCollect', (collector, collected) => {
		// 	if(bot.entity!=collector) return;
		// 	if(this.entity!=collected) return;
		// 	listenerManager.removeListener('playerCollect', this.playerCollectPosition)
		// 	//this.resolve()
		// })
		console.log("getting item")
		this.pathfinderSetGoal = new PathfinderSetGoal(new GoalFollow(this.entity, 0.5))
		this.pathfinderSetGoal.then(()=> {
			console.log("getting got")
			this.resolve()
		})
	}
	cancel() {
		this.pathfinderSetGoal.cancel()
		this.reject()
	}
}

module.exports = GetItem