import React from 'react';
import { Edit, SimpleForm, BooleanInput, NumberInput, TextInput, ReferenceInput, SelectInput } from 'react-admin';

export const QuestionEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="option1" label="Option1" />
      <TextInput source="option2" label="Option2" />
      <BooleanInput source="isValidated" label="Validée ?" />
      <BooleanInput source="isJokeOnSomeone" label="Jeu de nom ?" />
      <BooleanInput source="isClassic" label="Classique ?" />
      <ReferenceInput source="category.id" reference="categories" label="Catégorie">
        <SelectInput source="name" />
      </ReferenceInput>
      <NumberInput source="option1Votes" label="Votes pour option 1" />
      <NumberInput source="option2Votes" label="Votes pour option 2" />
      <NumberInput source="upVotes" label="Up Votes" />
      <NumberInput source="downVotes" label="Down Votes" />
    </SimpleForm>
  </Edit>
);
