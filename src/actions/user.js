import Stitch from 'Stitch'
import {
  UserPasswordAuthProviderClient,
  UserPasswordCredential,
} from 'mongodb-stitch-browser-sdk'
import {
  USER__SIGN_UP,
  USER__LOG_IN,
  USER__CONFIRM_EMAIL,
  USER__LOG_OUT,
  USER__LOAD,
} from 'Constants'

const emailPassClient = Stitch.auth
  .getProviderClient(UserPasswordAuthProviderClient.factory)

export const getCurrentUser = () => (dispatch) => {
  dispatch({
    type: USER__LOAD,
    payload: Stitch.auth.user,
  })
}

export const signUpUser = ({email, password}) => async (dispatch) => {
  try {
    await emailPassClient.registerWithEmail(email, password)

    dispatch({type: USER__SIGN_UP})
  }
  catch(error) {
    console.error(error)
  }
}

export const confirmUserEmail = ({token, tokenId}) => async (dispatch) => {
  try {
    await emailPassClient.confirmUser(token, tokenId)

    dispatch({type: USER__CONFIRM_EMAIL})
  }
  catch(error) {
    console.error(error)
  }
}

export const logInUser = ({email, password}) => async (dispatch) => {
  const credential = new UserPasswordCredential(email, password)
  const user = await Stitch.auth.loginWithCredential(credential)
  await Stitch.callFunction('addUser', [{}])

  dispatch({
    type: USER__LOG_IN,
    payload: user,
  })
}

export const logOutUser = () => async (dispatch) => {
  try {
    await Stitch.auth.logout()

    dispatch({type: USER__LOG_OUT})
  }
  catch(error) {
    console.error()
  }
}
