import { STATISTIC } from './types'

export function getStatsKill(User) {
  return {
    'BAQEND': {
      type: "STATISTICS_GET",
      payload: (db) => {
        return db.Statistic.kills.find(User)
      }
    }
  }
}

export function getStatsDeaths(User) {
  return {
    'BAQEND': {
      type: "STATISTICS_GET",
      payload: (db) => {
        return db.Statistic.kills.find(User)
      }
    }
  }
}

export function getStatsExp(User) {
  return {
    'BAQEND': {
      type: "STATISTICS_GET",
      payload: (db) => {
        return db.Statistic.kills.find(User)
      }
    }
  }
}
