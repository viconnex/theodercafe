import { QuestioningAnswers } from 'components/Questioning/types'
import { db } from 'services/firebase/initialiseFirebase'

export const answerQuestioning = async ({
  questioningId,
  questionId,
  userId,
  choice,
}: {
  questioningId: number | null
  questionId: number
  userId: string | null
  choice: 1 | 2
}) => {
  if (!questioningId || !userId) {
    return
  }
  await db.doc(`questioning/${questioningId}/questions/${questionId}/users/${userId}`).set({ choice })
}

export const onAnswerChange = ({
  questioningId,
  questionId,
  setQuestioningAnswers,
}: {
  questioningId: number | null
  questionId: number
  setQuestioningAnswers: (answers: QuestioningAnswers) => void
}) => {
  if (!questioningId) {
    return
  }
  const answers = { choice1: 0, choice2: 0 }
  return db.collection(`questioning/${questioningId}/questions/${questionId}/users`).onSnapshot(function (snapshot) {
    snapshot.docChanges().forEach(function (change) {
      const choice = change.doc.data()?.choice as 1 | 2
      if (choice !== 1 && choice !== 2) {
        return
      }
      const choiceField = `choice${choice}` as keyof typeof answers
      const otherChoiceField = `choice${choice === 1 ? 2 : 1}` as keyof typeof answers
      if (change.type === 'added') {
        answers[choiceField] += 1
      } else if (change.type === 'modified') {
        answers[choiceField] += 1
        answers[otherChoiceField] -= 1
      } else if (change.type === 'removed') {
        answers[choiceField] -= 1
      }
    })

    setQuestioningAnswers({ ...answers })
  })
}
