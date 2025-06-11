'use client';

import React, { useState, useEffect } from 'react';
import TaskRow from './TaskRow';
import { Task, Section, Comment, initialSections as defaultSections, initialComments as defaultComments } from '../lib/initialData';

interface ProjectTableViewProps {
  isReadOnly?: boolean;
  currentUser?: string;
}

// Helper function to create sections from environment variable
function createSectionsFromEnv(): Section[] {
  const sectionNames = (process.env.NEXT_PUBLIC_PROJECT_SECTIONS || 'Proof of Concept,Development,Hyper Care').split(',');
  
  return sectionNames.map((title, index) => ({
    id: `section${index + 1}`,
    title: title.trim(),
    tasks: []
  }));
}

// Add this utility function at the top of the file (after imports)
// This ensures undefined values are converted to null before JSON.stringify
function sanitizeForJSON(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForJSON(item));
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      // Replace undefined with null, which is valid JSON
      result[key] = obj[key] === undefined ? null : sanitizeForJSON(obj[key]);
    }
    return result;
  }
  
  return obj;
}

export default function ProjectTableView({ 
  isReadOnly: initialIsReadOnly = false,
  currentUser = 'Anonymous User'
}: ProjectTableViewProps) {
  console.log('🎬 ProjectTableView component is loading!', { initialIsReadOnly, currentUser });
  
  // Track if we've loaded initial data to prevent overwriting on first load
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
  
  // Initialize state from API with localStorage fallback - with safe JSON parsing
  const [sections, setSections] = useState<Section[]>(() => {
    console.log('🏗️ Initializing sections state...');
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('project_sections');
        console.log('🏗️ localStorage project_sections:', saved ? 'EXISTS' : 'NULL');
        // Only parse if saved is not null or undefined
        if (saved) {
          const parsedSections = JSON.parse(saved);
          // Check if we need to update section titles from env
          const envSections = createSectionsFromEnv();
          return parsedSections.map((section: Section, index: number) => ({
            ...section,
            title: envSections[index]?.title || section.title
          }));
        }
        return defaultSections;
      } catch (error) {
        console.error('Error parsing stored sections:', error);
        // Clear the corrupted data
        localStorage.removeItem('project_sections');
        return defaultSections;
      }
    }
    return defaultSections;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    console.log('🏗️ Initializing comments state...');
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('project_comments');
        console.log('🏗️ localStorage project_comments:', saved ? 'EXISTS' : 'NULL');
        // Only parse if saved is not null or undefined
        return saved ? JSON.parse(saved) : defaultComments;
      } catch (error) {
        console.error('Error parsing stored comments:', error);
        // Clear the corrupted data
        localStorage.removeItem('project_comments');
        return defaultComments;
      }
    }
    return defaultComments;
  });
  
  // Add loading state
  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly] = useState(initialIsReadOnly);
  const [isSharedView, setIsSharedView] = useState(false);
  
  // Check if KV is configured
  const [isUsingKV] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!(process.env.NEXT_PUBLIC_KV_REST_API_URL && 
                process.env.NEXT_PUBLIC_KV_REST_API_TOKEN);
    }
    return false;
  });
  
  // Add demo mode state
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      console.log('🎯 FETCHDATA CALLED - useEffect running');
      
      try {
        setIsLoading(true);
        
        // First check if we have localStorage data - if so, use it and skip API
        const savedSections = localStorage.getItem('project_sections');
        const savedComments = localStorage.getItem('project_comments');
        
        if (savedSections && savedComments) {
          console.log('📦 Using saved localStorage data instead of API');
          try {
            const parsedSections = JSON.parse(savedSections);
            const parsedComments = JSON.parse(savedComments);
            setSections(parsedSections);
            setComments(parsedComments);
            setIsDemoMode(true); // Assume demo mode for localStorage
            setHasLoadedInitialData(true);
            setIsLoading(false);
            return; // Exit early, don't fetch from API
          } catch (error) {
            console.warn('❌ Failed to parse localStorage data, falling back to API');
            // Clear corrupted localStorage
            localStorage.removeItem('project_sections');
            localStorage.removeItem('project_comments');
          }
        }
        
        console.log('📡 No localStorage data, fetching from API');
        const response = await fetch('/api/force-sync', {
          method: 'POST'
        });
        console.log('📡 API Response status:', response.status);
        
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        console.log('📡 API Response data:', data);
        
        // Check if we're in demo mode
        setIsDemoMode(data.source === 'DEMO_MODE' || data.source === 'ERROR_FALLBACK');
        
        // Validate data structure before updating state
        if (data.sections && Array.isArray(data.sections)) {
          console.log('✅ Valid sections data received, setting initial state');
          setSections(data.sections);
          // Only save to localStorage on first load (no existing data)
          localStorage.setItem('project_sections', JSON.stringify(sanitizeForJSON(data.sections)));
        } else {
          console.warn('❌ Received invalid sections data from API, using fallback');
          setSections(defaultSections);
          localStorage.setItem('project_sections', JSON.stringify(sanitizeForJSON(defaultSections)));
        }
        
        if (data.comments && Array.isArray(data.comments)) {
          console.log('✅ Valid comments data received, setting initial state');
          setComments(data.comments);
          // Only save to localStorage on first load (no existing data)
          localStorage.setItem('project_comments', JSON.stringify(sanitizeForJSON(data.comments)));
        } else {
          console.warn('❌ Received invalid comments data from API, using fallback');
          setComments(defaultComments);
          localStorage.setItem('project_comments', JSON.stringify(sanitizeForJSON(defaultComments)));
        }
        
        // Mark that we've loaded initial data to prevent immediate update
        setHasLoadedInitialData(true);
        
      } catch (error) {
        console.error('❌ Error fetching board data:', error);
        // Fall back to localStorage if API fails
        setHasLoadedInitialData(true); // Still mark as loaded to prevent update loop
        setIsDemoMode(true); // Assume demo mode if API fails
      } finally {
        setIsLoading(false);
        console.log('🏁 Fetch completed, isLoading set to false');
      }
    };
    
    console.log('🎯 useEffect triggered, calling fetchData');
    fetchData();
  }, []);
  
  // Check if this is a shared view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsSharedView(params.has('v'));
    }
  }, []);
  
  // Save to API and localStorage whenever state changes
  useEffect(() => {
    const updateData = async () => {
      console.log('💾 UPDATE DATA CALLED - sections or comments changed');
      
      // Only update if we've loaded initial data and this is from user action
      if (!hasLoadedInitialData) {
        console.log('💾 Skipping update - initial data not loaded yet');
        return;
      }
      
      try {
        // Sanitize data before storing to prevent undefined issues
        const sanitizedSections = sanitizeForJSON(sections);
        const sanitizedComments = sanitizeForJSON(comments);
        
        console.log('💾 Sanitized data:', { sectionsCount: sanitizedSections.length, commentsCount: sanitizedComments.length });
        
        // Update localStorage immediately for responsive UI
        localStorage.setItem('project_sections', JSON.stringify(sanitizedSections));
        localStorage.setItem('project_comments', JSON.stringify(sanitizedComments));
        console.log('💾 Updated localStorage with user changes');
        
        // Then update the API
        console.log('💾 Making API call to update data...');
        const response = await fetch('/api/board/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            sections: sanitizedSections, 
            comments: sanitizedComments 
          }),
        });
        
        const result = await response.json();
        console.log('💾 API Update response:', result);
        
      } catch (error) {
        console.error('❌ Error updating board data:', error);
      }
    };
    
    updateData();
    
  }, [sections, comments, hasLoadedInitialData]);
  
  // Shared function to update API and localStorage
  const updateDataToAPI = async (sectionsData: Section[], commentsData: Comment[]) => {
    try {
      // Sanitize data before storing to prevent undefined issues
      const sanitizedSections = sanitizeForJSON(sectionsData);
      const sanitizedComments = sanitizeForJSON(commentsData);
      
      console.log('💾 Manual update triggered:', { sectionsCount: sanitizedSections.length, commentsCount: sanitizedComments.length });
      
      // Update localStorage immediately for responsive UI
      localStorage.setItem('project_sections', JSON.stringify(sanitizedSections));
      localStorage.setItem('project_comments', JSON.stringify(sanitizedComments));
      console.log('💾 Updated localStorage');
      
      // Then update the API
      console.log('💾 Making API call to update data...');
      const response = await fetch('/api/board/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          sections: sanitizedSections, 
          comments: sanitizedComments 
        }),
      });
      
      const result = await response.json();
      console.log('💾 API Update response:', result);
      
    } catch (error) {
      console.error('❌ Error updating board data:', error);
    }
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    if (isReadOnly) return;
    setSections(prevSections => 
      prevSections.map(section => ({
        ...section,
        tasks: section.tasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      }))
    );
  };
  
  const handleAddComment = (taskId: string, text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      taskId,
      author: currentUser,
      text,
      createdAt: new Date().toISOString()
    };
    
    setComments(prevComments => [...prevComments, newComment]);
  };
  
  const handleAddTask = (sectionId: string) => {
    if (isReadOnly) return;
    setSections(prevSections => 
      prevSections.map(section => {
        if (section.id === sectionId) {
          const newTask: Task = {
            id: Date.now().toString(),
            name: 'New Task',
            assignees: [],
            status: 'To Do'
          };
          return {
            ...section,
            tasks: [...section.tasks, newTask]
          };
        }
        return section;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    if (isReadOnly) return;
    setSections(prevSections =>
      prevSections.map(section => ({
        ...section,
        tasks: section.tasks.filter(task => task.id !== taskId)
      }))
    );
    // Also remove associated comments
    setComments(prevComments => 
      prevComments.filter(comment => comment.taskId !== taskId)
    );
  };
  
  const resetToDefaults = () => {
    if (isReadOnly) return;
    if (window.confirm('This will reset all tasks and comments to default values. Continue?')) {
      setSections(defaultSections);
      setComments(defaultComments);
      localStorage.removeItem('project_sections');
      localStorage.removeItem('project_comments');
    }
  };

  return (
    <div className="p-0 sm:p-4 max-w-full mx-auto overflow-x-auto" suppressHydrationWarning>
      <div className="flex justify-between items-center mb-4 sm:mb-6 px-2 sm:px-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Project Tasks</h2>
          {isSharedView ? (
            <p className="text-sm text-gray-500 mt-1">You can view tasks and add comments, but cannot modify task details</p>
          ) : (
            <p className="text-sm text-gray-500 mt-1">Manage and track project tasks</p>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {sections.map(section => (
            <div key={section.id} className="mb-8 sm:mb-10">
              <div className="flex items-center mb-2 sm:mb-3 px-2">
                <h2 className="text-lg font-medium text-blue-600">{section.title}</h2>
              </div>
              <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
                <table className="min-w-full border-collapse table-fixed border-spacing-0">
                  <thead>
                    <tr className="h-12 sm:h-14" style={{height: '56px'}}>
                      <th scope="col" className="border-2 border-gray-200 bg-gray-50" style={{width: '40%', padding: '0'}}>
                        <div className="h-full flex items-center pl-2 sm:pl-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Task Name</div>
                      </th>
                      <th scope="col" className="border-2 border-gray-200 bg-gray-50" style={{width: '20%', padding: '0'}}>
                        <div className="h-full flex items-center justify-center text-xs font-bold text-gray-600 uppercase tracking-wider">Person</div>
                      </th>
                      <th scope="col" className="border-2 border-gray-200 bg-gray-50" style={{width: '20%', padding: '0'}}>
                        <div className="h-full flex items-center justify-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</div>
                      </th>
                      <th scope="col" className="border-2 border-gray-200 bg-gray-50 hidden md:table-cell" style={{width: '20%', padding: '0'}}>
                        <div className="h-full flex items-center justify-center text-xs font-bold text-gray-600 uppercase tracking-wider">Priority</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {section.tasks.map(task => (
                      <TaskRow 
                        key={task.id} 
                        task={task} 
                        comments={comments.filter(c => c.taskId === task.id)}
                        onUpdateTask={handleUpdateTask}
                        onAddComment={handleAddComment}
                        onDeleteTask={handleDeleteTask}
                        isReadOnly={isReadOnly}
                      />
                    ))}
                    {!isReadOnly && (
                      <tr className="h-12" style={{height: '48px'}}>
                        <td colSpan={4} className="border-2 border-gray-200 p-0">
                          <div className="h-12 flex items-center pl-2 sm:pl-6" style={{height: '48px'}}>
                            <button 
                              className="text-gray-500 hover:text-gray-700 text-sm"
                              onClick={() => handleAddTask(section.id)}
                            >
                              + Add Item
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          
          {/* Demo Mode Banner - moved to bottom with reset button */}
          {isDemoMode && (
            <div className="mt-8 p-2 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm mx-1 sm:mx-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      🎭 Demo Mode Active
                    </h3>
                    <p className="mt-1 text-xs text-blue-700">
                      Running with local data only. Add Vercel KV environment variables for persistence across sessions.
                    </p>
                  </div>
                </div>
                {!isReadOnly && (
                  <button
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                        try {
                          const response = await fetch('/api/reset');
                          if (response.ok) {
                            // Clear localStorage
                            localStorage.removeItem('project_sections');
                            localStorage.removeItem('project_comments');
                            // Reload the page to fetch fresh data
                            window.location.reload();
                          } else {
                            alert('Error resetting data. Please try again.');
                          }
                        } catch (error) {
                          console.error('Reset error:', error);
                          alert('Error resetting data. Please try again.');
                        }
                      }
                    }}
                    className="ml-2 sm:ml-4 px-2 sm:px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 