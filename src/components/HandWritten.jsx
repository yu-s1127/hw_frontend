import React from 'react';
import styled from 'styled-components';

const HandWritten = () => {
  const canvasWidth = 120;
  const canvasHeight = 120;

  return (
    <SContainer>
      <h1>Hand Written Recognition</h1>

      <SCanvas width={canvasWidth} height={canvasHeight} />

      <SButtonContainer>
        <SButton>reset</SButton>
        <SButton>predict</SButton>
      </SButtonContainer>
    </SContainer>
  );
};

const SCanvas = styled.canvas`
  border: 1px solid black;
`;
const SButton = styled.button`
  width: 10vw;
  height: 5vh;
`;
const SContainer = styled.div`
  display: grid;
  justify-content: center;
  justify-items: center;
  grid-gap: 1vh;
`;
const SButtonContainer = styled.div`
  button:first-child {
    margin-right: 0.5vh;
  }
`;

export default HandWritten;
