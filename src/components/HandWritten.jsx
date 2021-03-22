import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const HandWritten = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [predictedLabel, setPredictedLabel] = useState('');
  const [predictionProb, setPredictionProb] = useState([]);

  const canvasWidth = 128;
  const canvasHeight = 128;

  const data = {
    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    datasets: [
      {
        label: 'prediction',
        data: predictionProb,
      },
    ],
  };

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
    const resizedCanvas = document.createElement('canvas');
    const resizedContext = resizedCanvas.getContext('2d');

    resizedCanvas.height = '28';
    resizedCanvas.width = '28';

    const canvas = canvasRef.current;

    resizedContext.drawImage(canvas, 0, 0, 28, 28);
    const base64String = resizedCanvas.toDataURL('image');
    // const base64String = canvasRef.current.toDataURL('image/png');
    // console.log(base64String);

    const response = await axios
      .post('http://localhost:8000/api/predict', {
        image: base64String,
      })
      .catch((err) => {
        console.log('an error occured while predicting');
      });

    setPredictedLabel(response.data.predicted_label);
    setPredictionProb(response.data.prediction_prob);
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

      <div>
        <h2>Predicted: {predictedLabel}</h2>
        <Bar data={data} />
      </div>
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
