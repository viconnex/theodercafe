import React from 'react';
import { Admin as ReactAdmin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { API_BASE_URL } from 'utils/constants';
import { QuestionList } from 'components/QuestionList';

const dataProvider = jsonServerProvider(API_BASE_URL);
const Admin = () => (
  <ReactAdmin dataProvider={dataProvider}>
    <Resource name="questions" list={QuestionList} />
  </ReactAdmin>
);

export default Admin;
