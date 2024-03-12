import { saveAs } from 'file-saver';
import React, { useEffect, useRef, useState } from 'react';
import FileBase64 from 'react-file-base64';

function App() {
  const [file, setFile] = useState('');
  const [designLoaded, setDesignLoaded] = useState(false);
  const tshirtImage = 'https://i.ebayimg.com/images/g/AmAAAOSwuaFZ4TcY/s-l1200.jpg';
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const tshirtImg = new Image();
    const designImg = new Image();

    // Set crossOrigin to anonymous for CORS
    tshirtImg.crossOrigin = 'anonymous';
    designImg.crossOrigin = 'anonymous';

    tshirtImg.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(tshirtImg, 0, 0, canvas.width, canvas.height);
      if (designLoaded) {
        context.drawImage(designImg, 150, 150, 300, 400);
      }
    };

    tshirtImg.src = tshirtImage;

    if (file) {
      designImg.onload = () => {
        setDesignLoaded(true);
        context.drawImage(designImg, 150, 150, 300, 400);
      };
      designImg.src = file;
    }
  }, [file, designLoaded]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    canvas.toBlob(function (blob) {
      saveAs(blob, 'custom-t-shirt.png');
    });
  };

  return (
    <div className='App' style={{ textAlign: 'center' }}>
      <h1>Custom T-Shirt Designer</h1>
      <FileBase64 multiple={false} onDone={({ base64 }) => setFile(base64)} />
      <canvas
        ref={canvasRef}
        width={600}
        height={700}
        style={{
          border: '1px solid #ccc',
          margin: '20px auto',
          display: 'block',
        }}
      ></canvas>
      <button onClick={handleExport}>Export</button>
    </div>
  );
}

export default App;
