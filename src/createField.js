import { check } from "prettier"
import createShip from "./createShip"

function createField() { 
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
            ofShips: [[0,0]],
            ofMissedAttacks: [],
        },

        //methods 
        placeShip(position, cells, mainAxe) { 
            if (typeof (position) != 'object') { 
                return 'typeof coordinates is invalid, use obj'
            }

            const allCoordinates = coordinatesOfEachCell(position, cells, mainAxe)
            if (this.isShipExistOn(allCoordinates)) { 
                return alert('ship exist at such location')
            }

            //mechanic of placing 
            this.defineShipInItsGroup(allCoordinates, cells, mainAxe)
            /*
            if (cells == 1) {
                this.createShip(this.ships.onecells, allCoordinates, cells, mainAxe)
            } else if (cells == 2) { 
                this.createShip(this.ships.twocells, allCoordinates, cells, mainAxe)
            } else if (cells == 3) { 
               this.createShip(this.ships.threecells, allCoordinates, cells, mainAxe)
            } else if (cells == 4) { 
                this.createShip(this.ships.fourcells, allCoordinates, cells, mainAxe)
            }  
            */
        },

        recieveAttack(attackAt) { 
            //check either coordinates matches ships coordianates
            if (this.isShipExistOn([attackAt])) { 
            //if they do => hit ship at this coordinates
                this.hitShipOn(attackAt)
                //game ends?
                this.areAllShipsSunk()
                //let player that hit make turn again
                this.lastShotHit = 'true'
                //show it at the field
            }else { 
                //if they don't => keep coordinates of miss 
                this.coordinates.ofMissedAttacks.push(attackAt)
                //let player that miss pass turn 
                this.lastShotHit = 'false'
                //show it at the field
            }
        },

        areAllShipsSunk() { 
            for (let xcells in this.ships) {
                for (let byOrder in this.ships[xcells]) {
                    if (this.ships[xcells][byOrder] == null) continue
                
                    const sinkingOfShip = this.ships[xcells][byOrder].sink;
                    if (sinkingOfShip == 'false') {
                        return console.log(false)
                    }
                    
               }
            }
            return console.log(true)
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

        placeShipAtRandomPosition(lengthOfShip) { 
            let coordianates = [];
            let increaser = 0; 
            let axes = ['x', 'y']; 
            let mainAxe = 0;
            let iteration = 0;

            mainLoop:
            while (coordianates.length < lengthOfShip) { 
                console.log(iteration)
                
                let x = Math.round(Math.random() * 10); 
                let y = Math.round(Math.random() * 10);
                
                mainAxe = axes[Math.round(Math.random())]; 
                if (mainAxe == 'x') {
                    for (let i = 0; i < this.coordinates.ofShips.length; i++) {
                        if ((this.coordinates.ofShips[i][0] == (x + increaser)) && (this.coordinates.ofShips[i][1] == y)) {
                            alert('i`m here')
                            console.log([x,y], this.coordinates.ofShips[i], increaser)
                            coordianates = [];
                            increaser = 0;
                            iteration
                            continue mainLoop
                        }
                        coordianates.push([x, y])
                        ++increaser
                    }
                } else if (mainAxe == 'y') {
                    for (let i = 0; i < this.coordinates.ofShips.length; i++) {
                        if ((this.coordinates.ofShips[i][0] == x) && (this.coordinates.ofShips[i][1] == (y + increaser))) {
                            alert('i`m here')
                            console.log([x,y], this.coordinates.ofShips[i], increaser)
                            coordianates = [];
                            increaser = 0;
                            iteration++
                            continue mainLoop
                        } 
                        coordianates.push([x, y])
                        ++increaser
                    }
                }
            }
            console.log(coordianates[0])
            this.placeShip(coordianates[0], lengthOfShip, mainAxe);
        },

        //suport methods
        createShip(areaToPlace, allCoordinates, cells) { 
            for (let ship in areaToPlace) {
                if (areaToPlace[ship] == null) { 
                    areaToPlace[ship] = createShip(cells);
                    areaToPlace[ship].coordinates = allCoordinates;
                    this.coordinates.ofShips.push(...allCoordinates)
                    break
                }
             }
        },
        
        isShipExistOn(arrayOfCoordinates){ 
             for (let i = 0; i < arrayOfCoordinates.length; i++){
                 for (let j = 0; j < this.coordinates.ofShips.length; j++) {
                    
                     if (arrayOfCoordinates[i][0] == this.coordinates.ofShips[j][0] && arrayOfCoordinates[i][1] == this.coordinates.ofShips[j][1]) {
                         console.log(arrayOfCoordinates[i], this.coordinates.ofShips[j])
                         return true
                     }
                }
            }
            return false
        },
        
        hitShipOn(position) { 
            for (let xcells in this.ships) {
                for (let byOrder in this.ships[xcells]) {
                    if (this.ships[xcells][byOrder] == null) continue
                    
                    const xyOfShip = this.ships[xcells][byOrder].coordinates;
                    for (let i = 0; i < xyOfShip.length; i++){ 
                        if (xyOfShip[i][0] == position[0] && xyOfShip[i][1] == position[1]) {
                            this.ships[xcells][byOrder].hit()
                        }
                   }
               }
            }
        },
        
        defineShipInItsGroup(coordinates, cells, mainAxe) { 
             if (cells == 1) {
                this.createShip(this.ships.onecells, coordinates, cells, mainAxe)
            } else if (cells == 2) { 
                this.createShip(this.ships.twocells, coordinates, cells, mainAxe)
            } else if (cells == 3) { 
               this.createShip(this.ships.threecells, coordinates, cells, mainAxe)
            } else if (cells == 4) { 
                this.createShip(this.ships.fourcells, coordinates, cells, mainAxe)
            }  
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

