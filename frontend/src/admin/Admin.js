import React from 'react';
import { Admin as ReactAdmin, Resource, ListGuesser, EditGuesser, fetchUtils } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { API_BASE_URL } from 'utils/constants';
import { QuestionList } from 'components/QuestionList';
import { QuestionEdit } from 'components/QuestionEdit';
import { CategoryCreate } from 'components/CategoryCreate';

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  // add your own headers here
  options.headers.set('Authorization', `Bearer ${localStorage.jwt_token}`);

  return fetchUtils.fetchJson(url, options);
};

const dataProvider = jsonServerProvider(API_BASE_URL, httpClient);
const Admin = ({ store }) => (
  <ReactAdmin authProvider={store.authProvider} dataProvider={store.dataProvider} history={store.history}>
    <Resource name="questions" list={QuestionList} edit={QuestionEdit} />
    <Resource name="categories" list={ListGuesser} edit={EditGuesser} create={CategoryCreate} />
  </ReactAdmin>
);

export default Admin;
