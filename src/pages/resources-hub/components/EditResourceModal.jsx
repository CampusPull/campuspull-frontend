import React, { useState, useContext, useEffect } from "react";
import { ResourceContext } from "../../../context/resourceContext";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const EditResourceModal = ({ isOpen, onClose, resource }) => {
  const { updateNote, updateRoadmap, updatePYQ } = useContext(ResourceContext);

  // --- THIS IS THE FIX ---
  // We check for the resource and type *before* doing anything else.
  if (!isOpen || !resource || !resource.type) {
    return null; // Don't render if the resource is invalid
  }

  const { type, _id } = resource;
  
  // Convert "Notes", "Roadmap", "Interview PYQ" to simple keys
  const resourceKey = type.startsWith("Interview") ? "pyq" : type.toLowerCase();
  // --- END FIX ---

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form Data State
  const [commonData, setCommonData] = useState({ title: "", description: "", tags: "", thumbnail: null });
  const [notesData, setNotesData] = useState({ branch: "", semester: "", link: "" });
  const [pyqData, setPyqData] = useState({ company: "", year: "", difficulty: "Easy", link: "" });
  const [modules, setModules] = useState([]);

  // Pre-fill form when modal opens
  useEffect(() => {
    // We can be sure 'resource' exists here
    setCommonData({
      title: resource.title || "",
      description: resource.description || "",
      tags: resource.tags?.join(', ') || "",
      thumbnail: null,
    });

    if (resourceKey === "notes") {
      setNotesData({
        branch: resource.branch || "",
        semester: resource.semester || "",
        link: resource.link || "",
      });
    } else if (resourceKey === "pyq") {
      // Maps backend "beginner" to form "Easy"
      const mapDifficultyToForm = (diff) => {
        if (diff === "intermediate") return "Medium";
        if (diff === "advanced") return "Hard";
        return "Easy"; // Default for "beginner" or undefined
      };

      setPyqData({
        company: resource.company || "",
        year: resource.year || "",
        difficulty: mapDifficultyToForm(resource.difficulty),
        link: resource.link || "",
      });
    } else if (resourceKey === "roadmap") {
      setModules(resource.modules || []);
    }
  }, [resource, resourceKey]); // Re-run if the resource prop changes


  // --- Handlers ---
  const handleCommonChange = (e) => setCommonData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleThumbnailSelect = (e) => setCommonData(prev => ({ ...prev, thumbnail: e.target.files[0] }));
  const handleNotesChange = (e) => setNotesData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePyqChange = (e) => setPyqData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleModuleChange = (modIdx, e) => {
    const newModules = [...modules];
    newModules[modIdx][e.target.name] = e.target.value;
    setModules(newModules);
  };
  const handleResourceChange = (modIdx, resIdx, e) => {
    const newModules = [...modules];
    newModules[modIdx].resources[resIdx][e.target.name] = e.target.value;
    setModules(newModules);
  };
  const addModule = () => setModules([...modules, { moduleTitle: "", moduleDescription: "", resources: [{ title: "", link: "" }] }]);
  const addResource = (modIdx) => {
    const newModules = [...modules];
    newModules[modIdx].resources.push({ title: "", link: "" });
    setModules(newModules);
  };
  // --- End Handlers ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = new FormData();
      if (resourceKey !== 'pyq') payload.append("title", commonData.title);
      payload.append("description", commonData.description || "");
      payload.append("tags", commonData.tags || "");
      if (commonData.thumbnail) payload.append("thumbnail", commonData.thumbnail);

      if (resourceKey === "notes") {
        payload.append("link", notesData.link);
        payload.append("branch", notesData.branch);
        payload.append("semester", notesData.semester);
        await updateNote(_id, payload);
      } else if (resourceKey === "roadmap") {
        payload.append("modules", JSON.stringify(modules));
        await updateRoadmap(_id, payload);
      } else if (resourceKey === "pyq") {
        payload.append("link", pyqData.link);
        payload.append("company", pyqData.company);
        payload.append("year", pyqData.year);
        // Form value "Easy" matches backend enum "Easy"
        payload.append("difficulty", pyqData.difficulty); 
        await updatePYQ(_id, payload);
      }

      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Render Functions ---
  const renderCommonInputs = () => (
    <>
      {resourceKey !== 'pyq' && (
        <div><label className="block mb-1 font-medium">Title</label><input type="text" name="title" value={commonData.title} onChange={handleCommonChange} className="w-full border rounded px-3 py-2" required /></div>
      )}
      <div><label className="block mb-1 font-medium">Description</label><textarea name="description" value={commonData.description} onChange={handleCommonChange} className="w-full border rounded px-3 py-2" /></div>
      <div>
        <label className="block mb-1 font-medium">New Thumbnail (Optional)</label>
        <input type="file" accept="image/*" onChange={handleThumbnailSelect} className="w-full border rounded px-3 py-2" />
        {resource.thumbnail && !commonData.thumbnail && (
            <p className="text-xs text-gray-500 mt-1">Currently using: {resource.thumbnail.split('/').pop()}</p>
        )}
      </div>
      <div><label className="block mb-1 font-medium">Tags (comma-separated)</label><input type="text" placeholder="e.g. DSA, React, WebDev" name="tags" value={commonData.tags} onChange={handleCommonChange} className="w-full border rounded px-3 py-2" /></div>
    </>
  );
  const renderNotesInputs = () => (
    <>
      <div><label className="block mb-1 font-medium">Link (PDF / GDrive / etc.)</label><input type="text" placeholder="https://" required name="link" value={notesData.link} onChange={handleNotesChange} className="w-full border rounded px-3 py-2" /></div>
      <input type="text" placeholder="Branch" name="branch" value={notesData.branch} onChange={handleNotesChange} className="w-full border rounded px-3 py-2"/>
      <input type="number" placeholder="Semester" name="semester" value={notesData.semester} onChange={handleNotesChange} className="w-full border rounded px-3 py-2"/>
    </>
  );
  const renderPyqInputs = () => (
    <>
      <div><label className="block mb-1 font-medium">Company</label><input type="text" name="company" placeholder="e.g. TCS, Google" value={pyqData.company} onChange={handlePyqChange} className="w-full border rounded px-3 py-2" required /></div>
      <div><label className="block mb-1 font-medium">Link (PDF / GDrive / etc.)</label><input type="text" placeholder="https://" required name="link" value={pyqData.link} onChange={handlePyqChange} className="w-full border rounded px-3 py-2" /></div>
      <input type="number" placeholder="Year (e.g. 2024)" name="year" value={pyqData.year} onChange={handlePyqChange} className="w-full border rounded px-3 py-2"/>
      <select name="difficulty" value={pyqData.difficulty} onChange={handlePyqChange} className="w-full border rounded px-3 py-2"><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option></select>
    </>
  );
  const renderRoadmapInputs = () => (
    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
      <h3 className="text-lg font-medium">Roadmap Modules</h3>
      {modules.map((mod, modIdx) => (
        <div key={mod._id || modIdx} className="p-3 border rounded-lg bg-slate-50 space-y-3">
          <input type="text" placeholder={`Module ${modIdx + 1} Title`} name="moduleTitle" value={mod.moduleTitle} onChange={(e) => handleModuleChange(modIdx, e)} className="w-full border rounded px-3 py-2 font-medium" required />
          <textarea placeholder="Module Description" name="moduleDescription" value={mod.moduleDescription} onChange={(e) => handleModuleChange(modIdx, e)} className="w-full border rounded px-3 py-2" />
          <div className="space-y-2 pl-4 border-l-2">
            <h4 className="text-sm font-medium">Lessons / Resources</h4>
            {mod.resources.map((res, resIdx) => (
              <div key={res._id || resIdx} className="flex gap-2">
                <input type="text" placeholder="Lesson Title" name="title" value={res.title} onChange={(e) => handleResourceChange(modIdx, resIdx, e)} className="w-full border rounded px-3 py-2" required />
                <input type="text" placeholder="https://youtube.com/..." name="link" value={res.link} onChange={(e) => handleResourceChange(modIdx, resIdx, e)} className="w-full border rounded px-3 py-2" required />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addResource(modIdx)} iconName="Plus">Add Lesson</Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="default" onClick={addModule} iconName="Plus">Add Module</Button>
    </div>
  );
  // --- End Render Functions ---

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"><Icon name="X" size={20} /></button>
        <h2 className="text-xl font-semibold mb-4">Edit {resource.type}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* This block now correctly shows inputs for all types */}
          {renderCommonInputs()}
          {resourceKey === "notes" && renderNotesInputs()}
          {resourceKey === "pyq" && renderPyqInputs()}
          {resourceKey === "roadmap" && renderRoadmapInputs()}

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Saving Changes..." : "Save Changes"}</Button>
        </form>
      </div>
    </div>
  );
};

export default EditResourceModal;