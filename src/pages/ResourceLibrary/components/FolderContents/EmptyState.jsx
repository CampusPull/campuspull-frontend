const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">

      <div className="text-6xl">
        📂
      </div>

      <h2 className="mt-6 text-xl font-semibold text-gray-800">
        Empty Folder
      </h2>

      <p className="mt-2 max-w-md text-center text-gray-500">
        This folder doesn't contain any resources or subfolders yet.
      </p>

    </div>
  );
};

export default EmptyState;