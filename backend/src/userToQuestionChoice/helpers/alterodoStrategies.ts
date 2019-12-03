import { UserToQuestionChoice, AsakaiChoices, AlterodoSimilarity, Alterodo } from '../userToQuestionChoice.entity';
import { UserToQuestionChoiceRepository } from '../userToQuestionChoice.repository';
import { In } from 'typeorm';

export const findAlterodoFromChoices = async (
    userToQuestionChoiceRepository: UserToQuestionChoiceRepository,
    asakaiChoices: AsakaiChoices,
): Promise<Alterodo> => {
    const answeredQuestionsIds = Object.keys(asakaiChoices);
    const totems: { [id: number]: AlterodoSimilarity } = {};

    const userToQuestionChoices = await userToQuestionChoiceRepository.findByQuestionIds(answeredQuestionsIds);

    userToQuestionChoices.forEach((userToQuestionChoice: UserToQuestionChoice): void => {
        const isSameChoice = asakaiChoices[userToQuestionChoice.questionId] === userToQuestionChoice.choice;
        const totemIncrement = {
            similarity: isSameChoice ? 1 : 0,
            sameAnswerCount: isSameChoice ? 1 : 0,
            squareNorm: 1,
        };
        if (!totems.hasOwnProperty(userToQuestionChoice.userId)) {
            totems[userToQuestionChoice.userId] = totemIncrement;
            return;
        }
        const currentAlterodo = totems[userToQuestionChoice.userId];
        totems[userToQuestionChoice.userId] = {
            similarity: currentAlterodo.similarity + totemIncrement.similarity,
            sameAnswerCount: currentAlterodo.sameAnswerCount + totemIncrement.sameAnswerCount,
            squareNorm: currentAlterodo.squareNorm + totemIncrement.squareNorm,
        };
    });
    const asakaiNorm = Math.sqrt(Object.keys(asakaiChoices).length);

    let bestSimilarity = -1;
    let totemId = '0';
    for (const userId in totems) {
        const similarity = totems[userId].similarity / (Math.sqrt(totems[userId].squareNorm) * asakaiNorm);
        totems[userId].similarity = similarity;
        if (similarity > bestSimilarity) {
            totemId = userId;
            bestSimilarity = similarity;
        }
    }
    const totem = {
        user: { userId: parseInt(totemId) },
        similarity: totems[parseInt(totemId)],
    };

    return totem;
};
