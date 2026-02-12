import { useState } from "react";
import { useStartups } from "../../../context/startupContext";

const AddStartupModal = ({ onClose }) => {
  const { createStartup } = useStartups();

  const [form, setForm] = useState({
    name: "",
    shortDescription: "",
    domain: "",
    stage: "",
    website: "",
    linkedin: "",
    instagram: "",
  });
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("shortDescription", form.shortDescription);
      formData.append("domain", form.domain);
      formData.append("stage", form.stage);

      formData.append(
        "links",
        JSON.stringify({
          website: form.website,
          linkedin: form.linkedin,
          instagram: form.instagram,
        }),
      );

      if (logo) formData.append("logo", logo);

      await createStartup(formData);
      onClose();
    } catch {
      setError("Failed to create startup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Add New Startup</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Startup Name"
              name="name"
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain
              </label>
              <select
                name="domain"
                value={form.domain}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
               focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="">Select domain</option>
                <option value="EdTech">EdTech</option>
                <option value="SaaS">SaaS</option>
                <option value="FinTech">FinTech</option>
                <option value="HealthTech">HealthTech</option>
                <option value="AI / ML">AI / ML</option>
                <option value="Web / App Development">
                  Web / App Development
                </option>
                <option value="Social Impact">Social Impact</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Short Description"
            name="shortDescription"
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stage
              </label>
              <select
                name="stage"
                value={form.stage}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
               focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="">Select stage</option>
                <option value="Ideation">Ideation</option>
                <option value="Prototype">Prototype</option>
                <option value="MVP">MVP</option>
                <option value="Early Stage">Early Stage</option>
                <option value="Growth">Growth</option>
              </select>
            </div>
            <Input label="Website" name="website" onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="LinkedIn" name="linkedin" onChange={handleChange} />
            <Input label="Instagram" name="instagram" onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Startup Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
              className="block w-full text-sm text-gray-600
                         file:mr-4 file:rounded-md file:border-0
                         file:bg-gray-100 file:px-4 file:py-2
                         file:text-sm file:font-medium
                         hover:file:bg-gray-200"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-md bg-black text-white text-sm font-medium
                       hover:bg-gray-900 disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Startup"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStartupModal;

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      {...props}
      rows={3}
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
    />
  </div>
);
