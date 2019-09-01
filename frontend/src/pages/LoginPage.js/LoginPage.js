import React from 'react';
import Button from '@material-ui/core/Button';
import { API_BASE_URL } from 'utils/constants';

const LoginPage = () => {
  return (
    <div>
      <Button variant="contained" href={API_BASE_URL + '/auth/google'}>
        Login with Google
      </Button>
    </div>
  );
};

export default LoginPage;
