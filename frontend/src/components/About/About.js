import React from 'react';
import img from 'ui/img/chien_abime.jpg';
import './style.css';

const About = () => {
  return (
    <div id="viewport">
      <img alt="abime_le_chien" className="img-about" id="img-big" src={img} />
      <img alt="abime_le_chien" className="img-about" id="img-small" src={img} />
    </div>
  );
};

export default About;
