import createField from "./createField"

class Player { 
    constructor(name, bot) { 
        this.name = name;
        this.shots = [];
        this.field = createField(bot);
        this.lastShotHit = 'false';
        this.opponentsField = null;
        this.currentAxe = 'x'
    }

    sendAttack(attackCoordinates = [1, 1]) {
        if (typeof (attackCoordinates) != 'object') return 'Coordinates';
        if (this.name == 'bot') {
            if (this.field.lastShotHit) return
            
            this.botsAttack();
            while (this.opponentsField.lastShotHit) { 
                this.botsAttack();
            }
        } else { 
            let existingShot = this.shots.filter((shot) => { 
                return shot[0] == attackCoordinates[0] && shot[1] == attackCoordinates[1]
            })

            if (existingShot.length > 0) return console.log('You shoot here already')
            
            this.opponentsField.recieveAttack(attackCoordinates);
            this.shots.push(attackCoordinates);

        }
        
    }

    botsAttack() { 
        if (this.name != 'bot') return 'you don`t have permission to obtein bot`s power';
        this.opponentsField.recieveAttack(this.findUnshootedSpot(), 'bot');
    }

    findUnshootedSpot() {
        mainLoop:
        while (true) { 
            let x = Math.round(Math.random() * 10); 
            let y = Math.round(Math.random() * 10);
            
            if (x == 0) { 
                continue mainLoop
            } else if (y == 0) { 
                continue mainLoop
            } 

            let searchedCoordinates = this.opponentsField.coordinates.ofAttacks.filter((arr) => {
               return arr[0] == x && arr[1] == y
            })

            //if searchedCoordinates already exist it means that shot on such location was alredy done
            if (searchedCoordinates.length > 0) continue mainLoop
            
            console.log(x,y)
            return [x, y]
        }
    }

    createBattlefields() {
        const battleFields = document.querySelectorAll('.battlefield');
        const arraiedBattleFields = Array.from(battleFields);
        if (this.name == 'bot') { 
            this.fillBattlfieldWithCells(arraiedBattleFields[1])
        } else { 
            this.fillBattlfieldWithCells(arraiedBattleFields[0])
            this.makeDraggabalesResponive()
        } 
    }

    makeDraggabalesResponive() {
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

                if (this.field.placeShip(eTargetCoords, numberOfCellInShip, this.currentAxe) == true) { 
                    this.countLeftShipsToPlace(numberOfCellInShip, e)
                }
            })
                
            element.addEventListener('click', (e) => {
                if(e.target.classList == 'draggableShipNotAnimated') return  
                this.changeAxeOfShips()
            })
        })
    }

    countLeftShipsToPlace(cells, e) { 
        let targetId = 'onecellCounter'; 
        cells == 4 ? targetId = 'fourcellCounter' : cells == 3 ? targetId = 'threecellCounter' : cells == 2 ? targetId = 'twocellCounter' : targetId = 'onecellCounter';
        const counter = document.getElementById(targetId);
        let countNum = counter.innerText - 1;
        if (countNum < 1) {
            e.target.classList.add('dragging');
            e.target.removeAttribute('draggable')
        }
        counter.innerText = countNum;
    }

    changeAxeOfShips() {
        if(this.currentAxe == 'x'){ 
            const shipArea = document.getElementById('shipArea');
            this.changeId(shipArea, 'shipArea', 'shipAreaY');
            const allShips = document.getElementsByClassName('draggableShip')
            Array.from(allShips).forEach(ship => { 
            const oldId = ship.id; 
            if (oldId == 'onecell') return; 
            const newId = ship.id + 'Y';
            this.changeId(ship, oldId, newId)
            })
            this.currentAxe = 'y'
        } else {
            const shipArea = document.getElementById('shipAreaY');
            this.changeId(shipArea, 'shipAreaY', 'shipArea');
            const allShips = document.getElementsByClassName('draggableShip')
            Array.from(allShips).forEach(ship => { 
            const oldId = ship.id; 
            if (oldId == 'onecell') return; 
            const letterY = oldId.indexOf('Y');
            const newId = oldId.slice(0, letterY)
            this.changeId(ship, oldId, newId)
            this.currentAxe = 'x'
        })
        }   
    }

    changeId(elem, oldId, newId) { 
        elem.removeAttribute('id', oldId);
        elem.setAttribute('id', newId)
    }

    makeCellResponsible(cell) {
        cell.addEventListener('click', (e) => {
            if (e.target.parentElement.id == 'my') {
                return this.field.areAllShipsPlaced() ? console.log() : alert('You need to place all ships first. Drug them from the right side to the field.');
            } 
            
            const coordinatesOfCell = this.getCoordinatesOfCell(e);//get coords of attack
            if (Array.from(e.target.classList).includes('hitted') || Array.from(e.target.classList).includes('missed')) return //prevents hitting same spot
            
            this.field.recieveAttack(coordinatesOfCell)
            this.sendAttack()
        })    
    }

    getCoordinatesOfCell(e) { 
        const coordinates = e.target.classList[1];//where coords keeps

        const separeter = coordinates.indexOf(',');
        const eTargetCoords = [parseFloat(coordinates.slice(0, separeter)), parseFloat(coordinates.slice(separeter + 1))];
        return eTargetCoords
    }

        
    fillBattlfieldWithCells(battleField) {
        let x = 1; 
        let y = 10; 
        for (let i = 0; i < 100; i++) {
        if (x == 11) { 
            --y
            x = 1;
        }
        const cell = document.createElement('div');
        cell.classList.add('cell')
        this.makeCellResponsible(cell)
        if (this.name != 'bot') cell.setAttribute('data','animated')
        cell.classList.add(`${x},${y}`)
        battleField.appendChild(cell)
        x++
        }   
    }
}

export default Player