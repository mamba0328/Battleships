import createField from "./createField"

class Player { 
    constructor(name, opponentsField = undefined) { 
        this.name = name;
        this.shots = [];
        this.field = createField();
        this.lastShotHit = 'false';
        this.opponentsField = opponentsField; 
    }

    sendAttack(attackCoordinates = [1, 1]) {
        if (typeof (attackCoordinates) != 'object') return 'Coordinates';
        
        if (this.name == 'bot') { 
            this.botsAttack()
        } else { 
            let existingShot = this.shots.filter((shot) => { 
                return shot[0] == attackCoordinates[0] && shot[1] == attackCoordinates[1]
            })

            if (existingShot.length > 0) return console.log('You shoot here already')
            
            this.opponentsField.recieveAttack(attackCoordinates);
            this.shots.push(attackCoordinates)
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
                    
            let searchedCoordinates = this.shots.filter((arr) => {
                return arr[0] == x && arr[1] == y
            })

            //if searchedCoordinates already exist it means that shot on such location was alredy done
            if(searchedCoordinates.length > 0) continue mainLoop
            

            this.shots.push([x, y]);
            console.log([x,y])
            return [x, y]
        }
    }
}

export default Player