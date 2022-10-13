import React from 'react'
import { BooleanField, Datagrid, List, TextField } from 'react-admin'

const UserList = (props) => {
  return (
    <List {...props}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="email" label="email" />
        <TextField source="givenName" label="Firstname" />
        <TextField source="familyName" label="Lastname" />
        <TextField source="answerCount" label="Answers count" />
        <BooleanField source="isActive" label="Active ?" />
        <BooleanField source="isAdmin" label="Admin ?" />
        <BooleanField source="isLoginPending" label="Account pending ?" />
      </Datagrid>
    </List>
  )
}

export default UserList
