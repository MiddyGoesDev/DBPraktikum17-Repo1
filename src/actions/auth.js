import { USER_LOGIN, USER_REGISTER, USER_LOGOUT } from './types'

export function login(username, password) {
  return {
    'BAQEND': {
      type: USER_LOGIN,
      payload: (db) => db.User.login(username, password)
    }
  }
}

export function register(username, password) {
  return {
    'BAQEND': {
      type: USER_REGISTER,
      payload: (db) => {
        db.User.register(username, password);
        new db.Opponent({
            id: db.User.me.id,
            x: this.x,
            y: this.y,
            animation: this.sprite.currentAnimation,
            direction: this.direction,
            playing: false
        }).insert();
      }
    }
  }
}

export function logout() {
  return {
    'BAQEND': {
      type: USER_LOGOUT,
      payload: (db) => db.User.logout()
    }
  }
}
