import React, { ChangeEvent, useState } from 'react';

function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // Set the selected image as data URL
      setSelectedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex justify-center mb-10 border-8">
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      {selectedImage && (
        <div className="flex flex-col justify-center ">
          <h2 className="flex justify-center mb-6">Selected Image</h2>
          <img
            src={selectedImage as string}
            alt="Selected"
            style={{ maxWidth: '100%' }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
