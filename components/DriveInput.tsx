import React, { useRef } from 'react';

// FIX: Augment React's InputHTMLAttributes to include non-standard 'directory' and 'webkitdirectory' properties.
// This is necessary to allow users to select a directory for uploading files, resolving the TypeScript error.
declare module 'react' {
  interface InputHTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

interface FolderUploaderProps {
  onUploadFolder: (files: FileList) => void;
  isLoading: boolean;
}

const FolderUploader: React.FC<FolderUploaderProps> = ({ onUploadFolder, isLoading }) => {
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFolder(e.target.files);
    }
  };

  const handleButtonClick = () => {
    folderInputRef.current?.click();
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Upload Your Music</h2>
      <p className="text-sm text-gray-400 mb-4">
        Select a folder with your audio files to add them to the public playlist.
      </p>
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFileChange}
        multiple
        // These attributes are key for selecting a folder
        directory=""
        webkitdirectory=""
        className="hidden"
        disabled={isLoading}
      />
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isLoading}
        className="w-full mt-4 bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed disabled:text-gray-400 transition duration-200 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </>
        ) : (
          'Upload Folder'
        )}
      </button>
    </div>
  );
};

export default FolderUploader;