import React, { useEffect, useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Close from '@material-ui/icons/Close'
import Creatable from 'react-select/creatable'
import { useSnackbar } from 'notistack'
import { fetchRequest, fetchRequestResponse } from 'services/api'
import { Category, QuestionSet, QuestionSetOption } from 'components/AddQuestionDialog/types'
import { ActionMeta, MultiValue } from 'react-select'
import useStyle from './style'

const postQuestion = async (
  option1: string,
  option2: string,
  category: string | number | null,
  questionSetValues: QuestionSetOption[],
) => {
  const uri = '/questions'
  const body = {
    option1,
    option2,
    category,
    questionSets: questionSetValues.map((questionSet) => ({
      id: questionSet.__isNew__ ? null : questionSet.value,
      label: questionSet.label,
    })),
  }
  const response = await fetchRequest({ uri, method: 'POST', body, params: null })

  return response
}

const choisis = (option1: string, option2: string) => (Math.floor(Math.random() * 2) === 0 ? option1 : option2)

const AddQuestionDialog = ({
  handleQuestionAdded,
  open,
  onClose,
}: {
  handleQuestionAdded: () => void
  open: boolean
  onClose: () => void
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const [categories, setCategories] = useState<Category[]>([])
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([])
  const [questionSetValues, setQuestionSetValues] = useState<QuestionSetOption[]>([])
  const [option1, setOption1] = useState('')
  const [option2, setOption2] = useState('')
  const [categoryValue, setCategoryValue] = useState<string | number | null>(null)
  const [categoryLabel, setCategoryLabel] = useState<string | null>(null)
  const classes = useStyle()

  const fetchCategories = async () => {
    const response = await fetchRequestResponse({ uri: '/categories', method: 'GET', params: null, body: null }, 200, {
      enqueueSnackbar,
      successMessage: null,
    })
    if (response) {
      const categoryResponse = (await response.json()) as Category[]
      setCategories(categoryResponse)
    }
  }
  const fetchQuestionSets = async () => {
    const response = await fetchRequestResponse(
      { uri: '/question_set', method: 'GET', params: null, body: null },
      200,
      {
        enqueueSnackbar: null,
        successMessage: null,
      },
    )
    if (response) {
      const questionSetResponse = (await response.json()) as QuestionSet[]
      setQuestionSets(questionSetResponse)
    }
  }
  useEffect(() => {
    void fetchCategories()
    void fetchQuestionSets()
  }, [])

  const handleCategoryChange = (newValue: { value: string | number | null; label: string | null } | null) => {
    if (!newValue) {
      setCategoryValue(null)
      setCategoryLabel(null)
      return
    }
    setCategoryValue(newValue.value)
    setCategoryLabel(newValue.label)
  }

  const handleQuestionSetChange = (newValue: MultiValue<QuestionSetOption>, action: ActionMeta<QuestionSetOption>) => {
    setQuestionSetValues([...newValue])
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const response = await postQuestion(option1, option2, categoryValue, questionSetValues)
    if (response.status === 201) {
      const ackResponse = choisis(option1, option2)
      enqueueSnackbar(`${ackResponse} !`, { variant: 'success' })
      handleQuestionAdded()
    } else {
      enqueueSnackbar("La question n'a pas pu être créée", { variant: 'error' })
    }
    setOption1('')
    setOption2('')
    setCategoryValue(null)
    setCategoryLabel(null)
    setQuestionSetValues([])
    void fetchCategories()
    void fetchQuestionSets()
  }

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }))
  const categorySelectValue = categoryValue ? { label: categoryLabel, value: categoryValue } : null
  const questionSetOptions: QuestionSetOption[] = questionSets.map((questionSet) => ({
    label: questionSet.name,
    value: questionSet.id,
  }))

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open} PaperProps={{ className: classes.dialog }}>
      <IconButton onClick={onClose} className={classes.closeButton}>
        <Close />
      </IconButton>
      <DialogTitle className={classes.dialogTitle}>Une question ?</DialogTitle>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          required
          id="option1"
          fullWidth
          label="thé"
          onChange={(event) => setOption1(event.target.value)}
          value={option1}
        />
        <p className={classes.separatOR}>ou</p>
        <div className={classes.option2Wrapper}>
          <TextField
            required
            className={classes.option2}
            id="option2"
            fullWidth
            label="café"
            onChange={(event) => setOption2(event.target.value)}
            value={option2}
          />
          <span className={classes.interroBang}>?</span>
        </div>
        <div className={classes.categoryTitle}>Catégorie</div>
        <div className={classes.categorySubTitle}>Choisis une catégorie ou crée-z-en une</div>
        <Creatable
          className={classes.creatable}
          menuPlacement="auto"
          options={categoryOptions}
          onChange={handleCategoryChange}
          placeholder="Choisis ou crée..."
          value={categorySelectValue}
        />
        <div className={classes.categoryTitle}>Sets de questions</div>
        <Creatable
          isMulti
          className={classes.creatable}
          menuPlacement="auto"
          onChange={handleQuestionSetChange}
          placeholder="Choisis ou crée..."
          options={questionSetOptions}
          value={questionSetValues}
        />
        <Button color="primary" type="submit">
          Ajouter une question
        </Button>
      </form>
    </Dialog>
  )
}

export default AddQuestionDialog
