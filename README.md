# Project Board

A modern, real-time collaborative project board application built with Next.js 15, featuring drag-and-drop task management and persistent data storage.

## One-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhalfaipg%2Fproject-board&project-name=project-board&repository-name=project-board&demo-title=Project%20Board&demo-description=A%20modern%20task%20management%20board%20for%20teams&demo-url=https%3A%2F%2Fproject-board-demo.vercel.app&integration-ids=oac_V3R1GIpkoJorr6fqynnuN&stores=%5B%7B%22type%22%3A%22kv%22%7D%5D&external-id=project-board)

The one-click deploy button above will:
1. Clone this repository to your GitHub account
2. Create a new Vercel project
3. **Automatically set up Vercel KV (powered by Upstash)** for data persistence
4. Deploy a fully-functioning version of the project board

## Live Demo

**[Try the Live Demo](https://project-board.generalconcepts.ai)** ✨

**Login Credentials:**
- Username: `demo`
- Password: `demo`

The demo runs in local mode with sample data. You can add tasks, assign team members, and test all features without any setup required.

## Customer View

Share your project board with clients and stakeholders in read-only mode:

**[View Customer Demo](https://project-board.generalconcepts.ai/?v=Q3VzdG9tZXI=)**

The customer view provides a clean, read-only interface where clients can:
- View task progress without the ability to modify data
- See team assignments and project status
- Participate by adding comments to tasks
- Access project information securely without login credentials

![Project Board Screenshot](project-board-ss.png)

## Features

- **Real-time Collaboration**: Share project boards with team members
- **Task Management**: Create, edit, and organize tasks
- **Team Assignment**: Assign tasks to team members with color-coded displays  
- **Status Tracking**: Move tasks through different project phases
- **Comments**: Add comments to tasks for better communication
- **Demo Mode**: Works out-of-the-box with sample data
- **Persistent Storage**: Vercel KV integration for data persistence
- **Responsive Design**: Works on desktop and mobile devices
- **Client View**: Share read-only boards with clients and stakeholders

## Quick Start

### Prerequisites

- Node.js 18.18.0 or higher
- npm, yarn, pnpm, or bun

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd project-board
   npm install
   ```

2. **Set up environment variables** (optional):
   ```bash
   cp .env.local.template .env.local
   # Edit .env.local with your preferred settings
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Configuration

### Environment Variables

Copy `.env.local.template` to `.env.local` and customize:

```bash
# Optional: Vercel KV Storage for persistence
KV_REST_API_URL=""
KV_REST_API_TOKEN=""

# Customize your project sections
NEXT_PUBLIC_PROJECT_SECTIONS="Proof of Concept,Development,Hyper Care"

# Customize team members
NEXT_PUBLIC_TEAM_MEMBERS_CSV="Alex,Sarah,Michael,Emma"
```

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Project Structure

```
project-board/
├── app/                 # Next.js 15 App Router
│   ├── components/      # React components
│   ├── types/          # TypeScript type definitions
│   ├── lib/            # Utility functions
│   └── api/            # API routes
├── public/             # Static assets
└── tailwind.config.js  # Tailwind CSS configuration
```

## Deployment

### Deploy to Vercel with Upstash KV

#### Option 1: One-Click Deploy (Recommended)
Use the [Deploy with Vercel button](#one-click-deployment) at the top of this README. This automatically sets up Vercel KV (powered by Upstash) for data persistence.

#### Option 2: Manual Deploy via Vercel Dashboard
1. **Fork this repository** to your GitHub account
2. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
3. **Click "New Project"** and import your forked repository
4. **Add Vercel KV Integration**:
   - In project settings, go to "Storage" tab
   - Click "Create Store" → "KV"
   - Name your store (e.g., "project-board-kv")
   - Click "Create and Connect"
5. **Deploy** - Your project will automatically have KV environment variables configured

#### Option 3: Manual Deploy via CLI
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   cd project-board
   vercel --prod
   ```

4. **Set up Vercel KV Storage**:
   ```bash
   # Create a new KV store
   vercel kv create project-board-kv
   
   # Link the store to your project (follow the prompts)
   vercel env pull .env.local
   ```

#### Option 4: Manual Upstash KV Setup (Any Platform)
If deploying to platforms other than Vercel, you can use Upstash directly:

1. **Create Upstash Account**:
   - Go to [Upstash Console](https://console.upstash.com/)
   - Sign up for a free account

2. **Create Redis Database**:
   - Click "Create Database"
   - Choose a name (e.g., "project-board")
   - Select region closest to your deployment
   - Choose "Free" tier

3. **Get Connection Details**:
   - Click on your database
   - Copy the "REST URL" and "REST Token"

4. **Set Environment Variables**:
   ```bash
   # Add to your .env.local or deployment platform
   KV_REST_API_URL="https://your-database-url.upstash.io"
   KV_REST_API_TOKEN="your-rest-token"
   ```

### Automatic Deployment (CI/CD)

#### GitHub Actions with Vercel
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci --legacy-peer-deps
        
      - name: Build project
        run: npm run build
        
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
        
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**Required GitHub Secrets**:
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel team/organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

#### Setup GitHub Secrets:
1. **Get Vercel Token**:
   ```bash
   vercel login
   # Go to https://vercel.com/account/tokens to create a token
   ```

2. **Get Project IDs**:
   ```bash
   cd project-board
   vercel link
   # Check .vercel/project.json for the IDs
   ```

3. **Add to GitHub**:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add the three secrets above

### Environment Variables for Production

Ensure these environment variables are set in your deployment:

```bash
# Required for Upstash KV (auto-set with Vercel KV)
KV_REST_API_URL="your-kv-rest-url"
KV_REST_API_TOKEN="your-kv-rest-token"

# Optional customization
NEXT_PUBLIC_PROJECT_SECTIONS="Proof of Concept,Development,Hyper Care"
NEXT_PUBLIC_TEAM_MEMBERS_CSV="Alex,Sarah,Michael,Emma"

# Optional: Analytics
VERCEL_ANALYTICS_ID="your-analytics-id"
```

### Other Deployment Platforms

The app can be deployed to any platform that supports Next.js:

#### Netlify
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add Upstash KV environment variables

#### Railway
1. Connect your GitHub repository
2. Add Upstash KV environment variables
3. Railway will auto-detect Next.js and deploy

#### Digital Ocean App Platform
1. Create new app from GitHub
2. Configure build settings for Next.js
3. Add Upstash KV environment variables

#### AWS Amplify
1. Connect your GitHub repository
2. Add build settings for Next.js
3. Add Upstash KV environment variables

### Troubleshooting Deployment

**Common Issues**:

1. **Build fails with dependency errors**:
   ```bash
   # Use legacy peer deps flag
   npm install --legacy-peer-deps
   ```

2. **KV connection issues**:
   - Verify `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set
   - Check Upstash dashboard for correct URLs
   - Ensure region compatibility

3. **App falls back to localStorage**:
   - This is expected behavior when KV is not configured
   - Check environment variables in deployment platform

## Usage

1. **Create Tasks**: Click "Add Task" to create new items
2. **Edit Tasks**: Click on tasks to edit details, priority, and due dates
3. **Assign Team Members**: Click the person cell to assign team members
4. **Collaborate**: Share the URL with team members for real-time collaboration

## Technical Details

- **Framework**: Next.js 15 with App Router
- **React**: React 19 with latest features
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Storage**: Vercel KV powered by Upstash (with localStorage fallback)
- **Performance**: Turbopack for fast development
- **Deployment**: Vercel (or any Next.js compatible platform)

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you have any questions or need help, please open an issue in the repository.
