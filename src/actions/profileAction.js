import { STATISTIC } from './types'

export function getStatsKill() {

  return {
    'BAQEND': {
      type: "STATISTICS_KILL",
      payload: (db) => {
        return db.User.find(db.User.me.username).singleResult()
         .then((user) => {
           return user
         }
        )
      //     return db.User.me.username.then((proxy) => {console.log(proxy.username);
      //     return proxy;
      //  })
        //  return db.User.me.singleResult()
        //    .then((result) => {
        //            console.log(result)
        //        })
        //        .catch((err) => {
        //            console.log(err)
        //        })
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
