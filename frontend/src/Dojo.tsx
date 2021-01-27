import { Button } from '@material-ui/core'
import React from 'react'
import { db } from 'services/firebase/initialiseFirebase'

const Dojo = () => {
  const onClick = () => {
    void db.collection('messages').add({ coucou: 'cv' })
  }

  return (
    <Button onClick={onClick} color="secondary" variant="contained">
      Poster un message
    </Button>
  )
}

export default Dojo
