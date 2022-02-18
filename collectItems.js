const { bot } = require('./bot.js')
const GetItem = require('./getItem.js')


class CollectItems {
	constructor(position, maxDistance=10) {
		this.position = position
		this.maxDistance = maxDistance
		this.do = true
		this.getItem = null
	}
	then(resolve, reject) {
		this.resolve = resolve
		this.reject = reject
		this.run()
	}
	job() {
		if (!this.do) return;
		console.log("searching item")
		//console.log(bot.entities)
		for (const [key, entity] of Object.entries(bot.entities)) {
		//for (let entity of bot.entities) {
			if(entity.type!='item') continue;
			if(this.position.distanceTo(entity.position)>this.maxDistance) continue;
			console.log("item found")
			this.getItem = new GetItem(entity)
			this.getItem.then(()=> {
				this.job()
			})
			return;
		}
		console.log("item not found")
		this.resolve()	
		
	}
	run() {
		this.job();
	}
	cancel() {
		this.do = false
		if(this.chopTree) this.chopTree.cancel()
	}
}

module.exports = CollectItems