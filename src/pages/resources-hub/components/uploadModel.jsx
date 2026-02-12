import React, { useState, useContext } from "react";
import { ResourceContext } from "../../../context/resourceContext";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const UploadModal = ({ isOpen, onClose }) => {
  const { uploadNotes, uploadRoadmap, uploadPYQ } = useContext(ResourceContext);

  const [type, setType] = useState("notes");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form Data State
  const [commonData, setCommonData] = useState({ title: "", description: "", tags: "", thumbnail: null });
  const [notesData, setNotesData] = useState({ branch: "", semester: "", link: "" });
  const [pyqData, setPyqData] = useState({ company: "", year: "", difficulty: "Easy", link: "" });
  const [modules, setModules] = useState([{ moduleTitle: "", moduleDescription: "", resources: [{ title: "", link: "" }] }]);

  const resetForms = () => {
    setCommonData({ title: "", description: "", tags: "", thumbnail: null });
    setNotesData({ branch: "", semester: "", link: "" });
    setPyqData({ company: "", year: "", difficulty: "Easy", link: "" });
    setModules([{ moduleTitle: "", moduleDescription: "", resources: [{ title: "", link: "" }] }]);
  };

  if (!isOpen) return null;

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
      if (type !== 'pyq') payload.append("title", commonData.title);
      payload.append("description", commonData.description || "");
      payload.append("tags", commonData.tags || "");
      if (commonData.thumbnail) payload.append("thumbnail", commonData.thumbnail);

      if (type === "notes") {
        payload.append("link", notesData.link);
        payload.append("branch", notesData.branch);
        payload.append("semester", notesData.semester);
        await uploadNotes(payload);
      } else if (type === "roadmap") {
        payload.append("modules", JSON.stringify(modules));
        await uploadRoadmap(payload);
      } else if (type === "pyq") {
        payload.append("link", pyqData.link);
        payload.append("company", pyqData.company);
        payload.append("year", pyqData.year);
        payload.append("difficulty", pyqData.difficulty);
        await uploadPYQ(payload);
      }

      resetForms();
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
      {type !== 'pyq' && (
        <div><label className="block mb-1 font-medium">Title</label><input type="text" name="title" value={commonData.title} onChange={handleCommonChange} className="w-full border rounded px-3 py-2" required /></div>
      )}
      <div><label className="block mb-1 font-medium">Description</label><textarea name="description" value={commonData.description} onChange={handleCommonChange} className="w-full border rounded px-3 py-2" /></div>
      <div><label className="block mb-1 font-medium">Thumbnail (Optional)</label><input type="file" accept="image/*" onChange={handleThumbnailSelect} className="w-full border rounded px-3 py-2" /></div>
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
      {type === 'pyq' && (
         <div><label className="block mb-1 font-medium">Company</label><input type="text" name="company" placeholder="e.g. TCS, Google" value={pyqData.company} onChange={handlePyqChange} className="w-full border rounded px-3 py-2" required /></div>
      )}
      <div><label className="block mb-1 font-medium">Link (PDF / GDrive / etc.)</label><input type="text" placeholder="https://" required name="link" value={pyqData.link} onChange={handlePyqChange} className="w-full border rounded px-3 py-2" /></div>
      <input type="number" placeholder="Year (e.g. 2024)" name="year" value={pyqData.year} onChange={handlePyqChange} className="w-full border rounded px-3 py-2"/>
      <select name="difficulty" value={pyqData.difficulty} onChange={handlePyqChange} className="w-full border rounded px-3 py-2"><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option></select>
    </>
  );
  const renderRoadmapInputs = () => (
    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
      <h3 className="text-lg font-medium">Roadmap Modules</h3>
      {modules.map((mod, modIdx) => (
        <div key={modIdx} className="p-3 border rounded-lg bg-slate-50 space-y-3">
          <input type="text" placeholder={`Module ${modIdx + 1} Title`} name="moduleTitle" value={mod.moduleTitle} onChange={(e) => handleModuleChange(modIdx, e)} className="w-full border rounded px-3 py-2 font-medium" required />
          <textarea placeholder="Module Description" name="moduleDescription" value={mod.moduleDescription} onChange={(e) => handleModuleChange(modIdx, e)} className="w-full border rounded px-3 py-2" />
          <div className="space-y-2 pl-4 border-l-2">
            <h4 className="text-sm font-medium">Lessons / Resources</h4>
            {mod.resources.map((res, resIdx) => (
              <div key={resIdx} className="flex gap-2">
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
        <h2 className="text-xl font-semibold mb-4">Upload Resource</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Type</label>
            <select name="type" value={type} onChange={(e) => setType(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="notes">Study Notes</option>
              <option value="roadmap">Career Roadmap</option>
              <option value="pyq">Interview PYQ</option>
            </select>
          </div>
          {renderCommonInputs()}
          {type === "notes" && renderNotesInputs()}
          {type === "pyq" && renderPyqInputs()}
          {type === "roadmap" && renderRoadmapInputs()}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Uploading..." : "Upload Resource"}</Button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;