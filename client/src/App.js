import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {

  const backendUrl = process.env.REACT_APP_BACKEND_URL

  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');
  const [error, setError] = useState(null);

  // Handle file upload
  const handleFileChange = (e)=>{
    if (e.target.files) {
      setFile(e.target.files[0]);
      setError(null); // Clear previous errors when a new file is selected
    }
  };

  // Handle password input
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle form submit (file upload and conversion)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please upload a file');
      return;
    }

    setLoading(true);
    setDownloadLink('');
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    try {
      // Upload the .docx file
      console.log('Uploading file');
      
      const uploadResponse = await axios.post(backendUrl+'/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded');

      // Now call the convert API
      const { filePath } = uploadResponse.data;
      const convertResponse = await axios.post(backendUrl+'/api/convert', {
        filePath,
        password,
      });

      // Set the download link for the converted PDF
      setDownloadLink(convertResponse?.data?.downloadUrl);
      
      setLoading(false);
    } catch (error) {
      console.error('Error during file conversion', error);
      setError('Error during file conversion. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold text-center my-5 text-gray-800">Convert Word (.docx) to PDF</h1>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <div className="mb-4">
          <label htmlFor="file" className="block text-sm font-semibold text-gray-700">Upload .docx File</label>
          <input
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Enter PDF Password (optional)</label>
          <input
            type="text"
            placeholder="Enter password for PDF"
            value={password}
            onChange={handlePasswordChange}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className={`px-6 py-2 text-white bg-blue-500 rounded-md ${loading ? 'cursor-wait' : 'hover:bg-blue-600'}`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <path d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0z" fill="currentColor" />
                </svg>
                Converting...
              </span>
            ) : (
              'Convert'
            )}
          </button>
        </div>
      </form>

      {/* Show error message */}
      {error && (
        <div className="mt-6 text-center text-red-600 font-semibold">
          {error}
        </div>
      )}

      {/* Show download link */}
      {downloadLink && (
        <div className="mt-6 text-center">
          <a href={downloadLink} className="inline-block px-6 py-2 text-white bg-green-500 rounded-md hover:bg-green-600" download>
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}

export default App;




