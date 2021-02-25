import { Choice, UsersAnswers } from 'components/Questioning/types'
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
  setUsersAnswers,
}: {
  questioningId: number
  questionId: number
  setUsersAnswers: (answers: UsersAnswers) => void
}) => {
  const usersAnswers: Record<string, Choice> = {}

  return db.collection(`questioning/${questioningId}/questions/${questionId}/users`).onSnapshot(function (snapshot) {
    let needUpdate = 0
    snapshot.docChanges().forEach(function (change) {
      const id = change.doc.id
      const choice = change.doc.data()?.choice as Choice
      if (choice !== 1 && choice !== 2) {
        return
      }
      if (id in usersAnswers) {
        if (usersAnswers[id] !== choice) {
          usersAnswers[id] = choice
          needUpdate += 1
        }
      } else {
        needUpdate += 1
        usersAnswers[id] = choice
      }
    })
    if (needUpdate > 0) {
      const answers: UsersAnswers = { choice1: [], choice2: [] }
      for (const userId in usersAnswers) {
        const choiceField = `choice${usersAnswers[userId]}` as keyof typeof answers
        answers[choiceField].push(parseInt(userId))
      }
      setUsersAnswers(answers)
    }
  })
}
