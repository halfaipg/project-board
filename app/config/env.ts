export interface ProjectConfig {
  title: string;
  logo: string;
  username: string;
  password: string;
  sections: string[];
}

const defaultConfig: ProjectConfig = {
  title: 'Project Board',
  logo: '/logo.svg',
  username: 'demo',
  password: 'demo',
  sections: ['Planning', 'In Progress', 'Review', 'Complete']
};

export function getProjectConfig(): ProjectConfig {
  if (typeof window === 'undefined') {
    // Server-side
    return {
      title: process.env.PROJECT_TITLE || defaultConfig.title,
      logo: process.env.PROJECT_LOGO || defaultConfig.logo,
      username: process.env.PROJECT_USERNAME || defaultConfig.username,
      password: process.env.PROJECT_PASSWORD || defaultConfig.password,
      sections: (process.env.PROJECT_SECTIONS || '').split(',').filter(Boolean).length > 0
        ? (process.env.PROJECT_SECTIONS || '').split(',').map(s => s.trim())
        : defaultConfig.sections
    };
  } else {
    // Client-side
    return {
      title: process.env.NEXT_PUBLIC_PROJECT_TITLE || defaultConfig.title,
      logo: process.env.NEXT_PUBLIC_PROJECT_LOGO || defaultConfig.logo,
      username: process.env.NEXT_PUBLIC_PROJECT_USERNAME || defaultConfig.username,
      password: process.env.NEXT_PUBLIC_PROJECT_PASSWORD || defaultConfig.password,
      sections: (process.env.NEXT_PUBLIC_PROJECT_SECTIONS || '').split(',').filter(Boolean).length > 0
        ? (process.env.NEXT_PUBLIC_PROJECT_SECTIONS || '').split(',').map(s => s.trim())
        : defaultConfig.sections
    };
  }
} 