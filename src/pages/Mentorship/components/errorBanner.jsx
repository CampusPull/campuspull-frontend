const ErrorBanner = ({ message }) => {
  if (!message) return null;
  return (
    <div className="mb-3 rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
      {message}
    </div>
  );
};

export default ErrorBanner;
