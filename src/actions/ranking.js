
export function getRanking() {
  return {
    'BAQEND': {
      type: "RANKING_SORTED",
      payload: (db) => {
        return db.Statistic.find().descending("kd").resultList().then(result => {
          return result
        })
      }
    }
  }
}
