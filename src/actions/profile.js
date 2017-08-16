
export function getStats() {
  return {
    'BAQEND': {
      type: "STATISTICS_KILL",
      payload: (db) => {
        return db.User.find().equal('id', db.User.me.id).singleResult().then((user) => {
          return user
        })
      }
    }
  }
}
