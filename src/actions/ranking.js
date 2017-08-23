
export function getStatsByKillsAsc() {
  return {
    'BAQEND': {
      type: "RANKING_KILLS_ASC",
      payload: (db) => {
        return db.Statistic.find().descending("kills").resultList().then(result => {
          return result
        })
      }
    }
  }
}

export function getStatsByKillsDsc() {
  return {
    'BAQEND': {
      type: "RANKING_KILLS_DSC",
      payload: (db) => {
        return db.Statistic.find().ascending("kills").resultList().then(result => {
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

export function getStatsByPlayingTimeDsc() {
  return {
    'BAQEND': {
      type: "RANKING_PLAYINGTIME_DSC",
      payload: (db) => {
        return db.Statistic.find().descending("playingTime").resultList().then(result => {
          return result
        })
      }
    }
  }
}

export function getStatsByPlayingTimeAsc() {
  return {
    'BAQEND': {
      type: "RANKING_PLAYINGTIME_ASC",
      payload: (db) => {
        return db.Statistic.find().ascending("playingTime").resultList().then(result => {
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
