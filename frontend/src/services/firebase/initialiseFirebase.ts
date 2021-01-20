import firebase from 'firebase/app'

import 'firebase/firestore'
import 'firebase/analytics'
import 'firebase/auth'

const firebaseConfig =
  process.env.NODE_ENV === 'production'
    ? {
        apiKey: 'AIzaSyCVa4tgSTtQPZLZa0D0i672ewQl6-anDBY',
        authDomain: 'theodercafe-302118.firebaseapp.com',
        projectId: 'theodercafe-302118',
        storageBucket: 'theodercafe-302118.appspot.com',
        messagingSenderId: '893586425895',
        appId: '1:893586425895:web:9d3c8dc0e05255e80fe602',
        measurementId: 'G-8NPN5DR6SZ',
      }
    : {
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
