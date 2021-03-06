import React from 'react'
import { BooleanInput, Edit, SimpleForm } from 'react-admin'

const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <BooleanInput source="isActive" label="Actif ?" />
      <BooleanInput source="isAdmin" label="Admin ?" />
    </SimpleForm>
  </Edit>
)

export default UserEdit
