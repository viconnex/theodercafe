import React from 'react'
import {
  BooleanField,
  ChipField,
  Datagrid,
  FunctionField,
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
        <ReferenceArrayField source="questionSetIds" reference="question_set" label="Sets">
          <SingleFieldList>
            <ChipField source="name" />
          </SingleFieldList>
        </ReferenceArrayField>
        <BooleanField source="isValidated" label="Validated" />
        <BooleanField source="isClassic" label="Classic" />
        <BooleanField source="isJoke" label="Joke" />
        <BooleanField source="isJokeOnSomeone" label="Private joke" />
        <NumberField source="choice1Count" label="Choice 1" />
        <NumberField source="choice2Count" label="Choice 2" />
        <NumberField source="upVotesCount" label="Up Votes" />
        <NumberField source="downVotesCount" label="Down Votes" />
        <ReferenceField source="categoryId" reference="categories" label="Category">
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField source="addedByUserId" reference="users" label="Added by">
          <FunctionField label="Name" render={(record) => `${record.givenName} ${record.familyName}`} />
        </ReferenceField>
      </Datagrid>
    </List>
  )
}
