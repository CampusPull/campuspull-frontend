import ResourceCard from "./ResourceCard";

const ResourceGrid = ({ resources, onEdit, onDelete }) => {
  if (!resources.length) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Resources</h2>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => (
          <ResourceCard
            key={resource._id}
            resource={resource}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
};

export default ResourceGrid;