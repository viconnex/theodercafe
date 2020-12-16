import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { SnackbarProvider } from 'notistack'
import firebase from 'firebase/app'
import App from './App'
import * as serviceWorker from './serviceWorker'

import 'firebase/firestore'
import 'firebase/analytics'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBAnVOIji4axVKbeYQCxcfINzCy4ujMJqs',
  authDomain: 'theodercafe.firebaseapp.com',
  databaseURL: 'https://theodercafe.firebaseio.com',
  projectId: 'theodercafe',
  storageBucket: 'theodercafe.appspot.com',
  messagingSenderId: '509723639859',
  appId: '1:509723639859:web:50e3385a4bb93b054d2346',
  measurementId: 'G-0L0YG5XCG2',
}

firebase.initializeApp(firebaseConfig)
firebase.analytics()

export const db = firebase.firestore()
export const firebaseAuth = firebase.auth()

ReactDOM.render(
  <SnackbarProvider maxSnack={2} autoHideDuration={1300}>
    <App />
  </SnackbarProvider>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
