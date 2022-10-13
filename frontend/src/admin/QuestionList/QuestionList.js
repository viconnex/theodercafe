import React from 'react'
import {
  BooleanField,
  ChipField,
  Datagrid,
  List,
  NumberField,
  ReferenceArrayField,
  ReferenceField,
  SingleFieldList,
  TextField,
} from 'react-admin'

export const QuestionList = (props) => {
  return (
    <List {...props}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="option1" label="Option 1" />
        <TextField source="option2" label="Option 2" />
        <ReferenceArrayField source="questionSetIds" reference="question_set" label="Set">
          <SingleFieldList>
            <ChipField source="name" />
          </SingleFieldList>
        </ReferenceArrayField>
        <ReferenceField source="categoryId" reference="categories" label="Catégorie">
          <TextField source="name" />
        </ReferenceField>
        <BooleanField source="isValidated" label="Validée" />
        <BooleanField source="isJoke" label="Blague" />
        <BooleanField source="isJokeOnSomeone" label="Private joke" />
        <BooleanField source="isClassic" label="Classique" />
        <NumberField source="choice1Count" label="Choix 1" />
        <NumberField source="choice2Count" label="Choix 2" />
        <NumberField source="upVoteCount" label="Up Votes" />
        <NumberField source="downVoteCount" label="Down Votes" />
      </Datagrid>
    </List>
  )
}
