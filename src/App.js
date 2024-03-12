import { saveAs } from 'file-saver';
import { toPng } from 'html-to-image';
import React, { useState } from 'react';
import FileBase64 from 'react-file-base64';

function App() {
  const [file, setFile] = useState('');

  const tshirtImage = 'https://i.ebayimg.com/images/g/AmAAAOSwuaFZ4TcY/s-l1200.jpg'; // URL of the blank t-shirt

  const handleExport = () => {
    toPng(document.getElementById('tshirt-container'), { cacheBust: true })
      .then(function (dataUrl) {
        saveAs(dataUrl, 'custom-t-shirt.png');
      })
      .catch(function (error) {
        console.error('Failed to export design', error);
      });
  };

  return (
    <div className='App' style={{ textAlign: 'center' }}>
      <h1>Custom T-Shirt Designer</h1>
      <FileBase64 multiple={false} onDone={({ base64 }) => setFile(base64)} />
      <div
        id='tshirt-container'
        style={{
          width: '600px',
          height: '700px',
          position: 'relative',
          margin: '20px auto',
          border: '1px solid #ccc',
        }}
      >
        <img
          src={tshirtImage}
          alt='T-Shirt'
          style={{ width: '100%', height: '100%', position: 'absolute', top: '0', left: '0' }}
        />
        {file && (
          <img
            src={file}
            alt='Design'
            style={{
              width: '300px',
              height: '400px',
              position: 'absolute',
              top: '150px',
              left: '150px',
              objectFit: 'cover',
            }}
          />
        )}
      </div>
      <button onClick={handleExport}>Export</button>
    </div>
  );
}

export default App;
