
export function getStats() {
  return {
    'BAQEND': {
      type: "STATISTICS_KILL",
      payload: (db) => {
        return db.User.find(db.User.me.username).singleResult().then((user) => {
          return user
        })
      }
    }
  }
}
