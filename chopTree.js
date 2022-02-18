const { bot } = require('./bot.js')
const Dig = require('./dig.js')
const PathfinderSetGoal = require('./pathfinderSetGoal.js')
const { GoalNear, GoalFollow, GoalGetToBlock } = require('mineflayer-pathfinder').goals

class ChopTree {
	constructor(position, maxDistance=4) {
		this.position = position
		this.maxDistance = maxDistance
		this.do = true
		this.dig = null
	}
	then(resolve, reject) {
		this.resolve = resolve
		this.reject = reject
		this.run()
	}
	tree() {
		console.log("chopping tree")
		if (!this.do) return;
		let block = bot.findBlock({
			point: this.position,
			maxDistance: this.maxDistance,
			matching: function(block) {
				if (!block.name.endsWith('log')) return false;
				return true
			},
			
		})
		if (!block) {
			console.log("tree not found")
			this.resolve()
			return;
		}
		const position = block.position
		let pathfinderSetGoal = new PathfinderSetGoal(new GoalNear(position.x, position.y, position.z, 5))
		pathfinderSetGoal.then(()=> {
			this.dig = new Dig(block)
			this.dig.then(()=> {
				this.tree()
			})
		})
		
	}
	run() {
		this.tree();
	}
	cancel() {
		this.do = false
		if(this.dig) this.dig.cancel()
	}
}

module.exports = ChopTree