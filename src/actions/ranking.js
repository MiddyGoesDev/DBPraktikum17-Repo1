
/*
* Gets the statistics sorted by kills in a descending order.
* @return the list of statistics
*/
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

/*
* Gets the statistics sorted by kills in a ascending order.
* @return the list of statistics
*/
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

/*
* Gets the statistics sorted by profile name  in a ascending order.
* @return the list of statistics
*/
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

/*
* Gets the statistics sorted by kills in a descending order.
* @return the list of statistics
*/
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

/*
* Gets the statistics sorted by time played in a descending order.
* @return the list of statistics
*/
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

/*
* Gets the statistics sorted by kills in a ascending order.
* @return the list of statistics
*/
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

/*
* Gets the statistics of one specefic user.
* @return the list of stats
*/
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
