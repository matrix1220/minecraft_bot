const { bot, listenerManager } = require('./bot.js')
const GetItem = require('./getItem.js')

class Dig {
	constructor(block) {
		this.block = block
		this.diggging = false
		this.diggingCompletedPosition = null
		this.itemDropPosition = null
		this.getItem = false;
	}
	then(resolve, reject) {
		this.resolve = resolve
		this.reject = reject
		this.run()
	}
	run() {
		this.diggingAbortedPosition = listenerManager.addListener('diggingAborted', (block) => {
			console.log("diggingAborted listener")
			if(this.block.position!=block.position) return;
			console.log("digging complete")
			setTimeout(()=>{
				if(this.getItem) return;
				listenerManager.removeListener('itemDrop', this.itemDropPosition)
				listenerManager.removeListener('diggingCompleted', this.diggingCompletedPosition)
				listenerManager.removeListener('diggingAborted', this.diggingAbortedPosition)
				console.log("remove", this.diggingAbortedPosition, this.diggingCompletedPosition, this.itemDropPosition)
				this.resolve()
			}, 2000);
		})
		this.diggingCompletedPosition = listenerManager.addListener('diggingCompleted', (block) => {
			console.log("diggingCompleted listener")
			if(this.block.position!=block.position) return;
			console.log("digging complete")
			setTimeout(()=>{
				if(this.getItem) return;
				listenerManager.removeListener('itemDrop', this.itemDropPosition)
				listenerManager.removeListener('diggingCompleted', this.diggingCompletedPosition)
				listenerManager.removeListener('diggingAborted', this.diggingAbortedPosition)
				console.log("remove", this.diggingAbortedPosition, this.diggingCompletedPosition, this.itemDropPosition)
				this.resolve()
			}, 2000);
		})
		this.itemDropPosition = listenerManager.addListener('itemDrop', (entity) => {
			console.log("itemDrop listerenr")
			if (!this.block.drops.includes(entity.metadata[7].itemId)) return;
			if(this.block.position.distanceTo(entity.position)>1) return;
			console.log("digging complete")
			listenerManager.removeListener('itemDrop', this.itemDropPosition)
			listenerManager.removeListener('diggingCompleted', this.diggingCompletedPosition)
			listenerManager.removeListener('diggingAborted', this.diggingAbortedPosition)
			console.log("remove", this.diggingAbortedPosition, this.diggingCompletedPosition, this.itemDropPosition)
			this.getItem = new GetItem(entity)
			this.getItem.then(()=> {
				this.resolve()
			})
		})
		console.log("new", this.diggingAbortedPosition, this.diggingCompletedPosition, this.itemDropPosition)
		this.diggging = true
		console.log("digging")
		bot.dig(this.block)
		this.check()
	}
	check() {
		setTimeout(()=>{
			if(bot.pathfinder.isMining()) {
				this.check();
				return;
			}
			if(this.getItem) return;
			listenerManager.removeListener('itemDrop', this.itemDropPosition)
			listenerManager.removeListener('diggingCompleted', this.diggingCompletedPosition)
			listenerManager.removeListener('diggingAborted', this.diggingAbortedPosition)
			this.resolve()
		}, 1000);
	}
	cancel() {
		if(this.diggging) bot.stopDigging()
		this.reject()
	}
}
// function dig(block) {
// 	return new Promise(resolve => {
// 		listenerManager.addListener('itemDrop', this.drop)
// 	});
// }

module.exports = Dig