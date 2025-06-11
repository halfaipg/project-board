'use client';

import React from 'react';
import { getInitials, getTeamMembers, TeamMember } from '../lib/initialData';

interface DeveloperDisplayProps {
  developers: string[];
  onClick?: () => void;
  isReadOnly?: boolean;
}

export default function DeveloperDisplay({
  developers,
  onClick,
  isReadOnly = false
}: DeveloperDisplayProps) {
  const teamMembers = getTeamMembers();
  const memberMap = new Map<string, TeamMember>(
    teamMembers.map(member => [member.name, member])
  );

  // Function to get contrasting text color
  const getTextColor = (bgColor: string) => {
    switch (bgColor) {
      case '#9B59B6': return '#6C3483'; // purple -> darker purple
      case '#2ECC71': return '#1E8449'; // green -> darker green  
      case '#3498DB': return '#2471A3'; // blue -> darker blue
      case '#E91E63': return '#AD1457'; // pink -> darker pink (not red!)
      case '#16A085': return '#138D75'; // teal -> darker teal
      case '#F1C40F': return '#B7950B'; // yellow -> darker yellow
      default: return '#2C3E50'; // default dark
    }
  };

  // Handle undefined, null, or empty arrays - ALL should show "Unassigned"
  if (!developers || developers.length === 0) {
    return (
      <div 
        className={`h-14 w-full flex items-center justify-center bg-gray-50 text-gray-400
          ${!isReadOnly ? 'cursor-pointer hover:bg-gray-100' : ''}`}
        onClick={!isReadOnly ? onClick : undefined}
        style={{height: '56px'}}
      >
        <span className="text-xs sm:text-sm font-bold">Unassigned</span>
      </div>
    );
  }

  return (
    <div 
      className={`flex h-14 ${!isReadOnly ? 'cursor-pointer' : ''}`}
      onClick={!isReadOnly ? onClick : undefined}
      style={{height: '56px'}}
    >
      {developers.map((dev, index) => {
        const member = memberMap.get(dev);
        const width = `${100 / developers.length}%`;
        
        return (
          <div
            key={dev}
            className={`h-full flex items-center justify-center ${
              index < developers.length - 1 ? 'border-r border-gray-200' : ''
            }`}
            style={{ 
              width,
              backgroundColor: `${member?.color}15`
            }}
          >
            {/* Desktop view (> 640px) - Show full names for 1-2 devs, initials for 3-4 */}
            <span 
              className="hidden sm:block text-xs md:text-sm font-bold"
              style={{ color: getTextColor(member?.color || '#2C3E50') }}
            >
              {developers.length <= 2 ? dev : getInitials(dev)}
            </span>

            {/* Mobile view (≤ 640px) - Always show initials */}
            <span 
              className="block sm:hidden text-2xs md:text-xs font-bold"
              style={{ color: getTextColor(member?.color || '#2C3E50') }}
            >
              {getInitials(dev)}
            </span>
          </div>
        );
      })}
    </div>
  );
} 