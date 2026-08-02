const FileDropzone = ({ file, setFile }) => {
  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        Resource File
      </label>

      <input
        type="file"
        onChange={handleChange}
        className="block w-full rounded-lg border p-3"
      />

      {file && (
        <p className="mt-2 text-sm text-gray-600">
          Selected: {file.name}
        </p>
      )}
    </div>
  );
};

export default FileDropzone;