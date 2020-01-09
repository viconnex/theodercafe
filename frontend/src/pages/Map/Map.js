import React, { useState, useEffect } from 'react';
import { fetchRequestResponse } from 'services/api';
import { useSnackbar } from 'notistack';
import { USER_TO_QUESTIONS_CHOICES_URI } from 'utils/constants/apiConstants';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Map = () => {
  const [map, setMap] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchMap = async () => {
    const response = await fetchRequestResponse({ uri: `/${USER_TO_QUESTIONS_CHOICES_URI}/map`, method: 'GET' }, 200, {
      enqueueSnackbar,
    });
    if (!response) {
      return;
    }
    const data = await response.json();
    setMap(data);
  };

  useEffect(() => {
    fetchMap();
    // eslint-disable-next-line
  }, []);

  if (!map) {
    return <div>loading</div>;
  }

  const options = {
    title: {
      text: 'My chart',
    },
    series: [
      {
        type: 'scatter',
        data: map.map(user => ({
          x: user.x,
          y: user.y,
          name: 'chico',
          marker: {
            height: 15,
            width: 15,
            symbol: `url(${user.pictureUrl})`,
          },
        })),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Map;
