import { check, doc } from "prettier"
import createShip from "./createShip"

function createField(bot = false) { 
    return {
        ships: {
            onecells: {
                first: null,
                second: null,
                third: null,
                fourth: null
            },
            
            twocells: {
                first: null,
                second: null,
                third: null,
            },

            threecells: {
                first: null,
                second: null,
            },

            fourcells: {
                first: null,
            },
        },

        coordinates: {
            ofShips: [],
            ofMissedAttacks: [],
            ofReservedArea: [],
        },

        isBot: bot, 

        //methods 
        placeShip(position, cells, mainAxe) {
            
            if (typeof (position) != 'object') {
                return 'typeof coordinates is invalid, use obj'
            }

            const allCoordinates = coordinatesOfEachCell(position, cells, mainAxe);

            if (this.isShipExistOn(allCoordinates)) {
                return console.log('you can`t place ship here')
            } else if (mainAxe == 'x' && (position[0] + cells - 1> 10)) {
                return console.log('you can`t place ship here')
            } else if (mainAxe == 'y' && (position[1] + cells - 1> 10)) {
                return console.log('you can`t place ship here')
            }

            //mechanic of placing 
            this.defineShipInItsGroup(allCoordinates, cells, mainAxe)
            this.reseveArea(allCoordinates, mainAxe)
            if (this.isBot) return
            
            allCoordinates.forEach(array => {
                const cells = document.getElementsByClassName(`${array[0]},${array[1]}`);
                const cell = cells[0] //left field
                cell.setAttribute('id', 'ship')
            })

            this.startTheGame(this.areAllShipsPlaced())
        },

        recieveAttack(attackAt, whoAttacked = 'player') {
            const cellsWithCoordinatesOfAttack = document.getElementsByClassName(`${attackAt[0]},${attackAt[1]}`)
            let attackedCell = cellsWithCoordinatesOfAttack[0];
            whoAttacked == 'bot' ? attackedCell = cellsWithCoordinatesOfAttack[0] : attackedCell = cellsWithCoordinatesOfAttack[1];
            //check either coordinates matches ships coordianates
            if (this.isShipExistOn(attackAt)) {
                //if they do => hit ship at this coordinates
                this.hitShipOn(attackAt)
                //game ends?
                if (this.areAllShipsSunk()) this.theGameEnds()
                //let player that hit make turn again
                this.lastShotHit = 'true'
                //show it at the field
                attackedCell.classList.add('hitted')
            } else {
                //if they don't => keep coordinates of miss 
                this.coordinates.ofMissedAttacks.push(attackAt)
                //let player that miss pass turn 
                this.lastShotHit = 'false'
                //show it at the field
                attackedCell.classList.add('missed')
            }
        },

        areAllShipsSunk() {//end of the game
            for (let xcells in this.ships) {
                for (let byOrder in this.ships[xcells]) {
                    if (this.ships[xcells][byOrder] == null) continue
                
                    const sinkingOfShip = this.ships[xcells][byOrder].sink;
                    if (sinkingOfShip == 'false') {
                        return false
                    }
                }
            }
            return true
        },

        makeShip(areaToPlace, allCoordinates, cells) {
            for (let ship in areaToPlace) {
                if (areaToPlace[ship] == null) {
                    areaToPlace[ship] = createShip(cells);
                    areaToPlace[ship].coordinates = allCoordinates;
                    this.coordinates.ofShips.push(...allCoordinates);
                    break
                }
            }
        },
        
        isShipExistOn(arrayOfCoordinates) {
            if (this.coordinates.ofShips.length == 0) return false

            if (typeof(arrayOfCoordinates[0]) == 'object') {
                for (let i = 0; i < arrayOfCoordinates.length; i++){
                    const existingShip = this.coordinates.ofShips.filter((shipCoordinates) => { 
                    return (shipCoordinates[0] == arrayOfCoordinates[i][0] && shipCoordinates[1] == arrayOfCoordinates[i][1])
                })

                if (existingShip.length > 0) { //that means that ship was filtered and exist
                   return true
                }
            }
                
            } else if (typeof(arrayOfCoordinates[0]) == 'number') { 
                const existingShip = this.coordinates.ofShips.filter((shipCoordinates) => { 
                    return (shipCoordinates[0] == arrayOfCoordinates[0] && shipCoordinates[1] == arrayOfCoordinates[1])
                })

                if (existingShip.length > 0) { //that means that ship was filtered and exist
                   return true
                }
            }

            return false
        },
        
        hitShipOn(position) {
            for (let xcells in this.ships) {
                for (let byOrder in this.ships[xcells]) {
                    if (this.ships[xcells][byOrder] == null) continue
                    
                    const coordinatesOfShip = this.ships[xcells][byOrder].coordinates;
                    for (let i = 0; i < coordinatesOfShip.length; i++) {
                        if (coordinatesOfShip[i][0] == position[0] && coordinatesOfShip[i][1] == position[1]) {
                            this.ships[xcells][byOrder].hit()
                        }
                    }
                }
            }
        },
        
        defineShipInItsGroup(coordinates, cells, mainAxe) {
            if (cells == 1) {
                this.makeShip(this.ships.onecells, coordinates, cells, mainAxe)
            } else if (cells == 2) {
                this.makeShip(this.ships.twocells, coordinates, cells, mainAxe)
            } else if (cells == 3) {
                this.makeShip(this.ships.threecells, coordinates, cells, mainAxe)
            } else if (cells == 4) {
                this.makeShip(this.ships.fourcells, coordinates, cells, mainAxe)
            }
        },

        placeShipAtRandomPosition(lengthOfShip) {
            let coordianates = [];
            let increaser = 0;
            let axes = ['x', 'y'];
            let mainAxe = 0;

            mainLoop:
            while (coordianates.length < lengthOfShip) { 
                let chosenAxe = axes[Math.round(Math.random())];

                if (chosenAxe == 'x') { 
                    const x = Math.round(Math.random() * 10)
                    const y = Math.round(Math.random() * 10)
                    if (x == 0) { 
                        continue mainLoop
                    }else if (y == 0) { 
                        continue mainLoop
                    } 
                    

                    for (let i = 0; i < lengthOfShip; i++){ 
                        let shipOn = this.coordinates.ofReservedArea.filter((ship) => { 
                            return ship[0] == (x + increaser) && ship[1] == y
                        })

                        if (shipOn.length > 0) {//means that ship already exist
                            coordianates = []; 
                            increaser = 0; 
                            continue mainLoop
                        } else if (x + increaser > 10) {
                            coordianates = []; 
                            increaser = 0; 
                            continue mainLoop
                        }

                        coordianates.push([x + increaser, y])
                        mainAxe = chosenAxe;
                        increaser++
                    }
                } else { 
                    const x = Math.round(Math.random() * 10)
                    const y = Math.round(Math.random() * 10)
                     if (x == 0) { 
                        continue mainLoop
                    }else if (y == 0) { 
                        continue mainLoop
                    } 
                    
                    for (let i = 0; i < lengthOfShip; i++){
                        let shipOn = this.coordinates.ofReservedArea.filter((ship) => { 
                            return ship[0] == x  && ship[1] == (y + increaser)
                        })

                        if (shipOn.length > 0) { //means that ship already exist
                            coordianates = []; 
                            increaser = 0; 
                            continue mainLoop
                        } else if (y + increaser > 10) {
                            coordianates = []; 
                            increaser = 0; 
                            continue mainLoop
                        }
                        coordianates.push([x, y + increaser]);
                        mainAxe = chosenAxe;
                        increaser++
                    }
                }

            }
            this.placeShip(coordianates[0], lengthOfShip, mainAxe) 
        },

        createRandomizedFleet() { 
                this.placeShipAtRandomPosition(1)
                this.placeShipAtRandomPosition(1)
                this.placeShipAtRandomPosition(1)
                this.placeShipAtRandomPosition(1)
                this.placeShipAtRandomPosition(2)
                this.placeShipAtRandomPosition(2)
                this.placeShipAtRandomPosition(2)
                this.placeShipAtRandomPosition(3)
                this.placeShipAtRandomPosition(3)
                this.placeShipAtRandomPosition(4)
        },

        theGameEnds(){ 
            if (confirm('The game has ended, wanna replay')) { 
                        document.location.reload();
            } else { 
                alert('there`s nothing left to do, enjoy your self')

                const fields = document.getElementsByClassName('battlefield');
                Array.from(fields).forEach(field => { 
                    field.setAttribute('data', 'unclickable');
                })
            }
        }, 

       areAllShipsPlaced(field) { 
            return field.coordinates.ofShips.length == 20 ?  true : false ; 
        },

        startTheGame(boolean) {
            if (boolean == false) return; 
            const draggableShips = document.getElementById('shipArea') || document.getElementById('shipAreaY') ;
            draggableShips.style.display = 'none'; 

            const opponentsField = document.getElementById('oponents');
            opponentsField.removeAttribute('data', 'unclickable');

            const cells = document.getElementsByClassName('cell');
            Array.from(cells).forEach(element => {
                element.removeAttribute('data')
            });
        },

        areAllShipsPlaced() { 
         return this.coordinates.ofShips.length == 20 ?  true : false ; 
        },
        
        reseveArea(coordianates, mainAxe) {
            if (coordianates == null || coordianates == undefined) return
            
            const reserve = [];
            if (mainAxe == 'x') { 
                for (let i = 0; i < coordianates.length; i++) {
                    if (i == 0) {
                        reserve.push([coordianates[i][0] - 1, coordianates[i][1]])
                        reserve.push([coordianates[i][0] - 1, coordianates[i][1] + 1])
                        reserve.push([coordianates[i][0] - 1, coordianates[i][1] - 1])
                    }

                    if (i == coordianates.length - 1) {
                        reserve.push([coordianates[i][0] + 1, coordianates[i][1]])
                        reserve.push([coordianates[i][0] + 1, coordianates[i][1] + 1])
                        reserve.push([coordianates[i][0] + 1, coordianates[i][1] - 1])
                    }

                    reserve.push([coordianates[i][0], coordianates[i][1] + 1])
                    reserve.push([coordianates[i][0], coordianates[i][1] - 1])
                }
            } else { 
                for (let i = 0; i < coordianates.length; i++) {
                    if (i == 0) {
                        reserve.push([coordianates[i][0], coordianates[i][1] - 1] )
                        reserve.push([coordianates[i][0] + 1, coordianates[i][1] - 1])
                        reserve.push([coordianates[i][0] - 1, coordianates[i][1] - 1])
                    }
                    if (i == coordianates.length - 1) {
                        reserve.push([coordianates[i][0], coordianates[i][1] + 1 ])
                        reserve.push([coordianates[i][0] + 1, coordianates[i][1] + 1])
                        reserve.push([coordianates[i][0] - 1, coordianates[i][1] + 1])
                    }
                        reserve.push([coordianates[i][0] + 1, coordianates[i][1]])
                        reserve.push([coordianates[i][0] - 1, coordianates[i][1]])
                }
            }
            reserve.push(...coordianates);
            this.coordinates.ofReservedArea.push(...reserve)
        }
    }
}

function coordinatesOfEachCell(start, amountOfCells, mainAxe){
    let coordinates = [];
    for (let i = 0; i < amountOfCells; i++){ 
        if (mainAxe == 'x' || !mainAxe) { 
            coordinates.push([start[0]+i, start[1]])
        }
        if (mainAxe == 'y' || !mainAxe) { 
            coordinates.push([start[0], start[1]+i])
        }
    }
    return coordinates
}

export default createField




      
