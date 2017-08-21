
export function myStatistics() {
  return {
    'BAQEND': {
      type: "STATISTICS",
      payload: (db) => {
          return db.Character.find().equal('owner', db.User.me.id).singleResult().then((result) => {
            return db.Statistic.find().equal('character', result).singleResult().then((stats) => {
              return stats
            })
          })

        }
      }
    }
  }
