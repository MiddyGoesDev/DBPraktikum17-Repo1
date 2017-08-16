
export function getStats() {
  return {
    'BAQEND': {
      type: "STATISTICS_KILL",
      payload: (db) => {
        return db.Statistic.find().equal('owner', db.User.me.id).singleResult().then((user) => {
          return user
        })
      }
    }
  }
}
