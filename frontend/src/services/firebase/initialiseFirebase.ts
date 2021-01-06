import firebase from 'firebase/app'

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
