import type { ChangeEvent, ReactElement } from 'react';
import React, { useRef, useState } from 'react';
import ImageUploader from '../../components/image-uploader';
import { useAppDispatch } from '../../app/hooks';
import { fetchImage } from '../../features/api/slice';

const Camera = (): ReactElement => {
  // const  image = useAppSelector((state: RootState) => state.userInfo);
  const dispatch = useAppDispatch();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCaptured, setIsCaptured] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);

  const startCamera = async () => {
    setIsCaptured(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true, //{ width: 1280, height: 720 },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const captureImage = () => {
    // setIsCaptured(false);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext('2d')
        ?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/png');
      setCapturedImage(imageDataUrl);
    }
  };

  const saveImageToDesktop = async () => {
    if (!capturedImage) return;
    dispatch(fetchImage(capturedImage));

    try {
      if (window.showSaveFilePicker) {
        const handle = await window.showSaveFilePicker({
          suggestedName: 'image.png',
          types: [
            {
              accept: {
                'image/png': ['.png'],
              },
            },
          ],
        });

        const writable = await handle.createWritable();
        // await writable.write(capturedImage.split(',')[1], { type: 'base64' });
        const imageData = capturedImage.split(',')[1];
        const buffer = Uint8Array.from(atob(imageData), (c) => c.charCodeAt(0));
        await writable.write(buffer);
        await writable.close();
        console.log('Image saved to desktop successfully!');
      }
    } catch (err) {
      console.error('Error saving image to desktop:', err);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex justify-center mb-2">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ display: 'block', width: '100%', height: '450px' }}
        />
      </div>
      <div className="flex justify-center">
        <canvas ref={canvasRef} style={{ display: 'block', height: '450px' }} />
      </div>
      {capturedImage && (
        <div className="flex justify-around my-5">
          {/* <img src={capturedImage} alt="Captured" /> */}
          <div className="bg-black py-6 px-10 text-white text-3xl cursor-pointer hover:bg-red-600 rounded-md">
            <a href={capturedImage} download="image.png">
              Download Image
            </a>
          </div>
          <button
            onClick={saveImageToDesktop}
            className="bg-black py-6 px-10 text-white text-3xl cursor-pointer hover:bg-red-600 rounded-md"
          >
            Save to Folder
          </button>
        </div>
      )}
      {isCaptured && (
        <div className="flex flex-row justify-center items-center mb-20">
          <button
            aria-label="Open Camera value"
            onClick={() => captureImage()}
            className="bg-black py-6 px-10 text-white text-3xl cursor-pointer hover:bg-red-600 rounded-md"
          >
            Capture Image
          </button>
        </div>
      )}

      {!isCaptured && (
        <div className="flex flex-row justify-center items-center mb-20">
          <button
            aria-label="Open Camera value"
            onClick={() => startCamera()}
            className="bg-black py-6 px-10 text-white text-3xl cursor-pointer hover:bg-red-600 rounded-md"
          >
            Open Camera
          </button>
        </div>
      )}
      <div className="flex justify-center">
        <ImageUploader />
      </div>
    </div>
  );
};

export default Camera;
