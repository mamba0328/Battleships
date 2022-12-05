import { doc } from 'prettier';
import Player from './Player.js'

const gameLoop = function () { 
    const player = new Player('val9');
    const bot = new Player('bot', true);
    player.opponentsField = bot.field; 
    bot.opponentsField = player.field;
    player.createBattlefields();
    bot.createBattlefields();
    bot.field.createRandomizedFleet();
    const randomizeShipButton = document.querySelector('button')
    randomizeShipButton.addEventListener('click', () => {
        player.field.createRandomizedFleet();
    })
}

gameLoop()