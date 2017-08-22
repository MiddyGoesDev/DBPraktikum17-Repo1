
export function getStatsByKDAsc() {
  return {
    'BAQEND': {
      type: "RANKING_KD_ASC",
      payload: (db) => {
        return db.Statistic.find().descending("kd").resultList().then(result => {
          return result
        })
      }
    }
  }
}

export function getStatsByKDDsc() {
  return {
    'BAQEND': {
      type: "RANKING_KD_DSC",
      payload: (db) => {
        return db.Statistic.find().ascending("kd").resultList().then(result => {
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

export function getStatsByXPDsc() {
  return {
    'BAQEND': {
      type: "RANKING_XP_DSC",
      payload: (db) => {
        return db.Statistic.find().descending("xp").resultList().then(result => {
          return result
        })
      }
    }
  }
}

export function getStatsByXPAsc() {
  return {
    'BAQEND': {
      type: "RANKING_XP_ASC",
      payload: (db) => {
        return db.Statistic.find().ascending("xp").resultList().then(result => {
          return result
        })
      }
    }
  }
}

export function getStatistics(user) {
  return {
    'BAQEND': {
      type: "RANKING_PROFILE_STATS",
      payload: (db) => {
        return db.Statistic.find().equal('username', user).singleResult().then(result => result)
      }
    }
  }
}


// .then((abort) => {
// },
// (error) => {
// confirm(error.message);
// })
