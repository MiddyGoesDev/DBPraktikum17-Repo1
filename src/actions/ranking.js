
export function getStatsByKD() {
  return {
    'BAQEND': {
      type: "RANKING_KD",
      payload: (db) => {
        return db.Statistic.find().descending("kd").resultList().then(result => {
          return result
        })
      }
    }
  }
}

export function getStatsByProfile() {
  return {
    'BAQEND': {
      type: "RANKING_PROFILE",
      payload: (db) => {
        return db.Statistic.find().ascending("username").resultList().then(result => {
          return result
        })
      }
    }
  }
}

export function getStatsByXP() {
  return {
    'BAQEND': {
      type: "RANKING_XP",
      payload: (db) => {
        return db.Statistic.find().descending("xp").resultList().then(result => {
          return result
        })
      }
    }
  }
}
