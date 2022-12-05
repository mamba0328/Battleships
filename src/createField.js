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
            ofReservedArea: [],
            ofAttacks: [],
        },

        isBot: bot, 

        lastShotHit: false, 
        //methods 
        placeShip(position, cells, mainAxe) {
            
            if (typeof (position) != 'object') {
                return false
            }

            const allCoordinates = coordinatesOfEachCell(position, cells, mainAxe);

            if (this.isPlaceReserved(allCoordinates)) {
                return false
            } else if (mainAxe == 'x' && (position[0] + cells - 1> 10)) {
                return false
            } else if (mainAxe == 'y' && (position[1] + cells - 1> 10)) {
                return false
            }

            //mechanic of placing 
            if (cells == 1) {
                this.makeShip(this.ships.onecells, allCoordinates, cells, this.reseveArea(allCoordinates, mainAxe));
            } else if (cells == 2) {
                this.makeShip(this.ships.twocells, allCoordinates, cells, this.reseveArea(allCoordinates, mainAxe));
            } else if (cells == 3) {
                this.makeShip(this.ships.threecells, allCoordinates, cells, this.reseveArea(allCoordinates, mainAxe));
            } else if (cells == 4) {
                this.makeShip(this.ships.fourcells, allCoordinates, cells, this.reseveArea(allCoordinates, mainAxe));
            }

            if (this.isBot) return
            
            allCoordinates.forEach(array => {
                const cells = document.getElementsByClassName(`${array[0]},${array[1]}`);
                const cell = cells[0] //left field
                cell.setAttribute('id', 'ship')
            })

            this.startTheGame(this.areAllShipsPlaced())
            return true
        },

        recieveAttack(attackAt, whoAttacked = 'player') {
            const cellsWithCoordinatesOfAttack = document.getElementsByClassName(`${attackAt[0]},${attackAt[1]}`)
            let attackedCell = cellsWithCoordinatesOfAttack[0];
            whoAttacked == 'bot' ? attackedCell = cellsWithCoordinatesOfAttack[0] : attackedCell = cellsWithCoordinatesOfAttack[1];
            //check either coordinates matches ships coordianates
            if (this.isShipExistOn(attackAt)) {
                //if they do => hit ship at this coordinates
                this.hitShipOn(attackAt, whoAttacked); //if function will provoke ships sinking it will return array of reserved area which will be addede to bot's shot to be concidered then 
                //let player that hit make turn again
                this.lastShotHit = true;
                //show it at the field
                attackedCell.classList.add('hitted');
                this.coordinates.ofAttacks.push(attackAt);
                //game ends?
                if (this.areAllShipsSunk()) this.theGameEnds();
            } else {
                //if they don't => keep coordinates of miss 
                this.coordinates.ofAttacks.push(attackAt)
                //let player that miss pass turn 
                this.lastShotHit = false
                //show it at the field
                attackedCell.classList.add('missed')
            }
        },

        areAllShipsSunk() {//end of the game
            for (let xcells in this.ships) {
                for (let byOrder in this.ships[xcells]) {
                    if (this.ships[xcells][byOrder] == null) continue
                
                    const sinkingOfShip = this.ships[xcells][byOrder].sink;
                    if (sinkingOfShip == false) {
                        return false
                    }
                }
            }
            return true
        },

        makeShip(areaToPlace, allCoordinates, cells, areaAround) {
            for (let ship in areaToPlace) {
                if (areaToPlace[ship] == null) {
                    areaToPlace[ship] = createShip(cells);
                    areaToPlace[ship].coordinates = allCoordinates;
                    areaToPlace[ship].areaAround = areaAround;
                    this.coordinates.ofShips.push(...allCoordinates);
                    break
                }
            }
        },
        
        isShipExistOn(arrayOfCoordinates) {
            if (this.coordinates.ofShips.length == 0) return false

            if (typeof (arrayOfCoordinates[0]) == 'object') {
                
                for (let i = 0; i < arrayOfCoordinates.length; i++){
                    const existingShip = this.coordinates.ofShips.filter((shipCoordinates) => { 
                      return (shipCoordinates[0] == arrayOfCoordinates[i][0] && shipCoordinates[1] == arrayOfCoordinates[i][1])
                     })

                    if (existingShip.length > 0) { //that means that ship was filtered and exist
                      return true
                    }
                }

            } else if (typeof (arrayOfCoordinates[0]) == 'number') { 
                const existingShip = this.coordinates.ofShips.filter((shipCoordinates) => { 
                    return (shipCoordinates[0] == arrayOfCoordinates[0] && shipCoordinates[1] == arrayOfCoordinates[1])
                })

                if (existingShip.length > 0) { //that means that ship was filtered and exist
                   return true
                }
            }

            return false
        },

        isPlaceReserved(arrayOfCoordinates) {
            if (this.coordinates.ofShips.length == 0) return false

            if (typeof(arrayOfCoordinates[0]) == 'object') {
                for (let i = 0; i < arrayOfCoordinates.length; i++){
                    const existingShip = this.coordinates.ofReservedArea.filter((reservedCoordinates) => { 
                    return (reservedCoordinates[0] == arrayOfCoordinates[i][0] && reservedCoordinates[1] == arrayOfCoordinates[i][1])
                })

                if (existingShip.length > 0) { //that means that ship was filtered and exist
                   return true
                }
            }
                
            } else if (typeof(arrayOfCoordinates[0]) == 'number') { 
                const existingShip = this.coordinates.ofReservedArea.filter((reservedCoordinates) => { 
                    return (reservedCoordinates[0] == arrayOfCoordinates[0] && reservedCoordinates[1] == arrayOfCoordinates[1])
                })

                if (existingShip.length > 0) { //that means that ship was filtered and exist
                   return true
                }
            }

            return false
        },
        
        hitShipOn(position, whoAttacked) {
            for (let category in this.ships) { 
                for (let ship in this.ships[category]) { 

                    const itteratedShipCoordinates = this.ships[category][ship].coordinates; 

                    let matchingCoordsOfAttackAndShip = itteratedShipCoordinates.filter(coordsOfShip => { 
                        if (position[0] == coordsOfShip[0] && position[1] == coordsOfShip[1]) {
                            return true
                        }   
                    })
                    
                    if (matchingCoordsOfAttackAndShip.length > 0) this.ships[category][ship].hit(whoAttacked);

                    if (this.ships[category][ship].sink) {
                        this.makeAreaAroundSinkedShipHitted(this.ships[category][ship].areaAround, whoAttacked);
                        this.coordinates.ofAttacks.push(...this.ships[category][ship].areaAround);
                    }
                }
            }
        },

        makeAreaAroundSinkedShipHitted(array, whoAttacked) {
            array.forEach(coords => {
                const cellsWithCoordinatesOfAttack = document.getElementsByClassName(`${coords[0]},${coords[1]}`)
                let areaCell = cellsWithCoordinatesOfAttack[0];
                whoAttacked == 'bot' ? areaCell = cellsWithCoordinatesOfAttack[0] : areaCell = cellsWithCoordinatesOfAttack[1];
                areaCell.classList.add('missed')
            })
            
        },
        
        placeShipAtRandomPosition(lengthOfShip) {
            //TODO : check either all of the ships aren't created
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
            const shipsCounters = [document.getElementById('fourcellCounter'), document.getElementById('threecellCounter'), document.getElementById('twocellCounter'), document.getElementById('onecellCounter')]
            shipsCounters.forEach(counter => {
                counter.innerText = '0';
                counter.parentElement.parentElement.classList.add('dragging');
                counter.parentElement.parentElement.firstChild.removeAttribute('draggable');
                counter.parentElement.parentElement.firstChild.classList.remove('draggableShip');
                counter.parentElement.parentElement.firstChild.classList.add('draggableShipNotAnimated');
            })
            
            const opponentsField = document.getElementById('oponents');
            opponentsField.removeAttribute('data', 'unclickable');

            const cells = document.getElementsByClassName('cell');
            Array.from(cells).forEach(element => {
                element.removeAttribute('data')
            });

            const randomizeShipButton = document.querySelector('button')
            randomizeShipButton.style.display = 'none';
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
                    }if (i == coordianates.length - 1) {
                        reserve.push([coordianates[i][0], coordianates[i][1] + 1 ])
                        reserve.push([coordianates[i][0] + 1, coordianates[i][1] + 1])
                        reserve.push([coordianates[i][0] - 1, coordianates[i][1] + 1])
                    }
                    reserve.push([coordianates[i][0] + 1, coordianates[i][1]])
                    reserve.push([coordianates[i][0] - 1, coordianates[i][1]])
                }
            }

            let areaAroundShip = reserve.filter(result => {
                if(!(result[0] < 1) && !(result[0] > 10) && !(result[1] < 1) && !(result[1] > 10) ) return true
            })

            reserve.push(...coordianates);
            this.coordinates.ofReservedArea.push(...reserve)
            return areaAroundShip
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




      
