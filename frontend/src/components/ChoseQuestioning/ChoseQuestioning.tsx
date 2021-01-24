import { AdminQuestionResponse } from 'components/ChoseQuestioning/types'
import React, { useEffect, useState } from 'react'
import { fetchRequest } from 'services/api'

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'option1', headerName: 'Option 1', width: 130 },
  { field: 'option2', headerName: 'Option 2', width: 130 },
  { field: 'choice1count', headerName: 'Choix 1' },
  { field: 'choice2count', headerName: 'Choix 2' },
  { field: 'upVotes', headerName: 'Up votes' },
  { field: 'downVotes', headerName: 'Down votes' },
]

const ChoseQuestioning = () => {
  const [questions, setQuestions] = useState<AdminQuestionResponse[] | null>(null)

  const fetchQuestions = async () => {
    const response = await fetchRequest({ uri: '/questions', method: 'GET', body: null, params: null })
    const questionsReponse = (await response.json()) as AdminQuestionResponse[]
    setQuestions(questionsReponse)
  }

  useEffect(() => {
    void fetchQuestions()
  }, [])

  return questions ? <div>coucou</div> : <div>Loading...</div>
}

export default ChoseQuestioning
