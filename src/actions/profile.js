import { STATISTIC } from './types'

export function getStatsKill() {

  return {
    'BAQEND': {
      type: "STATISTICS_KILL",
      payload: (db) => {
        return db.User.find(db.User.me.username).singleResult().then((user) => {
          console.log("Stats",
          user.kills,
          user.deaths,
          user.xp,
          user.playingTime,
        )
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

// meistens ist es am einfachsten das object mit der referenz schon mit einem depth parameter zu laden.
// Beispiel von: https://www.baqend.com/guide/topics/crud/#read
// DB.Todo.load('Todo1', {depth: 1}).then(function(todo) {
//   // With 'depth: 1' all directly referenced objects will be loaded.
// });

// DB.Todo.load('Todo1', {depth: 1}).then(function(todo) {
//   // With 'depth: 1' all directly referenced objects will be loaded.
// });

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
