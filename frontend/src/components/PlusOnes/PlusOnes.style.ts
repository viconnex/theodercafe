import { makeStyles } from '@material-ui/core'

const useMyStyles = (props: { isUpDirection: boolean }) => {
  const translateX = Math.random() * 120 - 60
  const useStyles = makeStyles(() => ({
    plusOne: {
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: ' 50%',
      color: ' black',
      display: ' flex',
      fontSize: ' 8px',
      height: ' 25px',
      justifyContent: ' center',
      width: ' 25px',
      animation: `$vanish 0.8s 1 ease-out forwards`,
      position: 'absolute',
      transform: `translateX(${translateX}px)`,
    },
    '@keyframes vanish': {
      '0%': {
        opacity: 1,
      },
      '75%': {
        opacity: 1,
      },
      '100%': {
        opacity: 0,
        transform: `translateY(${props.isUpDirection ? '-' : ''}40px) translateX(${translateX}px)`,
      },
    },
    picture: {
      clipPath: 'circle',
    },
  }))

  return useStyles(props)
}

export default useMyStyles
