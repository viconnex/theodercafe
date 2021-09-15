import { Choice, UpVote, UsersAnswers, UsersVotes } from 'components/Questioning/types'
import { db } from 'services/firebase/initialiseFirebase'
import firebase from 'firebase/app'

export const answerQuestioning = async ({
  questioningId,
  questionId,
  userId,
  choice,
  upVote,
}: {
  questioningId: number | null
  questionId: number
  userId: string | null
  choice?: Choice
  upVote?: UpVote
}) => {
  if (!questioningId || !userId) {
    return
  }
  const payload: { timestamp: firebase.firestore.FieldValue; choice?: Choice; upVote?: UpVote } = {
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  }
  if (choice !== undefined) {
    payload.choice = choice
  }
  if (upVote !== undefined) {
    payload.upVote = upVote
  }
  console.log('que', questionId)
  await db.doc(`questioning/${questioningId}/questions/${questionId}/users/${userId}`).set(payload, { merge: true })
}
/* eslint-disable complexity */
export const onAnswerChange = ({
  questioningId,
  questionId,
  setUsersAnswers,
  setUsersVotes,
}: {
  questioningId: number
  questionId: number
  setUsersAnswers: (answers: UsersAnswers) => void
  setUsersVotes: (votes: UsersVotes) => void
}) => {
  const answersByUserId: Record<string, Choice> = {}
  const votesByUserId: Record<string, UpVote> = {}

  return db.collection(`questioning/${questioningId}/questions/${questionId}/users`).onSnapshot(function (snapshot) {
    let needAnswerUpdate = 0
    let needVotesUpdate = 0

    snapshot.docChanges().forEach(function (change) {
      const id = change.doc.id
      const choice = change.doc.data()?.choice as Choice
      const vote = (change.doc.data()?.upVote ?? null) as UpVote

      if (id in answersByUserId) {
        if (answersByUserId[id] !== choice) {
          answersByUserId[id] = choice
          needAnswerUpdate += 1
        }
      } else if (choice === 1 || choice === 2) {
        needAnswerUpdate += 1
        answersByUserId[id] = choice
      }

      if (id in votesByUserId) {
        if (votesByUserId[id] !== vote) {
          votesByUserId[id] = vote
          needVotesUpdate += 1
        }
      } else if (vote !== null) {
        needVotesUpdate += 1
        votesByUserId[id] = vote
      }
    })
    if (needAnswerUpdate > 0) {
      const answers: UsersAnswers = { choice1: [], choice2: [] }
      for (const userId in answersByUserId) {
        const choiceField = `choice${answersByUserId[userId]}` as keyof typeof answers
        answers[choiceField].push(parseInt(userId))
      }
      setUsersAnswers(answers)
    }
    if (needVotesUpdate > 0) {
      const votes = { upVotes: 0, downVotes: 0 }
      for (const userId in votesByUserId) {
        if (null === votesByUserId[userId]) {
          continue
        }
        const voteField = `${votesByUserId[userId] ? 'up' : 'down'}Votes` as keyof typeof votes
        votes[voteField] += 1
      }
      setUsersVotes(votes)
    }
  })
}
