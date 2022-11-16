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
        if(typeof(attackCoordinates) != 'object') return 'Coordinates '
        
        if (this.name == 'bot') { 
            this.botsAttack()
        } else { 

            for (let i = 0; i < this.shots.length; i++){ 
              if (this.shots[i][0] == attackCoordinates[0] && this.shots[i][1] == attackCoordinates[1]) return 'You shot here already'
            }

            this.opponentsField.recieveAttack(attackCoordinates);
            this.shots.push(attackCoordinates)
        }
        
    }

    botsAttack() { 
        if (this.name != 'bot') return 'you don`t have permission to obtein bot`s power';
        
        this.opponentsField.recieveAttack(this.findUnshootedSpot());
    }

    findUnshootedSpot() { 
        mainLoop:
        while (0 > 1) { 
            let x = Math.round(Math.random() * 10); 
            let y = Math.round(Math.random() * 10);
            
            for (let i = 0; i < this.shots.length; i++){ 
                if (this.shots[i][0] == x && this.shots[i][1] == y) continue mainLoop
            }

            this.shots.push([x, y]);
            return [x, y]
        }
    }
}

export default Player