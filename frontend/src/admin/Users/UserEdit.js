import React from 'react'
import { BooleanInput, Edit, SimpleForm, TextInput } from 'react-admin'

const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput disabled source="email" label="email" />
      <TextInput disabled source="givenName" label="Firstname" />
      <TextInput disabled source="familyName" label="Lastname" />
      <BooleanInput source="isActive" label="Active ?" />
      <BooleanInput source="isAdmin" label="Admin ?" />
    </SimpleForm>
  </Edit>
)

export default UserEdit
