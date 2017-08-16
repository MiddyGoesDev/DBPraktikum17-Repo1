
export function getRanking() {
  return {
    'BAQEND': {
      type: "RANKING_SORTED",
      payload: (db) => {
        return db.Statistic.find().ascending("kills").resultList().then(result => {
          return result
        })
      }
    }
  }
}
