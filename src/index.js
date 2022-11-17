import Player from './Player'




function startGame() { 
    const player = new Player(prompt('Enter your name'))
    const bot = new Player('bot'); 
    player.field.createRandomizedFleet();
    bot.field.createRandomizedFleet();
    player.opponentsField = bot.field;
    bot.opponentsField = player.field; 
}

function createBattlefields() {
    const battleFields = document.querySelectorAll('.battlefield');
    const arraiedBattleFields = Array.from(battleFields); 

    arraiedBattleFields.forEach((battleField) => {
        console.log(battleField)
        let x = 1; 
        let y = 10; 
        for (let i = 0; i < 100; i++) {
            if (x == 11) { 
                --y
                x = 1;
            }
            const cell = document.createElement('div'); 
            makeCellResponsible(cell)
            cell.classList.add('cell')
            cell.setAttribute('id', `${x}, ${y}`)
            battleField.appendChild(cell)
            x++
        }
    })
}

function makeCellResponsible(cell) { 
    cell.addEventListener('click', (e) => { 
        console.log(e.target.id)
    })    
}

createBattlefields()

