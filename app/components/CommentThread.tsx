'use client';

import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';

export interface Comment {
  id: string;
  taskId: string;
  author: string;
  text: string;
  createdAt: Date | string;
}

interface CommentThreadProps {
  taskId: string;
  taskName: string;
  comments: Comment[];
  onAddComment: (taskId: string, text: string) => void;
  onClose: () => void;
}

export default function CommentThread({ 
  taskId, 
  taskName, 
  comments, 
  onAddComment, 
  onClose 
}: CommentThreadProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(taskId, newComment);
      setNewComment('');
    }
  };

  // Function to format date safely
  const formatDate = (dateInput: Date | string) => {
    try {
      if (typeof dateInput === 'string') {
        return format(parseISO(dateInput), 'MM/dd/yyyy');
      } else if (dateInput instanceof Date) {
        return format(dateInput, 'MM/dd/yyyy');
      } 
      return 'Invalid date';
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };

  // Function to format time safely
  const formatTime = (dateInput: Date | string) => {
    try {
      if (typeof dateInput === 'string') {
        return format(parseISO(dateInput), 'h:mm a');
      } else if (dateInput instanceof Date) {
        return format(dateInput, 'h:mm a');
      }
      return '';
    } catch (error) {
      console.error("Error formatting time:", error);
      return '';
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 px-3 py-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col border border-gray-100">
        <div className="flex items-center justify-between p-3 md:p-4 border-b">
          <h3 className="text-base md:text-lg font-medium text-gray-900 truncate">
            {taskName}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 ml-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-3 md:p-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No comments yet</p>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-xs md:text-sm text-gray-900">{comment.author}</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)} {formatTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-700 pr-4">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="border-t p-3 md:p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Comment"
              className="flex-grow border border-gray-200 rounded-lg py-2 px-3 md:py-2.5 md:px-4 text-xs md:text-sm text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-medium py-2 px-3 md:py-2.5 md:px-6 rounded-lg shadow-sm transition-colors duration-200 flex-shrink-0"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 