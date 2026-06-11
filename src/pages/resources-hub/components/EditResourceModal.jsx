import React, { useState, useContext, useEffect } from "react";
import { ResourceContext } from "../../../context/resourceContext";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import toast, { Toaster } from "react-hot-toast";

const EditResourceModal = ({ isOpen, onClose, resource }) => {
  const { updateNote, updateRoadmap, updatePYQ, refreshResources } = useContext(ResourceContext);

  if (!isOpen || !resource || !resource.type) {
    return null; // Don't render if the resource is invalid
  }

  const { type, _id } = resource;

  // Convert "Notes", "Roadmap", "Interview PYQ" to simple keys
  const resourceKey = type.startsWith("Interview") ? "pyq" : type.toLowerCase();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form Data State
  const [commonData, setCommonData] = useState({ title: "", description: "", tags: "", thumbnail: null });
  const [notesData, setNotesData] = useState({ branch: "", semester: "", link: "" });
  const [pyqData, setPyqData] = useState({ company: "", year: "", difficulty: "Easy", link: "" });
  const [modules, setModules] = useState([]);

  // Notes Specific Edit State
  const [noteTitle, setNoteTitle] = useState("");
  const [noteSubName, setNoteSubName] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [noteYear, setNoteYear] = useState("1");
  const [noteUploadType, setNoteUploadType] = useState("file");
  const [noteFile, setNoteFile] = useState(null);
  const [noteLink, setNoteLink] = useState("");
  const [noteThumbnail, setNoteThumbnail] = useState(null);

  // Pre-fill form when modal opens
  useEffect(() => {
    setCommonData({
      title: resource.title || "",
      description: resource.description || "",
      tags: resource.tags?.join(', ') || "",
      thumbnail: null,
    });

    if (resourceKey === "notes") {
      setNoteTitle(resource.title || "");
      setNoteSubName(resource.subName || "");
      setNoteDescription(resource.description || "");
      setNoteYear(resource.year || "1");
      setNoteUploadType(resource.fileUrl ? "file" : "link");
      setNoteLink(resource.link || "");
      setNoteFile(null);
      setNoteThumbnail(null);
    } else if (resourceKey === "pyq") {
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
  }, [resource, resourceKey]);


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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (resourceKey === "notes") {
        const payload = new FormData();
        if (noteTitle.trim()) payload.append("title", noteTitle.trim());
        if (noteSubName.trim()) payload.append("subName", noteSubName.trim());
        if (noteDescription.trim()) payload.append("description", noteDescription.trim());
        if (noteYear) payload.append("year", noteYear);

        if (noteUploadType === "file") {
          if (noteFile) {
            payload.append("file", noteFile);
          }
        } else {
          if (noteLink.trim()) {
            payload.append("link", noteLink.trim());
          }
        }

        if (noteThumbnail) {
          payload.append("thumbnail", noteThumbnail);
        }

        await updateNote(_id, payload);
        toast.success("Notes updated successfully!");
        if (refreshResources) await refreshResources();
        onClose();
      } else {
        const payload = new FormData();
        if (resourceKey !== 'pyq') payload.append("title", commonData.title);
        payload.append("description", commonData.description || "");
        payload.append("tags", commonData.tags || "");
        if (commonData.thumbnail) payload.append("thumbnail", commonData.thumbnail);

        if (resourceKey === "roadmap") {
          payload.append("modules", JSON.stringify(modules));
          await updateRoadmap(_id, payload);
        } else if (resourceKey === "pyq") {
          payload.append("link", pyqData.link);
          payload.append("company", pyqData.company);
          payload.append("year", pyqData.year);
          payload.append("difficulty", pyqData.difficulty);
          await updatePYQ(_id, payload);
        }
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2.5 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs font-semibold mt-1 shadow-sm";
  const textareaClass = "w-full bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2.5 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs font-semibold mt-1 min-h-[80px] shadow-sm";
  const selectClass = "w-full bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs font-semibold mt-1 cursor-pointer shadow-sm";
  const fileInputClass = "w-full bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs font-semibold mt-1 shadow-sm";

  // --- Render Functions ---
  const renderCommonInputs = () => (
    <>
      {resourceKey !== 'pyq' && (
        <div className="text-left">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Title</label>
          <input type="text" name="title" value={commonData.title} onChange={handleCommonChange} className={inputClass} required />
        </div>
      )}
      <div className="text-left">
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Description</label>
        <textarea name="description" value={commonData.description} onChange={handleCommonChange} className={textareaClass} />
      </div>
      <div className="text-left">
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">New Thumbnail (Optional)</label>
        <input type="file" accept="image/*" onChange={handleThumbnailSelect} className={fileInputClass} />
        {resource.thumbnail && !commonData.thumbnail && (
          <p className="text-[10px] text-slate-400 font-extrabold mt-1.5">Currently using: {resource.thumbnail.split('/').pop()}</p>
        )}
      </div>
      <div className="text-left">
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Tags (comma-separated)</label>
        <input type="text" placeholder="e.g. DSA, React, WebDev" name="tags" value={commonData.tags} onChange={handleCommonChange} className={inputClass} />
      </div>
    </>
  );

  const renderNotesForm = () => (
    <div className="space-y-4">
      {/* TITLE */}
      <div className="text-left">
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
          TITLE <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* SUBJECT NAME (subName) */}
      <div className="text-left">
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
          SUBJECT NAME <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          value={noteSubName}
          onChange={(e) => setNoteSubName(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* DESCRIPTION */}
      <div className="text-left">
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
          DESCRIPTION
        </label>
        <textarea
          value={noteDescription}
          onChange={(e) => setNoteDescription(e.target.value)}
          className={textareaClass}
        />
      </div>

      {/* YEAR */}
      <div className="text-left">
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
          YEAR
        </label>
        <select
          value={noteYear}
          onChange={(e) => setNoteYear(e.target.value)}
          className={selectClass}
        >
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>
      </div>

      {/* UPLOAD TYPE toggle */}
      <div className="space-y-1 text-left">
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
          Upload Type
        </label>
        <div className="relative flex p-0.5 bg-slate-100 rounded-xl border border-slate-200/60">
          <div
            className="absolute inset-y-0.5 rounded-lg bg-white shadow-sm transition-all duration-300 pointer-events-none"
            style={{
              width: 'calc(50% - 3px)',
              left: noteUploadType === 'file' ? '2.5px' : 'calc(50% + 0.5px)'
            }}
          />
          <button
            type="button"
            onClick={() => setNoteUploadType("file")}
            className={`relative z-10 flex-1 py-2 text-[11px] font-bold rounded-lg transition-colors duration-300 flex items-center justify-center gap-1.5 focus:outline-none border-none bg-transparent cursor-pointer ${
              noteUploadType === "file" ? "text-indigo-600 font-extrabold" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setNoteUploadType("link")}
            className={`relative z-10 flex-1 py-2 text-[11px] font-bold rounded-lg transition-colors duration-300 flex items-center justify-center gap-1.5 focus:outline-none border-none bg-transparent cursor-pointer ${
              noteUploadType === "link" ? "text-indigo-600 font-extrabold" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <span>Drive Link</span>
          </button>
        </div>
      </div>

      {/* Conditional Input UI for Notes */}
      <div className="min-h-[100px] flex flex-col justify-center text-left">
        {noteUploadType === "file" ? (
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
              File (.pdf, .doc, .docx)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setNoteFile(e.target.files[0] || null)}
              className={fileInputClass}
            />
            {resource.fileUrl && !noteFile && (
              <p className="text-[10px] text-slate-400 font-extrabold mt-1">
                Current file: {resource.fileUrl.split('/').pop()}
              </p>
            )}
            {noteFile && (
              <p className="text-[10px] text-emerald-600 font-bold mt-1">
                Selected: {noteFile.name} ({(noteFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
              Drive Link <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              required={noteUploadType === "link"}
              value={noteLink}
              onChange={(e) => setNoteLink(e.target.value)}
              placeholder="https://"
              className={inputClass}
            />
          </div>
        )}
      </div>

      {/* THUMBNAIL (optional) */}
      <div className="text-left">
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
          THUMBNAIL (optional — current shown above)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNoteThumbnail(e.target.files[0] || null)}
          className={fileInputClass}
        />
        {resource.thumbnail && !noteThumbnail && (
          <div className="mt-1.5 space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold block">
              CURRENT THUMBNAIL
            </span>
            <div className="border border-slate-100 rounded-xl p-1 w-fit bg-slate-50">
              <img
                src={resource.thumbnail}
                alt="Current thumbnail preview"
                className="max-h-[80px] rounded-lg object-contain"
              />
            </div>
          </div>
        )}
        {noteThumbnail && (
          <div className="mt-1.5 space-y-1">
            <span className="text-[10px] text-emerald-600 font-extrabold block">
              NEW THUMBNAIL PREVIEW
            </span>
            <div className="border border-slate-100 rounded-xl p-2 w-fit bg-slate-50 flex items-center gap-3 relative group">
              <img
                src={URL.createObjectURL(noteThumbnail)}
                alt="New thumbnail preview"
                className="max-h-[80px] rounded-lg object-contain"
              />
              <button
                type="button"
                onClick={() => setNoteThumbnail(null)}
                className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-sm hover:scale-105 active:scale-95 transition-all border-none cursor-pointer flex items-center justify-center"
                title="Clear New Thumbnail"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderNotesInputs = () => null;

  const renderPyqInputs = () => (
    <>
      <div className="text-left">
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Company</label>
        <input type="text" name="company" placeholder="e.g. TCS, Google" value={pyqData.company} onChange={handlePyqChange} className={inputClass} required />
      </div>
      <div className="text-left">
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Link (PDF / GDrive / etc.)</label>
        <input type="text" placeholder="https://" required name="link" value={pyqData.link} onChange={handlePyqChange} className={inputClass} />
      </div>
      <div className="text-left">
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Year</label>
        <input type="number" placeholder="Year (e.g. 2024)" name="year" value={pyqData.year} onChange={handlePyqChange} className={inputClass} />
      </div>
      <div className="text-left">
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Difficulty</label>
        <select name="difficulty" value={pyqData.difficulty} onChange={handlePyqChange} className={selectClass}>
          <option value="Easy" className="bg-white text-slate-700 font-bold">Easy</option>
          <option value="Medium" className="bg-white text-slate-700 font-bold">Medium</option>
          <option value="Hard" className="bg-white text-slate-700 font-bold">Hard</option>
        </select>
      </div>
    </>
  );

  const renderRoadmapInputs = () => (
    <div className="space-y-4 max-h-64 overflow-y-auto pr-2 text-left">
      <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-widest">Roadmap Modules</h3>
      {modules.map((mod, modIdx) => (
        <div key={mod._id || modIdx} className="p-4 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-3">
          <input type="text" placeholder={`Module ${modIdx + 1} Title`} name="moduleTitle" value={mod.moduleTitle} onChange={(e) => handleModuleChange(modIdx, e)} className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 font-semibold text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm" required />
          <textarea placeholder="Module Description" name="moduleDescription" value={mod.moduleDescription} onChange={(e) => handleModuleChange(modIdx, e)} className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm" />
          <div className="space-y-2 pl-4 border-l-2 border-dashed border-slate-200">
            <h4 className="text-xs font-extrabold text-slate-400">Lessons / Resources</h4>
            {mod.resources.map((res, resIdx) => (
              <div key={res._id || resIdx} className="flex gap-2">
                <input type="text" placeholder="Lesson Title" name="title" value={res.title} onChange={(e) => handleResourceChange(modIdx, resIdx, e)} className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm" required />
                <input type="text" placeholder="https://youtube.com/..." name="link" value={res.link} onChange={(e) => handleResourceChange(modIdx, resIdx, e)} className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm" required />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="border-slate-200 text-slate-500 hover:bg-slate-100 font-bold text-xs" onClick={() => addResource(modIdx)} iconName="Plus">Add Lesson</Button>
          </div>
        </div>
      ))}
      <button type="button" className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold text-xs py-2 px-4 rounded-xl border-none shadow-sm hover:shadow-lg flex items-center gap-1.5 cursor-pointer" onClick={addModule}>
        <Icon name="Plus" size={13} />
        Add Module
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="relative w-full max-w-lg bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto text-slate-800">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-400 hover:text-slate-600 focus:outline-none transition-all duration-200 cursor-pointer"><Icon name="X" size={16} /></button>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none mb-6 font-poppins text-left">Edit {resource.type}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {resourceKey === "notes" ? (
            renderNotesForm()
          ) : (
            <>
              {renderCommonInputs()}
              {resourceKey === "pyq" && renderPyqInputs()}
              {resourceKey === "roadmap" && renderRoadmapInputs()}
            </>
          )}

          {error && <p className="text-rose-600 text-xs font-bold text-center bg-rose-50 border border-rose-200 py-2 px-3 rounded-xl animate-pulse">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xs rounded-xl border-none cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60">{loading ? "Saving Changes..." : "Save Changes"}</button>
        </form>
      </div>
    </div>
  );
};

export default EditResourceModal;