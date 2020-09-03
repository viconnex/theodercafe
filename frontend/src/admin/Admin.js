import React from 'react'
import { EditGuesser, fetchUtils, ListGuesser, Admin as ReactAdmin, Resource } from 'react-admin'
import jsonServerProvider from 'ra-data-json-server'
import { API_BASE_URL } from 'utils/constants/apiConstants'
import { CategoryCreate } from 'components/CategoryCreate'
import { QuestionList } from './QuestionList'
import { QuestionEdit } from './QuestionEdit'

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' })
  }
  // add your own headers here
  options.headers.set('Authorization', `Bearer ${localStorage.jwt_token}`)

  return fetchUtils.fetchJson(url, options)
}

const dataProvider = jsonServerProvider(API_BASE_URL, httpClient)
const Admin = () => (
  <ReactAdmin dataProvider={dataProvider}>
    <Resource name="questions" list={QuestionList} edit={QuestionEdit} />
    <Resource name="categories" list={ListGuesser} edit={EditGuesser} create={CategoryCreate} />
  </ReactAdmin>
)

export default Admin
