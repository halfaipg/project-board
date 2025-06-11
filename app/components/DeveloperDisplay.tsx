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
        <span className="text-sm font-bold">Unassigned</span>
      </div>
    );
  }

  return (
    <div 
      className={`flex h-14 ${!isReadOnly ? 'cursor-pointer' : ''}`}
      onClick={!isReadOnly ? onClick : undefined}
      style={{height: '56px'}}
    >
      {developers.length <= 3 ? (
        // Show each developer in equal width sections when we have 1-3 developers
        developers.map((dev, index) => {
          const member = memberMap.get(dev);
          const width = `${100 / developers.length}%`;
          const initials = getInitials(dev);
          
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
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ 
                  backgroundColor: member?.color || '#CBD5E0',
                  color: 'white'
                }}
              >
                {initials}
              </div>
            </div>
          );
        })
      ) : (
        // Show avatars in a compact overlapping layout when we have more than 3 developers
        <div className="h-full w-full flex items-center justify-center">
          <div className="flex -space-x-2">
            {developers.slice(0, 3).map((dev, index) => {
              const member = memberMap.get(dev);
              const initials = getInitials(dev);
              
              return (
                <div 
                  key={dev}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ring-2 ring-white"
                  style={{ 
                    backgroundColor: member?.color || '#CBD5E0',
                    color: 'white',
                    zIndex: developers.length - index
                  }}
                >
                  {initials}
                </div>
              );
            })}
            
            {developers.length > 3 && (
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-gray-400 text-white ring-2 ring-white"
                style={{ zIndex: 0 }}
              >
                +{developers.length - 3}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 