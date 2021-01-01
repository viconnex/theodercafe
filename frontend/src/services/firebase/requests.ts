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
