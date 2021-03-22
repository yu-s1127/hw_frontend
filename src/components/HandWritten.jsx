import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const HandWritten = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  const canvasWidth = 120;
  const canvasHeight = 120;

  const startDrawing = () => {
    setDrawing(true);

    const canvas = canvasRef.current.getContext('2d');
    canvas.beginPath();
  };

  const endDrawing = () => {
    setDrawing(false);
  };

  const clearDrawing = () => {
    const canvas = canvasRef.current.getContext('2d');
    canvas.clearRect(0, 0, canvasWidth, canvasHeight);
  };

  const draw = (x, y) => {
    if (!drawing) return;
    const canvas = canvasRef.current.getContext('2d');
    canvas.lineTo(x, y);
    canvas.stroke();
  };

  const predict = async () => {
    const base64String = canvasRef.current.toDataURL('image/png');
    // console.log(base64String);

    const response = await axios
      .post('http://localhost:8000/api/predict', {
        image: base64String,
      })
      .catch((err) => {
        alert('an error occured while predicting');
      });

    console.log(response);
  };

  return (
    <SContainer>
      <h1>Hand Written Recognition</h1>

      <SCanvas
        width={canvasWidth}
        height={canvasHeight}
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onMouseMove={(e) => draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
      />

      <SButtonContainer>
        <SButton onClick={clearDrawing}>reset</SButton>
        <SButton onClick={predict}>predict</SButton>
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
  cursor: pointer;
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
