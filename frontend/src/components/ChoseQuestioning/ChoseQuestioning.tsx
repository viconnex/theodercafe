import { DataGrid } from '@material-ui/data-grid'
import useStyle from 'components/ChoseQuestioning/style'
import { AdminQuestionResponse, QuestioningResponse } from 'components/ChoseQuestioning/types'
import React, { useEffect, useState } from 'react'
import { fetchRequest } from 'services/api'

const columns = [
  { field: 'id', headerName: 'Id', width: 70 },
  { field: 'option1', headerName: 'Option 1', width: 300 },
  { field: 'option2', headerName: 'Option 2', width: 300 },
  { field: 'choice1count', headerName: 'C1', width: 80 },
  { field: 'choice2count', headerName: 'C2', width: 80 },
  { field: 'upVotes', headerName: 'UpV' },
  { field: 'downVotes', headerName: 'DownV' },
]

const questioningColumns = [
  { field: 'id', headerName: 'Id', width: 70 },
  { field: 'option1', headerName: 'Option 1', width: 300 },
  { field: 'option2', headerName: 'Option 2', width: 300 },
]

const ChoseQuestioning = () => {
  const [questions, setQuestions] = useState<AdminQuestionResponse[]>([])
  const [currentQuestioning, setCurrentQuestioning] = useState<QuestioningResponse | null>(null)

  const fetchQuestions = async () => {
    const response = await fetchRequest({ uri: '/questions', method: 'GET', body: null, params: null })
    const questionsReponse = (await response.json()) as AdminQuestionResponse[]
    setQuestions(questionsReponse)
  }
  const fetchQuestioning = async () => {
    const response = await fetchRequest({ uri: '/questions/asakai', method: 'GET', body: null, params: null })
    const questioning = (await response.json()) as QuestioningResponse
    setCurrentQuestioning(questioning)
  }

  useEffect(() => {
    void fetchQuestions()
    void fetchQuestioning()
  }, [])

  const classes = useStyle()
  return (
    <div className={classes.container}>
      <div>Set du jour</div>
      <div className={classes.questioning}>
        {currentQuestioning?.questions.map((question) => {
          return (
            <div key={question.id}>
              <span className={classes.questioningPart}>{question.id}</span>
              <span className={classes.questioningPart}>{question.option1}</span>
              <span className={classes.questioningPart}>ou</span>
              <span className={classes.questioningPart}>{question.option2}</span>
            </div>
          )
        })}
      </div>
      <DataGrid
        loading={questions.length === 0}
        className={classes.root}
        rows={questions}
        columns={columns}
        rowHeight={25}
      />
    </div>
  )
}

export default ChoseQuestioning
