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
      <TextInput source="option1" label="Option1" />
      <TextInput source="option2" label="Option2" />
      <BooleanInput source="isValidated" label="Validée ?" />
      <BooleanInput source="isJoke" label="Blague ?" />
      <BooleanInput source="isJokeOnSomeone" label="Private joke" />
      <BooleanInput source="isClassic" label="Classique ?" />
      <ReferenceInput source="category.id" reference="categories" label="Catégorie">
        <SelectInput source="name" />
      </ReferenceInput>
      <ReferenceArrayInput source="questionSetIds" reference="question_set" label="Question Sets">
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
)
