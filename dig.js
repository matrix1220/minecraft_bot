const { bot, listenerManager } = require('./bot.js')
const GetItem = require('./getItem.js')

class Dig {
	constructor(block) {
		this.block = block
		this.diggging = false
		this.diggingCompletedPosition = null
	}
	then(resolve, reject) {
		this.resolve = resolve
		this.reject = reject
		this.run()
	}
	run() {
		this.diggging = true
		console.log("digging")
		bot.dig(this.block, ()=> this.resolve() )
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