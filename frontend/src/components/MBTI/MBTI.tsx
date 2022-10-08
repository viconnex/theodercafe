import React, { useEffect, useState } from 'react'
import { Button, CircularProgress } from '@material-ui/core'
import useStyle from 'components/MBTI/style'
import { MBTIResponse, ProfileResponse, UserWithPublicFields } from 'components/MBTI/types'
import { useSnackbar } from 'notistack'
import { fetchRequestResponse } from 'services/api'
import { USER_TO_QUESTIONS_CHOICES_URI } from 'utils/constants/apiConstants'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Exporting from 'highcharts/modules/exporting'
import HC_more from 'highcharts/highcharts-more'
import { MBTI_TYPES } from 'utils/constants/questionConstants'

import './style.css'
import { useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

HC_more(Highcharts)
Exporting(Highcharts)

const getChartOptions = (profiles: ProfileResponse | null) => {
  if (!profiles) {
    return
  }
  const options: Highcharts.Options = {
    chart: {
      type: 'packedbubble',
    },
    title: {
      text: 'Profiles MBTI',
    },
    tooltip: {
      useHTML: true,
      pointFormat: `<div><b>{point.name} :</b> {point.typeName}</div><br/><div>{point.description}</div>`,
    },
    plotOptions: {
      packedbubble: {
        layoutAlgorithm: {
          gravitationalConstant: 0.02,
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
        data: (users as UserWithPublicFields[]).map((user) => ({
          typeName: MBTI_TYPES[type as keyof typeof MBTI_TYPES].name,
          description: MBTI_TYPES[type as keyof typeof MBTI_TYPES].description,
          name: user.givenName || user.familyName ? `${user.givenName ?? ''} ${user.familyName ?? ''}` : 'inconnu',
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
  const [hasCompletedMbti, setHasCompletedMbti] = useState<boolean | null>(null)

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
    setHasCompletedMbti(profileResponse.hasRequestUserCompletedMbti)
  }

  useEffect(() => {
    void fetchProfiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const history = useHistory()

  const classes = useStyle()

  return (
    <div className={classes.page}>
      {!profiles ? (
        <CircularProgress color="secondary" />
      ) : (
        <React.Fragment>
          <div className={classes.actions}>
            {!hasCompletedMbti && (
              <div>
                <FormattedMessage id="mbti.notAnsweredYet" />
              </div>
            )}
            <div className={classes.actionButton}>
              <Button onClick={() => history.push('/?mbti=true')} variant="contained">
                {!hasCompletedMbti ? (
                  <FormattedMessage id="mbti.fillProfile" />
                ) : (
                  <FormattedMessage id="mbti.changeProfile" />
                )}
              </Button>
            </div>
          </div>
          <div className={classes.chartContainer}>
            <HighchartsReact
              highcharts={Highcharts}
              options={getChartOptions(profiles)}
              containerProps={{ style: { width: '100%', height: '100%' } }}
            />
          </div>
        </React.Fragment>
      )}
    </div>
  )
}

export default MBTI
