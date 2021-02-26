import { makeStyles } from '@material-ui/core'

const useMyStyles = (props: { isUpDirection: boolean }) => {
  const translateXRange = 200
  const translateX = Math.random() * translateXRange - translateXRange / 2
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
      animation: `$vanish 0.9s 1 ease-out forwards`,
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
        transform: `translateY(${props.isUpDirection ? '-' : ''}50px) translateX(${translateX}px)`,
      },
    },
    picture: {
      clipPath: 'circle',
    },
  }))

  return useStyles(props)
}

export default useMyStyles
