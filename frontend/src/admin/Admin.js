import React from 'react';
import { Admin as ReactAdmin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { API_BASE_URL } from 'utils/constants';

const dataProvider = jsonServerProvider('http://localhost:4000');
const Admin = () => (
  <ReactAdmin dataProvider={dataProvider}>
    <Resource name="questions" list={ListGuesser} />
  </ReactAdmin>
);

export default Admin;
