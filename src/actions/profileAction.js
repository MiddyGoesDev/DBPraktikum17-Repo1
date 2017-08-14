import { STATISTIC } from './types'

export function getStatsKill(userName) {
  return {
    'BAQEND': {
      type: "STATISTICS_KILL",
      payload: (db) => {
        return db.Statistic.find().equals("nameID", userName)
      }
    }
  }
}

// export function getStatsDeaths(User) {
//   return {
//     'BAQEND': {
//       type: "STATISTICS_DEATHS",
//       payload: (db) => {
//         return db.Statistic.death.equals("nameID",userName)
//       }
//     }
//   }
// }
//
// export function getStatsExp(User) {
//   return {
//     'BAQEND': {
//       type: "STATISTICS_EXP",
//       payload: (db) => {
//         return db.Statistic.xp.equals("nameID",userName)
//       }
//     }
//   }
// }
