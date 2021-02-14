import React, { useEffect, useState } from 'react'
import { CircularProgress } from '@material-ui/core'
import useStyle from 'components/MBTI/style'
import { MBTIResponse, ProfileResponse } from 'components/MBTI/types'
import { useSnackbar } from 'notistack'
import { fetchRequestResponse } from 'services/api'
import { USER_TO_QUESTIONS_CHOICES_URI } from 'utils/constants/apiConstants'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_more from 'highcharts/highcharts-more'

HC_more(Highcharts)

const getChartOptions = (profiles: ProfileResponse | null) => {
  if (!profiles) {
    return
  }
  const options: Highcharts.Options = {
    chart: {
      type: 'packedbubble',
      height: '100%',
    },
    title: {
      text: 'Profiles MBTI',
    },
    plotOptions: {
      packedbubble: {
        minSize: '20%',
        maxSize: '20%',
        layoutAlgorithm: {
          gravitationalConstant: 0.05,
          splitSeries: 'true',
          seriesInteraction: false,
          dragBetweenSeries: false,
          parentNodeLimit: true,
        },
      },
    },
    series: Object.entries(profiles).map(([type, users]) => {
      return {
        type: 'packedbubble',
        name: type,
        data: users.map((user) => ({
          value: 1,
          marker: {
            height: 10,
            width: 10,
            radius: 1,
            symbol: user.pictureUrl ? `url(${user.pictureUrl})` : undefined,
          },
        })),
      }
    }),
  }
  return options
}

const MBTI = () => {
  const [profiles, setProfiles] = useState<null | ProfileResponse>(null)

  const { enqueueSnackbar } = useSnackbar()
  const fetchProfiles = async () => {
    const response = await fetchRequestResponse(
      { uri: `/${USER_TO_QUESTIONS_CHOICES_URI}/mbti`, method: 'GET', params: null, body: null },
      200,
      {
        enqueueSnackbar,
        successMessage: null,
      },
    )
    if (!response) {
      return
    }
    const profileResponse = (await response.json()) as MBTIResponse
    setProfiles(profileResponse.mbtiProfiles)
  }

  useEffect(() => {
    void fetchProfiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const classes = useStyle()

  return (
    <div className={classes.container}>
      {!profiles ? (
        <CircularProgress color="secondary" />
      ) : (
        <div>
          <HighchartsReact
            containerProps={{ className: 'chart-container' }}
            highcharts={Highcharts}
            options={getChartOptions(profiles)}
          />
        </div>
      )}
    </div>
  )
}

export default MBTI
