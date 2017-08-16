
export function getStats() {
  return {
    'BAQEND': {
      type: "STATISTICS_KILL",
      payload: (db) => {
          return db.Character.find().equal('owner', db.User.me.id).singleResult().then((result) => {
            return db.Statistic.find().equal('character', result).singleResult().then((stats) => {
              return stats
            })
          })
          // return db.Statistic.find().equal('character', charID).singleResult().then((user) =>{
          //   console.log(charID);
          //   return user
          // })
        }
      }
    }
  }

// var CharID = db.Character.find().equal('owner', db.User.me.id).singleResult()
// return db.Statistic.find().equal('character', CharID).singleResult().then((user) => {
//   console.log(user);
//   return user
