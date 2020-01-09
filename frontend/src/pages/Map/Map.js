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
    const data = await response.json();
    console.log(data);
    setMap(data.map);
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
        data: map.map(dot => ({
          x: dot[0],
          y: dot[1],
          name: 'chico',
          marker: {
            height: 15,
            width: 15,
            symbol: 'url(https://lh3.googleusercontent.com/a-/AAuE7mCUFpMUIarQSeMITVXIOeLBBU8mnp-SPE2QHgD2)',
          },
        })),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Map;
