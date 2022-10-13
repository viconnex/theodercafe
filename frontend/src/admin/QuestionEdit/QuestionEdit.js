import React from 'react'
import {
  BooleanInput,
  Edit,
  ReferenceArrayInput,
  ReferenceInput,
  SelectArrayInput,
  SelectInput,
  SimpleForm,
  TextInput,
} from 'react-admin'

export const QuestionEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="option1" label="Option 1" />
      <TextInput source="option2" label="Option 2" />
      <BooleanInput source="isValidated" label="Validated for asakai ?" />
      <BooleanInput source="isJoke" label="Joke ?" />
      <BooleanInput source="isJokeOnSomeone" label="Private joke" />
      <BooleanInput source="isClassic" label="Classic ?" />
      <ReferenceInput source="category.id" reference="categories" label="Categories">
        <SelectInput source="name" />
      </ReferenceInput>
      <ReferenceArrayInput source="questionSetIds" reference="question_set" label="Question Sets">
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
)
