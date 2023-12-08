import React from 'react';
import { Loader } from './LoaderSpinner.styled';

const LoaderSpinner = () => {
  return (
    <Loader>
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Loader>
  );
};

export default LoaderSpinner;
