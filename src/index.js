import { doc } from 'prettier';
import Player from './Player'

const gameLoop = function () { 
    const player = new Player('val9');
    const bot = new Player('bot', true);
    player.opponentsField = bot.field; 
    bot.opponentsField = player.field;
    player.createBattlefields();
    bot.createBattlefields();
    bot.field.createRandomizedFleet();
    if (confirm('y')) player.field.createRandomizedFleet()
}

gameLoop()