import React from 'react';
import Button from '@material-ui/core/Button';
import { API_BASE_URL, GOOGLE_AUTH_URI } from 'utils/constants';

const LoginPage = () => {
  return (
    <div>
      <Button variant="contained" href={API_BASE_URL + GOOGLE_AUTH_URI}>
        Login with Google
      </Button>
    </div>
  );
};

export default LoginPage;
