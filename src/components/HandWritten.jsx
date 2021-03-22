import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const HandWritten = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [predictedLabel, setPredictedLabel] = useState('');
  const [predictionProb, setPredictionProb] = useState([]);
  const [base64String, setBase64String] = useState('');

  const canvasWidth = 128;
  const canvasHeight = 128;

  const modelList = ['simple', 'auged'];
  const [selectedModel, setSelectedModel] = useState(modelList[0]);

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

  const handleReset = () => {
    clearDrawing();

    setPredictedLabel('');
    setPredictionProb([]);
  };

  const predict = async () => {
    const resizedCanvas = document.createElement('canvas');
    const resizedContext = resizedCanvas.getContext('2d');

    resizedCanvas.height = '28';
    resizedCanvas.width = '28';

    const canvas = canvasRef.current;

    resizedContext.drawImage(canvas, 0, 0, 28, 28);
    setBase64String(resizedCanvas.toDataURL('image'));
    // const base64String = canvasRef.current.toDataURL('image/png');
    // console.log(base64String);
  };

  useEffect(() => {
    if (base64String) {
      (async () => {
        const response = await axios
          .post('http://localhost:8000/api/predict', {
            image: base64String,
            model_type: selectedModel,
          })
          .catch((err) => {
            console.log('an error occured while predicting');
          });
        setPredictedLabel(response.data.predicted_label);
        setPredictionProb(response.data.prediction_prob);
      })();
    }
  }, [base64String, selectedModel]);

  const onSelectedModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  return (
    <SContainer>
      <h1>手書き文字予測</h1>

      <SModelList>
        {modelList.map((model, index) => (
          <div key={index}>
            <input
              type="radio"
              value={model}
              name={model}
              checked={selectedModel === model}
              onChange={onSelectedModelChange}
            />
            <label>{model}</label>
          </div>
        ))}
      </SModelList>

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
        <SButton onClick={handleReset}>reset</SButton>
        <SButton onClick={predict}>predict</SButton>
      </SButtonContainer>

      <div>
        {predictedLabel === '' || <h2>予測値: {predictedLabel}</h2>}
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
const SModelList = styled.div`
  display: flex;
`;

export default HandWritten;
