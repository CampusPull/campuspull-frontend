// AnswerCard.jsx
import React from "react";
import { Heart, Edit, Trash2 } from "lucide-react";

const AnswerCard = ({
  ans,
  editingAnswerId,
  editingAnswerBody,
  setEditingAnswerId,
  setEditingAnswerBody,
  likeAnswer,
  deleteAnswer,
  handleUpdateAnswer
}) => (
  <div className="bg-gray-100 p-2 rounded-md space-y-1">
    {/* Author Info */}
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center space-x-2">
        <img
          src={ans.author?.avatar || "https://i.pravatar.cc/30"}
          alt={ans.author?.name || "Anonymous"}
          className="w-6 h-6 rounded-full"
        />
        <div>
          <p className="text-sm font-medium text-gray-800">
            {ans.author?.name || "Anonymous"}
          </p>
          <p className="text-xs text-gray-500">{ans.author?.email || ""}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button onClick={() => likeAnswer(ans._id)} className="hover:text-red-500 flex items-center">
          <Heart className="w-4 h-4"/> <span className="ml-1">{ans.likes || 0}</span>
        </button>
        {editingAnswerId === ans._id ? null : (
          <button
            onClick={() => { setEditingAnswerId(ans._id); setEditingAnswerBody(ans.body); }}
            className="hover:text-yellow-500"
          >
            <Edit className="w-4 h-4"/>
          </button>
        )}
        <button onClick={() => deleteAnswer(ans._id)} className="hover:text-red-600">
          <Trash2 className="w-4 h-4"/>
        </button>
      </div>
    </div>

    {/* Inline edit */}
    {editingAnswerId === ans._id ? (
      <div className="space-y-1">
        <textarea
          className="w-full border rounded-lg p-1 mb-1"
          value={editingAnswerBody}
          onChange={(e) => setEditingAnswerBody(e.target.value)}
        />
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpdateAnswer(ans._id)}
            className="px-2 py-1 bg-green-500 text-white rounded"
          >
            Save
          </button>
          <button
            onClick={() => setEditingAnswerId(null)}
            className="px-2 py-1 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <p className="text-gray-800">{ans.body}</p>
    )}
  </div>
);

export default AnswerCard;
