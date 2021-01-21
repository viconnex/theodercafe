import { Choice, QuestioningAnswers } from 'components/Questioning/types'
import { db } from 'services/firebase/initialiseFirebase'
import firebase from 'firebase/app'

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
  await db
    .doc(`questioning/${questioningId}/questions/${questionId}/users/${userId}`)
    .set({ choice, timestamp: firebase.firestore.FieldValue.serverTimestamp() })
}
/* eslint-disable complexity */
export const onAnswerChange = ({
  questioningId,
  questionId,
  setQuestioningAnswers,
}: {
  questioningId: number
  questionId: number
  setQuestioningAnswers: (answers: QuestioningAnswers) => void
}) => {
  const userAnswers: Record<string, Choice> = {}
  const answers = { choice1: 0, choice2: 0 }
  return db.collection(`questioning/${questioningId}/questions/${questionId}/users`).onSnapshot(function (snapshot) {
    let needUpdate = 0
    snapshot.docChanges().forEach(function (change) {
      const id = change.doc.id
      const choice = change.doc.data()?.choice as Choice
      if (choice !== 1 && choice !== 2) {
        return
      }
      const choiceField = `choice${choice}` as keyof typeof answers
      const otherChoiceField = `choice${choice === 1 ? 2 : 1}` as keyof typeof answers
      if (id in userAnswers) {
        if (userAnswers[id] !== choice) {
          answers[otherChoiceField] -= 1
          answers[choiceField] += 1
          userAnswers[id] = choice
          needUpdate += 1
        }
      } else {
        needUpdate += 1
        answers[choiceField] += 1
        userAnswers[id] = choice
      }
    })
    if (needUpdate > 0) {
      setQuestioningAnswers({ ...answers })
    }
  })
}
