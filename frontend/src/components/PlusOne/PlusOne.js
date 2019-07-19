import React from 'react';
import './PlusOne.css';

const PlusOne = ({ update }) => {
  return (
    <div key={update} className="plus-one">
      +1
    </div>
  );
};
export default PlusOne;
