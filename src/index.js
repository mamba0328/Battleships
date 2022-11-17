import createShip from './createShip'
import createField from './createField'
import Player from './Player'

const bot = new Player('bot'); 
const player = new Player('player')
player.field.createRandomizedFleet();
bot.field.createRandomizedFleet();
player.opponentsField = bot.field;
bot.opponentsField = player.field; 
player.sendAttack([1, 1])
bot.sendAttack()
console.log(player)
console.log(bot)