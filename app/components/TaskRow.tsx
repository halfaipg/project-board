'use client';

import React, { useState, useEffect } from 'react';
import { Task, Status, Priority } from '../types/board';
import CommentThread, { Comment } from './CommentThread';
import { createPortal } from 'react-dom';
import DeveloperSelector from './DeveloperSelector';
import DeveloperDisplay from './DeveloperDisplay';

interface TaskRowProps {
  task: Task;
  comments: Comment[];
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  onAddComment?: (taskId: string, text: string) => void;
  onDeleteTask?: (taskId: string) => void;
  isReadOnly?: boolean;
}

const statusColorMap: Record<string, string> = {
  'Done': 'bg-green-100 text-green-800',
  'Working on it': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Upcoming': 'bg-orange-100 text-orange-800',
  'Stuck': 'bg-red-100 text-red-800',
  'Pending': 'bg-purple-100 text-purple-800',
  '': 'bg-gray-50 text-gray-400',
};

const priorityColorMap: Record<string, string> = {
  'High': 'bg-red-100 text-red-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'Low': 'bg-blue-100 text-blue-800',
  '': 'bg-gray-50 text-gray-400',
};

const statusOptions = ['Done', 'Working on it', 'In Progress', 'Upcoming', 'Stuck', 'Pending'];
const priorityOptions = ['High', 'Medium', 'Low'];

export default function TaskRow({ 
  task, 
  comments = [], 
  onUpdateTask = () => {}, 
  onAddComment = () => {},
  onDeleteTask = () => {},
  isReadOnly = false
}: TaskRowProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [showComments, setShowComments] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);
  const [isDeveloperSelectorOpen, setIsDeveloperSelectorOpen] = useState(false);
  
  // Check if this is a shared view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsSharedView(params.has('v'));
    }
  }, []);
  
  const isDone = task.status === 'Done';
  
  const getStatusColor = (status: Status) => {
    if (status === 'Done') return 'bg-green-100 text-green-800';
    return statusColorMap[status] || 'bg-gray-50 text-gray-400';
  };

  const getPriorityColor = (priority?: Priority) => {
    if (task.status === 'Done') return 'bg-green-100 text-green-800';
    if (!priority) return 'bg-gray-50 text-gray-400';
    return priorityColorMap[priority] || 'bg-gray-50 text-gray-400';
  };
  
  const handleNameEdit = () => {
    if (editedName.trim() !== '') {
      onUpdateTask(task.id, { name: editedName });
      setIsEditingName(false);
    }
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Status;
    onUpdateTask(task.id, { status: newStatus });
  };
  
  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriority = e.target.value as Priority;
    onUpdateTask(task.id, { priority: newPriority });
  };

  const handleDeveloperChange = (developers: string[]) => {
    onUpdateTask(task.id, { assignees: developers });
    setIsDeveloperSelectorOpen(false);
  };

  const handleDeleteTask = () => {
    if (window.confirm(`Are you sure you want to delete "${task.name}"?`)) {
      onDeleteTask(task.id);
    }
  };

  const taskComments = comments.filter(comment => comment.taskId === task.id);
  const hasComments = taskComments.length > 0;

  return (
    <>
      <tr className="h-14" style={{height: '56px'}}>
        <td className="border-2 border-gray-200 pl-1 pr-1 md:pl-6 md:pr-6">
          <div className="flex items-center h-full">
            {isEditingName ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameEdit();
                  if (e.key === 'Escape') setIsEditingName(false);
                }}
                className="border rounded px-1 sm:px-2 py-1 w-full text-gray-900"
                autoFocus
              />
            ) : (
              <div className="flex items-center justify-between w-full">
                <div 
                  className={`text-xs md:text-sm pl-1 md:pl-3 pr-0 md:pr-6 text-gray-900 font-medium truncate ${isReadOnly && !isSharedView ? '' : 'cursor-pointer hover:text-blue-600'}`}
                  onClick={isReadOnly && !isSharedView ? undefined : () => setIsEditingName(true)}
                >
                  {task.name}
                </div>
                
                <div className="flex items-center space-x-0 sm:space-x-1 ml-1">
                  <button 
                    onClick={() => setShowComments(!showComments)}
                    className={`${hasComments ? 'text-blue-500' : 'text-gray-400'} hover:text-blue-600 relative`}
                  >
                    {hasComments && (
                      <span className="absolute -top-2 -left-3 bg-blue-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                        {taskComments.length}
                      </span>
                    )}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </button>
                  
                  {!isReadOnly && (
                    <button 
                      onClick={handleDeleteTask}
                      className="text-red-400 hover:text-red-600"
                      title="Delete task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </td>
        <td className="border-2 border-gray-200 p-0">
          <DeveloperDisplay
            developers={task.assignees}
            onClick={() => !isReadOnly && setIsDeveloperSelectorOpen(true)}
            isReadOnly={isReadOnly}
          />
        </td>
        <td className="border-2 border-gray-200 p-0" style={{overflow: 'hidden'}}>
          <div className={`h-14 ${getStatusColor(task.status)} flex items-center justify-center`} style={{height: '56px'}}>
            {isReadOnly ? (
              <span className="text-xs md:text-sm font-bold">
                {task.status || 'Not set'}
              </span>
            ) : (
              <select
                value={task.status || ''}
                onChange={handleStatusChange}
                className={`w-full h-4/5 text-xs md:text-sm font-bold cursor-pointer border-0 text-center appearance-none bg-transparent ${
                  task.status ? '' : 'text-gray-400'
                }`}
              >
                <option value="" disabled className="text-gray-400">{task.name}</option>
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
          </div>
        </td>
        <td className="border-2 border-gray-200 p-0 hidden md:table-cell" style={{overflow: 'hidden'}}>
          <div className={`h-14 ${getPriorityColor(task.priority)} flex items-center justify-center`} style={{height: '56px'}}>
            {isReadOnly ? (
              <span className="text-xs md:text-sm font-bold">
                {task.priority || 'Not set'}
              </span>
            ) : (
              <select
                value={task.priority || ''}
                onChange={handlePriorityChange}
                className={`w-full h-4/5 text-xs md:text-sm font-bold cursor-pointer border-0 text-center appearance-none bg-transparent ${
                  task.priority ? '' : 'text-gray-400'
                }`}
              >
                <option value="" disabled className="text-gray-400">{task.name}</option>
                {priorityOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
          </div>
        </td>
      </tr>
      
      {showComments && (
        <CommentThreadPortal
          taskId={task.id}
          taskName={task.name}
          comments={taskComments}
          onAddComment={onAddComment}
          onClose={() => setShowComments(false)}
        />
      )}
      <DeveloperSelectorPortal
        selectedDevelopers={task.assignees || []}
        onSelectionChange={handleDeveloperChange}
        isOpen={isDeveloperSelectorOpen}
        onClose={() => setIsDeveloperSelectorOpen(false)}
      />
    </>
  );
}

// Create a portal component to render the CommentThread outside the tbody
function CommentThreadPortal(props: React.ComponentProps<typeof CommentThread>) {
  // Only run on client side
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  return mounted ? createPortal(
    <CommentThread {...props} />,
    document.body
  ) : null;
}

// Create a portal component to render the DeveloperSelector outside the tbody
function DeveloperSelectorPortal(props: React.ComponentProps<typeof DeveloperSelector>) {
  // Only run on client side
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  return mounted ? createPortal(
    <DeveloperSelector {...props} />,
    document.body
  ) : null;
} 