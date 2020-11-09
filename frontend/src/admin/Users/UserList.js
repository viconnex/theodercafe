import React from 'react'
import { BooleanField, Datagrid, List, TextField } from 'react-admin'

const UserList = (props) => {
  return (
    <List {...props}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="email" label="Email" />
        <BooleanField source="isActive" label="Actif ?" />
        <BooleanField source="isAdmin" label="Admin ?" />
      </Datagrid>
    </List>
  )
}

export default UserList
