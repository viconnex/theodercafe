import React from 'react';
import { Admin as ReactAdmin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { API_BASE_URL } from 'utils/constants';
import { QuestionList } from 'components/QuestionList';
import { QuestionEdit } from 'components/QuestionEdit';

const dataProvider = jsonServerProvider(API_BASE_URL);
const Admin = () => (
  <ReactAdmin dataProvider={dataProvider}>
    <Resource name="questions" list={QuestionList} edit={QuestionEdit} />
    <Resource name="categories" list={ListGuesser} edit={EditGuesser} />
  </ReactAdmin>
);

export default Admin;
