const createShip = function (cells) {
    return {
        lenght: cells,
        hits: 0,
        sink: false,

        isSunk(whoAttacked) {
            if (this.hits == this.lenght) {
                this.sink = true
                this.decreaseNumberOfLeftShips(whoAttacked);
            }
        },
        hit(whoAttacked) {
            this.hits++;
            this.isSunk(whoAttacked);
        },

        decreaseNumberOfLeftShips(whoAttacked) {
            if (whoAttacked == 'bot') return
            let targetId = null;
            this.lenght == 4 ? targetId = 'fourcellLeft' : this.lenght == 3 ? targetId = 'threecellLeft' : this.lenght == 2 ? targetId = 'twocellLeft' : targetId = 'onecellLeft';
            const counter = document.getElementById(targetId);
            let countNum = counter.innerText - 1;
            countNum == 0 ? counter.parentElement.parentElement.classList.add('dragging') : console.log();
            counter.innerText = countNum;
        },
    };
}

export default createShip


