'use client';

import React, { useState, useEffect } from 'react';
import { TeamMember, getTeamMembers, getInitials } from '../lib/initialData';

interface DeveloperSelectorProps {
  selectedDevelopers: string[];
  onSelectionChange: (developers: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeveloperSelector({
  selectedDevelopers,
  onSelectionChange,
  isOpen,
  onClose
}: DeveloperSelectorProps) {
  const [teamMembers] = useState<TeamMember[]>(getTeamMembers());
  const [selected, setSelected] = useState<string[]>(selectedDevelopers);

  useEffect(() => {
    setSelected(selectedDevelopers);
  }, [selectedDevelopers]);

  const handleToggleDeveloper = (name: string) => {
    const newSelected = selected.includes(name)
      ? selected.filter(dev => dev !== name)
      : [...selected, name].slice(0, 4); // Limit to 4 developers
    setSelected(newSelected);
  };

  const handleSave = () => {
    onSelectionChange(selected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium mb-4">Select Developers (max 4)</h3>
        
        <div className="space-y-2 mb-6">
          {teamMembers.map(member => (
            <label
              key={member.name}
              className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(member.name)}
                onChange={() => handleToggleDeveloper(member.name)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                disabled={!selected.includes(member.name) && selected.length >= 4}
              />
              <span 
                className="ml-3 flex items-center"
                style={{ color: member.color }}
              >
                {member.name}
                {selected.includes(member.name) && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({getInitials(member.name)})
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 