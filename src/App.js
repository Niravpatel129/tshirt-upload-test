import { saveAs } from 'file-saver';
import React, { useEffect, useRef, useState } from 'react';
import FileBase64 from 'react-file-base64';

function App() {
  const [file, setFile] = useState('');
  const [designLoaded, setDesignLoaded] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [resizeStart, setResizeStart] = useState(null);
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [size, setSize] = useState({ width: 300, height: 400 });
  const aspectRatio = size.width / size.height; // Calculate aspect ratio of the design image
  const tshirtImage =
    'https://media.gq.com/photos/6401155ff7ebd0f74ae66ae0/3:4/w_2580%2Cc_limit/white-tee.jpg';
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const tshirtImg = new Image();
    const designImg = new Image();

    tshirtImg.crossOrigin = 'anonymous';
    designImg.crossOrigin = 'anonymous';

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(tshirtImg, 0, 0, canvas.width, canvas.height);
      if (designLoaded) {
        context.drawImage(designImg, position.x, position.y, size.width, size.height);

        // Draw resize handle
        const handleSize = 10; // Size of the resize handle
        const handleX = position.x + size.width - handleSize / 2; // X position of the handle
        const handleY = position.y + size.height - handleSize / 2; // Y position of the handle
        context.fillStyle = 'red'; // Color of the handle
        context.fillRect(handleX, handleY, handleSize, handleSize); // Drawing the handle
      }
    };

    tshirtImg.onload = draw;
    tshirtImg.src = tshirtImage;

    if (file) {
      designImg.onload = () => {
        setDesignLoaded(true);
        draw();
      };
      designImg.src = file;
    }

    const handleMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      if (
        mouseX > position.x + size.width - 10 &&
        mouseX < position.x + size.width + 10 &&
        mouseY > position.y + size.height - 10 &&
        mouseY < position.y + size.height + 10
      ) {
        setResizeStart({ x: mouseX, y: mouseY });
        setDragStart(null); // Prevent dragging when resizing
      } else if (
        mouseX > position.x &&
        mouseX < position.x + size.width &&
        mouseY > position.y &&
        mouseY < position.y + size.height
      ) {
        setDragStart({ x: mouseX - position.x, y: mouseY - position.y });
        setResizeStart(null); // Prevent resizing when dragging
      } else {
        setDragStart(null);
        setResizeStart(null);
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      if (dragStart) {
        setPosition({
          x: mouseX - dragStart.x,
          y: mouseY - dragStart.y,
        });
        draw();
      } else if (resizeStart) {
        if (e.shiftKey) {
          // Maintain aspect ratio if Shift is held
          let diff = Math.min(mouseX - resizeStart.x, mouseY - resizeStart.y);
          setSize({
            width: Math.max(100, size.width + diff * aspectRatio),
            height: Math.max(100, (size.width + diff * aspectRatio) / aspectRatio),
          });
        } else {
          // Default resize behavior
          setSize({
            width: Math.max(100, size.width + mouseX - resizeStart.x),
            height: Math.max(100, size.height + mouseY - resizeStart.y),
          });
        }
        setResizeStart({ x: mouseX, y: mouseY });
        draw();
      }
    };

    const handleMouseUp = () => {
      setDragStart(null);
      setResizeStart(null);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [file, designLoaded, position, dragStart, resizeStart, size, aspectRatio]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
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
        style={{ border: '1px solid #ccc', margin: '20px auto', display: 'block' }}
      ></canvas>
      <button onClick={handleExport}>Export</button>
    </div>
  );
}

export default App;
