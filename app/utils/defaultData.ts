// Import types
interface Task {
  id: string;
  name: string;
  assignees: string[];
  status: string;
  priority?: string;
  dueDate?: string;
}

interface Section {
  id: string;
  title: string;
  tasks: Task[];
}

// Helper function to create sections from environment variable
function createSectionsFromEnv(): Section[] {
  const sectionNames = (process.env.NEXT_PUBLIC_PROJECT_SECTIONS || 'Proof of Concept,Development,Hyper Care').split(',');
  
  return sectionNames.map((title, index) => ({
    id: `section${index + 1}`,
    title: title.trim(),
    tasks: [] as Task[]  // Explicitly type as Task[]
  }));
}

// Default demo data for when KV is not available - using environment sections
export const getDefaultSections = (): Section[] => {
  const envSections = createSectionsFromEnv();
  
  // Add some demo tasks to the first section - mix of assigned and unassigned
  if (envSections[0]) {
    envSections[0].tasks = [
      {
        id: '1',
        name: 'Research competitors',
        assignees: ['Alex'],
        status: 'In Progress',
        priority: 'High',
        dueDate: '2024-03-20'
      },
      {
        id: '2',
        name: 'Design system',
        assignees: [], // UNASSIGNED - should show "Unassigned"
        status: 'Upcoming',
        priority: 'Medium'
      },
      {
        id: '5',
        name: 'Write documentation',
        assignees: [], // UNASSIGNED - should show "Unassigned"
        status: 'Pending',
        priority: 'Low'
      },
      {
        id: '7',
        name: 'User testing',
        assignees: [], // UNASSIGNED - should show "Unassigned"
        status: 'Upcoming',
        priority: 'Medium'
      }
    ];
  }
  
  // Add demo tasks to second section if it exists
  if (envSections[1]) {
    envSections[1].tasks = [
      {
        id: '3',
        name: 'Implement authentication',
        assignees: ['Sarah'],
        status: 'Working on it',
        priority: 'High'
      },
      {
        id: '6',
        name: 'Database setup',
        assignees: [], // UNASSIGNED - should show "Unassigned"
        status: 'Upcoming',
        priority: 'High'
      },
      {
        id: '8',
        name: 'API endpoints',
        assignees: [], // UNASSIGNED - should show "Unassigned"
        status: 'Pending',
        priority: 'Medium'
      }
    ];
  }
  
  // Add demo tasks to third section if it exists  
  if (envSections[2]) {
    envSections[2].tasks = [
      {
        id: '4',
        name: 'Set up project',
        assignees: ['Alex', 'Sarah'],
        status: 'Done',
        priority: 'High'
      },
      {
        id: '9',
        name: 'Deploy infrastructure',
        assignees: [], // UNASSIGNED - should show "Unassigned"
        status: 'Done',
        priority: 'Medium'
      }
    ];
  }
  
  return envSections;
};

export const defaultComments = [
  {
    id: '1',
    taskId: '1',
    author: 'Alex',
    text: 'This is a demo comment in the project board!',
    createdAt: new Date().toISOString()
  }
]; 