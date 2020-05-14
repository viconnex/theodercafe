import React, { useState, useEffect } from 'react'
import { fetchRequestResponse } from 'services/api'
import { useSnackbar } from 'notistack'
import { Alterodo } from 'components/Alterodo'
import './style.css'

const AlterodoPage = () => {
  const [alterodos, setAlterodos] = useState(null)

  const { enqueueSnackbar } = useSnackbar()

  const fetchAlterodos = async () => {
    const response = await fetchRequestResponse({ uri: '/user_to_question_choices/alterodos', method: 'GET' }, 200, {
      enqueueSnackbar,
    })
    if (!response) {
      return
    }
    const alterodos = await response.json()
    setAlterodos(alterodos)
  }

  useEffect(() => {
    fetchAlterodos()
    // eslint-disable-next-line
  }, []);

  if (!alterodos) return <div>Loading</div>

  return (
    <div className="alterodo-page">
      <Alterodo
        alterodos={alterodos}
        resetQuestioning={() => {
          window.location = '/'
        }}
      />
    </div>
  )
}

export default AlterodoPage
