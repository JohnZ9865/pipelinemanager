const collectionNames = ["initialconnect", "inconvo", "postcall", "booked", "longterm", "dead", "finished"];



const formalwords = new Map([
    ['initialconnect', 'Initial Connect'],
    ['inconvo', 'In Conversation'],
    ['postcall', 'Post Call'],
    ['booked', 'Booked Calls'],
    ['longterm', 'Long Term'],
    ['dead', 'Dead'],
    ['finished', 'Finished'],
  ]);

// const row1 = ['initialconnect', 'inconvo', 'Booked Calls'];
// const row2 = ['Post Call', 'Long Term'];
// const row3 = ['Finished', 'Dead'];

const columnObjects = [
    {name: 'initialconnect', formalwords: 'Initial Connect', row: 1}, 
    {name: 'inconvo', formalwords: 'In Conversation', row: 1},
    {name: 'postcall', formalwords: 'Post Call', row: 2},
    {name: 'booked', formalwords: 'Booked Calls', row: 1},
    {name: 'longterm', formalwords: 'Long Term', row: 2},
    {name: 'dead', formalwords: 'Dead', row: 3},
    {name: 'finished', formalwords: 'Finished', row: 3},
]




export { collectionNames, formalwords, columnObjects };