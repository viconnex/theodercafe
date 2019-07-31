import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from 'utils/constants';
import ReactTable from 'react-table';

const Table = () => {
  //   const [questions, setQuestions] = useState();

  //   const fetchQuestions = async () => {
  //     const response = await fetch(API_BASE_URL + 'questions/all');
  //     const data = await response.json();
  //     setQuestions(data);
  //   };

  //   useEffect(() => {
  //     fetchQuestions();
  //   }, []);

  const columns = [
    {
      Header: 'id',
      accessor: 'id',
    },
    {
      Header: 'Option 1',
      accessor: 'option1',
    },
    {
      Header: 'Option 2',
      accessor: 'option2',
    },
    {
      Header: 'Catégorie',
      accessor: 'categoryName',
    },
  ];
  //   const data = [{ id: 1, option1: 'la main droite', option2: 'la main gauche', categoryName: 'category' }];

  //   console.log(questions);
  //   return <ReactTable data={data} columns={columns} />;
  const data = [
    {
      name: 'Tanner Linsley',
      age: 26,
      friend: {
        name: 'Jason Maurer',
        age: 23,
      },
    },
  ];

  const columns2 = [
    {
      Header: 'Name',
      accessor: 'name', // String-based value accessors!
    },
    {
      Header: 'Age',
      accessor: 'age',
      Cell: props => <span className="number">{props.value}</span>, // Custom cell components!
    },
    {
      id: 'friendName', // Required because our accessor is not a string
      Header: 'Friend Name',
      accessor: d => d.friend.name, // Custom value accessors!
    },
    {
      Header: props => <span>Friend Age</span>, // Custom header components!
      accessor: 'friend.age',
    },
  ];

  return <ReactTable data={data} columns={columns2} />;
};

export default Table;
