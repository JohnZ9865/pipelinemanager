const collectionNames = ["initialconnect", "inconvo", "postcall", "booked", "longterm", "dead", "finished"];

const precallcollections = ["initialconnect", "inconvo", "postcall", "booked"];
const longtermcollections = ["longterm", "dead"];
const finished = ["finished"];
const formalwords = new Map([
    ['initialconnect', 'Initial Connect'],
    ['inconvo', 'In Conversation'],
    ['postcall', 'Post Call'],
    ['booked', 'Booked'],
    ['longterm', 'Long Term'],
    ['dead', 'Dead'],
    ['finished', 'Finished'],
  ]);


export { collectionNames, precallcollections, longtermcollections, finished, formalwords };