import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface AttachmentUploaderProps {
  onUpload: (file: File) => void;
}

const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({ onUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${isDragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-gray-700">Dosyayı buraya bırakın...</p>
      ) : (
        <p className="text-gray-700">Dosyaları buraya sürükleyip bırakın veya seçmek için tıklayın</p>
      )}
    </div>
  );
};

export default AttachmentUploader;
