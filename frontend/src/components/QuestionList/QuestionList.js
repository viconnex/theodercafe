import React from 'react';
import { List, Datagrid, TextField, BooleanField, NumberField, ReferenceField } from 'react-admin';

export const QuestionList = props => {
  return (
    <List {...props}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="option1" label="Option 1" />
        <TextField source="option2" label="Option 2" />
        <ReferenceField source="category.id" reference="categories" label="Catégorie">
          <TextField source="name" />
        </ReferenceField>
        <BooleanField source="isValidated" label="Validée" />
        <BooleanField source="isJokeOnSomeone" label="Jeu de nom" />
        <BooleanField source="isClassic" label="Classique" />
        <NumberField source="option1Votes" label="Votes 1" />
        <NumberField source="option2Votes" label="Votes 2" />
        <NumberField source="upVotes" label="Up Votes" />
        <NumberField source="downVotes" label="Down Votes" />
      </Datagrid>
    </List>
  );
};
