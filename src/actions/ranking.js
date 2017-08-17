
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

export function getStatsByProfileDsc() {
  return {
    'BAQEND': {
      type: "RANKING_PROFILE_DSC",
      payload: (db) => {
        return db.Statistic.find().descending("username").resultList().then(result => {
          return result
        })
      }
    }
  }
}

export function getStatsByProfileAsc() {
  return {
    'BAQEND': {
      type: "RANKING_PROFILE_ASC",
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

export function getStatsForProfile(user) {
  return {
    'BAQEND': {
      type: "RANKING_PROFILE_STATS",
      payload: (db) => {
        return db.Statistic.find().equal('username', user).singleResult().then((result) => {
          return result
        })
      }
    }
  }
}
