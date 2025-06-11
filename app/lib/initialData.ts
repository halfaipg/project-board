// Initial data for the project board - server and client compatible
export interface TeamMember {
  name: string;
  color: string;
}

export interface Task {
  id: string;
  name: string;
  assignees: string[];  // Changed from person to assignees array
  status: string;
  priority?: string;
}

export interface Section {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Comment {
  id: string;
  taskId: string;
  author: string;
  text: string;
  createdAt: string;
}

// Helper function to get initials from a name
export function getInitials(name: string): string {
  return name.split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

// Helper function to parse CSV string into array of objects
function parseCSV(csv: string): string[] {
  return csv.split(',').map(name => name.trim()).filter(Boolean);
}

// Helper function to get team members from environment variable
export function getTeamMembers(): TeamMember[] {
  const defaultNames = 'Alex,Sarah,Michael,Emma';

  const namesCSV = process.env.NEXT_PUBLIC_TEAM_MEMBERS_CSV || defaultNames;
  const names = parseCSV(namesCSV);
  
  return names.map(name => ({
    name,
    color: generateColorFromName(name)
  }));
}

// Track assigned colors to prevent duplicates
const assignedColors = new Map<string, string>();

// Generate a consistent color based on name
function generateColorFromName(name: string): string {
  // If we already assigned a color to this name, return it
  if (assignedColors.has(name)) {
    return assignedColors.get(name)!;
  }

  const colors = [
    '#9B59B6', // purple
    '#2ECC71', // green
    '#3498DB', // blue
    '#E91E63', // pink
    '#16A085', // teal
    '#F1C40F', // yellow
  ];
  
  // Find the first color not already assigned
  for (const color of colors) {
    if (!Array.from(assignedColors.values()).includes(color)) {
      assignedColors.set(name, color);
      return color;
    }
  }
  
  // If all colors are used, fall back to hash (shouldn't happen with 6 colors for typical teams)
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const fallbackColor = colors[Math.abs(hash) % colors.length];
  assignedColors.set(name, fallbackColor);
  return fallbackColor;
}

// Helper function to create sections from environment variable
function createSectionsFromEnv(): Section[] {
  const sectionNames = (process.env.NEXT_PUBLIC_PROJECT_SECTIONS || 'Proof of Concept,Development,Hyper Care').split(',');
  
  return sectionNames.map((title, index) => ({
    id: `section${index + 1}`,
    title: title.trim(),
    tasks: index === 0 ? [
      {
        id: 'task1',
        name: 'Initial Infrastructure Setup',
        assignees: ['Alex'],
        status: 'In Progress',
        priority: 'High'
      },
      {
        id: 'task2',
        name: 'Authentication System',
        assignees: ['Sarah'],
        status: 'To Do',
        priority: 'Medium'
      }
    ] : index === 1 ? [
      {
        id: 'task3',
        name: 'ML Pipeline Deployment',
        assignees: ['Michael'],
        status: 'In Progress',
        priority: 'High'
      },
      {
        id: 'task4',
        name: 'Database Optimization',
        assignees: ['Emma'],
        status: 'Done',
        priority: 'Medium'
      }
    ] : []
  }));
}

export const initialSections = createSectionsFromEnv();

export const initialComments = [
  {
    id: 'comment1',
    taskId: 'task1',
    author: 'Alex',
    text: 'Cloud infrastructure setup complete. All environments are running smoothly.',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'comment2',
    taskId: 'task2',
    author: 'Sarah',
    text: 'Authentication system implementation in progress. Testing OAuth integration.',
    createdAt: new Date(Date.now() - 43200000).toISOString()
  },
  {
    id: 'comment3',
    taskId: 'task6',
    author: 'Sarah',
    text: 'Data import/export API endpoints created. Working on UI components.',
    createdAt: new Date(Date.now() - 21600000).toISOString()
  },
  {
    id: 'comment4',
    taskId: 'task8',
    author: 'Emma',
    text: 'Basic reporting functionality implemented. Adding export options.',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];