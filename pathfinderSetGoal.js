
const { Entity } = require('prismarine-entity')
const { GoalNear, GoalFollow } = require('mineflayer-pathfinder').goals
const { bot, listenerManager } = require('./bot.js')

class PathfinderSetGoal {
	constructor(goal) {
		this.goal = goal
	}
	then(resolve, reject) {
		this.resolve = resolve
		this.reject = reject
		this.run()
	}
	run() {
		// new GoalFollow(entity, this.followDistance)
		// new GoalNear(position.x, position.y, position.z, 0.5)
		console.log("going")
		bot.pathfinder.goto(this.goal, (err, result)=>{
			console.log("got there")
			bot.pathfinder.setGoal(null)
			this.resolve()
		})
		//bot.pathfinder.setGoal(goal, true)
	}
	cancel() {
		bot.pathfinder.setGoal(null)
		this.reject()
	}
}

module.exports = PathfinderSetGoal