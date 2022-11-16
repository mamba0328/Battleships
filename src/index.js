import createShip from './createShip'
import createField from './createField'

let field = createField(); 

field.createRandomizedFleet()
console.log(field)