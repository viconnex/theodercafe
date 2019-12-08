import colors from 'ui/colors';

const style = {
  nextButton: {
    color: 'white',
  },
  optionContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  counter: {
    fontSize: '14px',
    marginTop: '-8px',
    marginBottom: '20px',
  },
  browser: {
    marginTop: '15px',
  },
  filterOption: {
    fontSize: '11px',
  },
  neutralVote: {
    color: colors.white,
  },
  upVote: {
    color: colors.theodoGreen,
  },
  downVote: {
    color: colors.red,
  },
  questioningContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  questioningContent: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '36px',
    width: '100%',
  },
  allQuestioningContent: {
    marginTop: '49px',
  },
  asakaiSubtitle: {
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  asakaiNewSetButton: {
    color: colors.theodoGreen,
    cursor: 'pointer',
    fontSize: '12px',
    marginTop: '4px',
  },
  connect: {
    color: colors.theodoGreen,
    cursor: 'pointer',
  },
};

export default style;
