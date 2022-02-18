const { bot } = require('./bot.js')
const ChopTree = require('./chopTree.js')
const CollectItems = require('./collectItems.js')

const PathfinderSetGoal = require('./pathfinderSetGoal.js')
const { GoalNear, GoalFollow } = require('mineflayer-pathfinder').goals

class CollectTree {
	constructor(position, maxDistance=10) {
		this.position = position
		this.maxDistance = maxDistance
		this.do = true
		this.chopTree = null
	}
	then(resolve, reject) {
		this.resolve = resolve
		this.reject = reject
		this.run()
	}
	job() {
		if (!this.do) return;
		console.log("searching tree")
		console.log(this.position)
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
		console.log("tree found")
		this.chopTree = new ChopTree(block.position)
		this.chopTree.then(()=> {
			this.collectItems = new CollectItems(block.position)
			this.collectItems.then(()=> {
				this.job()
			})
		})
		
	}
	run() {
		console.log("asd")
		let pathfinderSetGoal = new PathfinderSetGoal(new GoalNear(this.position.x, this.position.y, this.position.z, 0.1))
		pathfinderSetGoal.then(()=> this.job() )
	}
	cancel() {
		this.do = false
		if(this.chopTree) this.chopTree.cancel()
	}
}

module.exports = CollectTree