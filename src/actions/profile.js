import { STATISTIC } from './types'

export function getStatsKill() {
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
