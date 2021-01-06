import { makeStyles, Theme } from '@material-ui/core'
import { Choice } from 'components/Questioning/types'
import colors from 'ui/colors'

const useStyle = makeStyles(() => {
  return {
    categoryContainer: {
      marginBottom: '24px',
    },
    categoryTitle: {
      fontSize: '16px',
      marginBottom: '7px',
    },
    categoryContent: {
      backgroundColor: colors.theodoGreen,
      fontStyle: 'italic',
    },
    questionContainer: {
      fontSize: '20px',
      padding: '5px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    option: {
      cursor: 'pointer',
      padding: '8px',
    },
    option2: {
      marginLeft: '20px',
    },
    separator: {
      margin: '5px',
    },
    chosenQuestion: {
      border: '1px solid white',
    },
    optionContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    chosable: {
      borderBottom: '0.7px dashed',
      background: 'none',
      border: 'none',
    },
    pageContainer: {
      marginTop: '30px',
    },
  }
})

export default useStyle

export const useAnswerBarStyle = makeStyles<Theme, { isChoiceMade: boolean; option: Choice }>(() => {
  return {
    container: (props) => ({
      justifyContent: 'center',
      alignItems: 'center',
      width: '150px',
      display: 'flex',
      opacity: props.isChoiceMade ? '100%' : '0%',
      [`margin${props.option === 1 ? 'Bottom' : 'Top'}`]: '8px',
    }),
    bar: {
      backgroundColor: colors.theodoGreen,
      height: '14px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '12px',
      position: 'relative',
    },
    number: {
      color: colors.theodoGreen,
      marginLeft: '6px',
      fontSize: '12px',
      position: 'absolute',
    },
  }
})
