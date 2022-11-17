import createShip from './createShip'
import createField from './createField'
import Player from './Player'

test('ship is isSunk', () => {
    let battlship = createShip(2); 
    battlship.hit()
    battlship.hit()
    expect(battlship.sink).toBe('true')
}) 

test('Ship was hitted after attack', () => { 
    const playersField = createField()
    playersField.placeShip([1, 1], 1, 'x')
    playersField.recieveAttack([1, 1])
    expect(playersField.ships.onecells.first.hits).toBe(1);
})
test('Second ship was hitted after attack', () => { 
    const playersField = createField()
    playersField.placeShip([1, 1], 1, 'x')
    playersField.placeShip([1, 3], 1, 'x')
    playersField.recieveAttack([1, 3])
    expect(playersField.ships.onecells.second.hits).toBe(1);
})


test('Ship was`t hitted after missed attack', () => { 
    const playersField = createField()
    playersField.placeShip([3, 4], 1, 'x')
    playersField.recieveAttack([3, 1])
    expect(playersField.ships.onecells.first.hits).toBe(0);
})


test('Ship was hitted at different spot', () => { 
    const playersField = createField()
    playersField.placeShip([10, 7], 1, 'x')
    playersField.recieveAttack([10, 7])
    expect(playersField.ships.onecells.first.hits).toBe(1);
})



test('hit() was called', () => {
    const playersField = createField()
    playersField.placeShip([1, 1], 1, 'x')
    playersField.recieveAttack([1, 1])
    expect(playersField.ships.onecells.first.hit())
})

test('Contain misses', () => {
    const playersField = createField()
    playersField.placeShip([1, 1], 1, 'x')
    playersField.recieveAttack([1, 2])
    expect(playersField.coordinates.ofMissedAttacks.push([1,2]))
})

test('Hits Y fourcell', () => {
    const playersField = createField()
    playersField.placeShip([1, 4], 4, 'y')
    playersField.recieveAttack([1, 6])
    expect(playersField.ships.fourcells.first.hit())
})

test('Hits Y fourcell', () => {
    const playersField = createField()
    playersField.placeShip([1, 4], 4, 'y')
    playersField.recieveAttack([1, 6])
    expect(playersField.ships.fourcells.first.hit())
})

test('Player is defined', () => {
    const bestPlayer = new Player('Jonh')
    expect(bestPlayer).toBeDefined()
})

test('Player has Attacked', () => {
    const player = new Player('Val9')
    const bot = new Player('bot', player.field)
    player.opponentsField = bot.field
    player.sendAttack([1,1])
    expect(bot.recieveAttack)
})

test('Bot has Attacked', () => {
    const player = new Player('Val9')
    const bot = new Player('bot', player.field)
    player.opponentsField = bot.field
    bot.sendAttack()
    expect(player.recieveAttack)
})

test('Create one randomized ship', () => { 
    const playersField = createField();
    playersField.placeShipAtRandomPosition(1);
    expect(playersField.ships.onecells.first)
})

test('Randomize all ships', () => { 
    const playersField = createField();
    playersField.createRandomizedFleet();
    expect(playersField.coordinates.ofShips.length).toBe(20)
})
