import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Button } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';

import { fetchRequestResponse } from 'services/api';
import { USER_TO_QUESTIONS_CHOICES_URI } from 'utils/constants/apiConstants';
import { FilterDrawer } from 'components/FilterDrawer';

import './style.css';

const Map = () => {
  const [map, setMap] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    isValidated: true,
    isJoke: false,
  });

  const handeFilterChange = option => event => {
    setFilters({ ...filters, [option]: event.target.checked });
  };

  const fetchMap = async () => {
    const response = await fetchRequestResponse(
      { uri: `/${USER_TO_QUESTIONS_CHOICES_URI}/map`, method: 'GET', params: filters },
      200,
      {
        enqueueSnackbar,
      },
    );
    if (!response) {
      return;
    }
    const data = await response.json();
    setMap(data);
  };

  useEffect(() => {
    fetchMap();
    // eslint-disable-next-line
  }, [filters]);

  if (!map) {
    return <div>loading</div>;
  }

  const options = {
    chart: {
      height: '100%',
      margin: 20,
    },
    title: {
      text: 'Carte des réponses',
    },
    xAxis: {
      tickInterval: 1,
      labels: {
        enabled: false,
      },
    },
    yAxis: {
      labels: {
        enabled: false,
      },
      lineWidth: 1,
      gridLineWidth: 0,
      title: {
        enabled: false,
      },
    },
    series: [
      {
        showInLegend: false,
        type: 'scatter',
        data: map.map(user => ({
          x: user.x,
          y: user.y,
          name: `${user.givenName} ${user.familyName.charAt(0).toUpperCase()}`,
          marker: {
            height: 20,
            width: 20,
            symbol: `url(${user.pictureUrl})`,
          },
        })),
      },
    ],
    tooltip: {
      formatter: function() {
        const data = this.series.chart.series[0].data;
        const index = this.point.index;
        return '<b>' + data[index].name + '</b>';
      },
    },
  };

  return (
    <div className="map">
      <div>
        <Button startIcon={<TuneIcon />} color="secondary" variant="text" onClick={() => setIsDrawerOpen(true)}>
          Filtres
        </Button>
      </div>
      <FilterDrawer
        open={isDrawerOpen}
        close={() => setIsDrawerOpen(false)}
        filters={filters}
        handeFilterChange={handeFilterChange}
      />
      <HighchartsReact containerProps={{ className: 'chart-container' }} highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Map;
