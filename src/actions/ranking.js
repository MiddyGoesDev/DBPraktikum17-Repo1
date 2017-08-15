
export function getRanking() {
  return {
    'BAQEND': {
      type: "RANKING_SORTED",
      payload: (db) => {
        return db.User.find().ascending("kills").resultList()
      }
    }
  }
}

// .then((result)=>{
//   console.log("RANKING:" + result)
//   return result;
// });

// export function getMessages() {
//     return {
//         'BAQEND': {
//             type: "MESSAGES_NEXT",
//             payload: (db) => {
//               return db.Message.find().ge("date", new Date().toISOString()).ascending("date").resultStream()
//               console.log(db.Message.find().ascending("date").resultStream());
//             }
//         }
//     }
// }
