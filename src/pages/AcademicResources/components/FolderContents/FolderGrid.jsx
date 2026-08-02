import FolderCard from "./FolderCard";

const FolderGrid = ({ folders = [] }) => {
  if (!folders.length) return null;

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {folders.map((folder) => (
        <FolderCard
          key={folder._id}
          folder={folder}
        />
      ))}
    </div>
  );
};

export default FolderGrid;