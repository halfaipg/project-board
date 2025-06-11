import { kv } from '@vercel/kv';

// Check if KV is available (environment variables are set)
const isKVAvailable = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

// Unified KV operations to ensure all endpoints use the same connection
export const kvOperations = {
  async getSections() {
    try {
      if (!isKVAvailable()) {
        console.log('KV not configured, falling back to demo mode');
        return null; // Return null to trigger local fallback
      }
      
      const sections = await kv.get('board_sections');
      console.log('KV getSections result:', sections ? 'DATA_FOUND' : 'NULL');
      return sections;
    } catch (error) {
      console.error('KV getSections error:', error);
      return null;
    }
  },

  async getComments() {
    try {
      if (!isKVAvailable()) {
        console.log('KV not configured, falling back to demo mode');
        return null; // Return null to trigger local fallback
      }
      
      const comments = await kv.get('board_comments');
      console.log('KV getComments result:', comments ? 'DATA_FOUND' : 'NULL');
      return comments;
    } catch (error) {
      console.error('KV getComments error:', error);
      return null;
    }
  },

  async setSections(sections: any) {
    try {
      if (!isKVAvailable()) {
        console.log('KV not configured, skipping setSections (demo mode)');
        return true; // Pretend success in demo mode
      }
      
      await kv.set('board_sections', sections);
      console.log('KV setSections: SUCCESS');
      return true;
    } catch (error) {
      console.error('KV setSections error:', error);
      return false;
    }
  },

  async setComments(comments: any) {
    try {
      if (!isKVAvailable()) {
        console.log('KV not configured, skipping setComments (demo mode)');
        return true; // Pretend success in demo mode
      }
      
      await kv.set('board_comments', comments);
      console.log('KV setComments: SUCCESS');
      return true;
    } catch (error) {
      console.error('KV setComments error:', error);
      return false;
    }
  },

  async setBoth(sections: any, comments: any) {
    try {
      if (!isKVAvailable()) {
        console.log('KV not configured, skipping setBoth (demo mode)');
        return true; // Pretend success in demo mode
      }
      
      await Promise.all([
        kv.set('board_sections', sections),
        kv.set('board_comments', comments)
      ]);
      console.log('KV setBoth: SUCCESS');
      return true;
    } catch (error) {
      console.error('KV setBoth error:', error);
      return false;
    }
  },

  // Helper to check if we're in demo mode
  isDemo() {
    return !isKVAvailable();
  }
}; 