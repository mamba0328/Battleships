const createShip = function (cells) {
    return {
        lenght: cells,
        hits: 0,
        sink: false,
        isSunk() {
            if (this.hits == this.lenght) {
                this.sink = true
            }
        },
        hit(){
                this.hits++; 
                this.isSunk();
            }
    };
}  

export default createShip


