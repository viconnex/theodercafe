import React from 'react'
import { Create, SimpleForm, TextInput } from 'react-admin'

export const CategoryCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Create>
)
