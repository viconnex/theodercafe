import React, { useState, useEffect } from 'react';
import { fetchRequestResponse } from 'services/api';
import { useSnackbar } from 'notistack';
import { USER_TO_QUESTIONS_CHOICES_URI } from 'utils/constants/apiConstants';

const Map = () => {
  const [map, setMap] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchMap = async () => {
    const response = await fetchRequestResponse({ uri: `/${USER_TO_QUESTIONS_CHOICES_URI}/user`, method: 'GET' }, 200, {
      enqueueSnackbar,
    });
    const data = await response.json();
    console.log(data);
    setMap(map);
  };

  useEffect(() => {
    fetchMap();
    // eslint-disable-next-line
  }, []);

  return <div>{map}</div>;
};

export default Map;
