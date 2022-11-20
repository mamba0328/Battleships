import { doc } from 'prettier';
import Player from './Player'

let currentAxe = 'x'; 

function startGame() { 
    const player = new Player('name')
    const bot = new Player('bot'); 
    player.opponentsField = bot.field;
    bot.opponentsField = player.field;
    bot.field.createRandomizedFleet();
    return [player, bot]
}

function showShips(playerField) {
    const coordsOfEachShip = playerField.coordinates.ofShips;


    coordsOfEachShip.forEach(array => { 
        const cells = document.getElementsByClassName(`${array[0]},${array[1]}`);
        const cell = cells[0] //left field
        cell.setAttribute('id', 'ship')
    })

    startTheGame(areAllShipsPlaced(playerField))
} 

function createBattlefields(players) {
    const battleFields = document.querySelectorAll('.battlefield');
    const arraiedBattleFields = Array.from(battleFields); 
    fillBattlfieldWithCells(arraiedBattleFields[0], players)
    fillBattlfieldWithCells(arraiedBattleFields[1], players)
    makeDraggabalesResponive(players[0].field)
    //placeShips(players[0].field)
}

function makeCellResponsible(cell, players) {
    const player = players[0];
    const bot = players[1];
    cell.addEventListener('click', (e) => {
        if (e.target.parentElement.id == 'my') {
            return areAllShipsPlaced(player.field) ? console.log() : alert('You need to place all ships first. Drug them from the right side to the field.');
        } 
        
        const coordinatesOfCell = getCoordinatesOfCell(e);//get coords of attack
        if (Array.from(e.target.classList).includes('hitted') || Array.from(e.target.classList).includes('missed')) return //prevents hitting same spot
        
        player.sendAttack(coordinatesOfCell)
        bot.sendAttack()

        if (player.field.areAllShipsSunk() || bot.field.areAllShipsSunk()) { 
            theGameEnds()
        }
    })    
}

function getCoordinatesOfCell(e) { 
    const coordinates = e.target.classList[1];//where coords keeps

    const separeter = coordinates.indexOf(',');
    const eTargetCoords = [parseFloat(coordinates.slice(0, separeter)), parseFloat(coordinates.slice(separeter + 1))];
    return eTargetCoords
}

      
function fillBattlfieldWithCells(battleField, player) {
    let x = 1; 
    let y = 10; 
    for (let i = 0; i < 100; i++) {
    if (x == 11) { 
        --y
        x = 1;
    }
    const cell = document.createElement('div');
    cell.classList.add('cell')
    makeCellResponsible(cell, player)
    cell.classList.add(`${x},${y}`)
    battleField.appendChild(cell)
    x++
    }   
}

createBattlefields(startGame())


//drag and drop implementation
function makeDraggabalesResponive(field) {
    const draggables = document.querySelectorAll('.draggableShip')

    draggables.forEach((element) => { 
    element.addEventListener('dragstart', (e) => { 
        e.target.classList.add('dragging');
    })
        
    element.addEventListener('dragend', (e) => {

        let numberOfCellInShip = 1; 
        if (e.target.id.includes('fourcell')) { 
            numberOfCellInShip = 4;
        } else if (e.target.id.includes('threecell')) { 
            numberOfCellInShip = 3;
        } else if (e.target.id.includes('twocell')) { 
            numberOfCellInShip = 2;
        }
            
        e.target.classList.remove('dragging');
            
        const cellOnWhichDrop = document.elementFromPoint(e.clientX, e.clientY);
        const coordsOfTheCell = cellOnWhichDrop.classList[1];

        const separeter = coordsOfTheCell.indexOf(',');
        const eTargetCoords = [parseFloat(coordsOfTheCell.slice(0, separeter)), parseFloat(coordsOfTheCell.slice(separeter + 1))];
            
        // if (currentAxe == 'x' && ((eTargetCoords[0] + numberOfCellInShip - 1) > 10 || (eTargetCoords[0] - numberOfCellInShip + 1) < 1)){    // + for y|| (eTargetCoords[1] + numberOfCellInShip - 1) > 10) { //cheks either ship won't get out of the field
        //     return alert('you can`t place ship here')
        // }

        //Ships can get out of gaming board, the only solution to prevent is to change placeShip method.
        console.log(field)
        field.placeShip(eTargetCoords, numberOfCellInShip, currentAxe)
        showShips(field)
        e.target.classList.add('dragging');
    })
        
    element.addEventListener('click', () => { 
        changeAxeOfShips()
    })
})
}

function areAllShipsPlaced(field) { 
    return field.coordinates.ofShips.length == 20 ?  true : false ; 
}

function startTheGame(boolean) {
    if (boolean == false) return; 
    
    const opponentsField = document.getElementById('oponents');
    opponentsField.removeAttribute('data', 'unclickable')
}

function theGameEnds(){ 
    if (confirm('The game has ended, wanna replay')) { 
                document.location.reload();
    } else { 
        alert('there`s nothing left to do, enjoy your self')
        const fields = document.getElementsByClassName('battlefield');
        Array.from(fields).forEach(field => { 
            field.setAttribute('data', 'unclickable');
        })
    }
}

function changeAxeOfShips() {
    if(currentAxe == 'x'){ 
        const shipArea = document.getElementById('shipArea');
        changeId(shipArea, 'shipArea', 'shipAreaY');
        const allShips = shipArea.children
        Array.from(allShips).forEach(ship => { 
        const oldId = ship.id; 
        if (oldId == 'onecell') return; 
        const newId = ship.id + 'Y';
        console.log(oldId, newId)
        changeId(ship, oldId, newId)
        })
        currentAxe = 'y'
    } else {
        const shipArea = document.getElementById('shipAreaY');
        changeId(shipArea, 'shipAreaY', 'shipArea');
        const allShips = shipArea.children
        Array.from(allShips).forEach(ship => { 
        const oldId = ship.id; 
        if (oldId == 'onecell') return; 
        const letterY = oldId.indexOf('Y');
        const newId = oldId.slice(0, letterY)
        console.log(oldId, newId)
        changeId(ship, oldId, newId)
        currentAxe = 'x'
    })
    }   
}

function changeId(elem, oldId, newId) { 
    elem.removeAttribute('id', oldId);
    elem.setAttribute('id', newId)
    console.log(elem)
}

changeAxeOfShips()