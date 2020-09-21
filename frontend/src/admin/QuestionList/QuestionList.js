import React from 'react'
import { BooleanField, Datagrid, List, NumberField, ReferenceField, TextField } from 'react-admin'

export const QuestionList = (props) => {
  return (
    <List {...props}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="option1" label="Option 1" />
        <TextField source="option2" label="Option 2" />
        <ReferenceField source="categoryId" reference="categories" label="Catégorie">
          <TextField source="name" />
        </ReferenceField>
        <BooleanField source="isValidated" label="Validée" />
        <BooleanField source="isJoke" label="Blague" />
        <BooleanField source="isJokeOnSomeone" label="Private joke" />
        <BooleanField source="isClassic" label="Classique" />
        <NumberField source="choice1count" label="Choix 1" />
        <NumberField source="choice2count" label="Choix 2" />
        <NumberField source="upVotes" label="Up Votes" />
        <NumberField source="downVotes" label="Down Votes" />
      </Datagrid>
    </List>
  )
}
