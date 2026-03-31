import React from "react";
import { FileText } from "lucide-react";

const DeclarationForm = ({ data, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-gray-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Declaration
          </h3>
          <p className="text-sm text-gray-600">
            Add a professional declaration or statement (optional)
          </p>
        </div>
      </div>

      <textarea
        value={data || ""}
        onChange={handleChange}
        placeholder="I hereby declare that the information provided above is true to the best of my knowledge and belief. I am aware that providing false information could lead to termination of employment or contract."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition resize-none"
        rows={4}
        maxLength={1000}
      />

      <p className="text-xs text-gray-500">
        {data ? data.length : 0} / 1000 characters
      </p>
    </div>
  );
};

export default DeclarationForm;
