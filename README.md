# Project Board

A modern, real-time collaborative project board application built with Next.js 15, featuring drag-and-drop task management and persistent data storage.

## One-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhalfaipg%2Fproject-board&project-name=project-board&repository-name=project-board&demo-title=Project%20Board&demo-description=A%20modern%20task%20management%20board%20for%20teams&demo-url=https%3A%2F%2Fproject-board-demo.vercel.app&integration-ids=oac_V3R1GIpkoJorr6fqynnuN&external-id=project-board)

The one-click deploy button above will:
1. Clone this repository to your GitHub account
2. Create a new Vercel project
3. **Automatically set up Vercel KV (powered by Upstash)** for data persistence
4. Deploy a fully-functioning version of the project board

## 🚀 Live Demo

**[Try the Live Demo](https://project-board-demo-hpol90n2u-ai-power-grids-projects.vercel.app)** ✨

The demo runs in local mode with sample data. You can add tasks, assign team members, and test all features without any setup required.

## 🚀 Features

- **Real-time Collaboration**: Share project boards with team members
- **Task Management**: Create, edit, and organize tasks
- **Team Assignment**: Assign tasks to team members with color-coded displays  
- **Status Tracking**: Move tasks through different project phases
- **Comments**: Add comments to tasks for better communication
- **Demo Mode**: Works out-of-the-box with sample data
- **Persistent Storage**: Vercel KV integration for data persistence
- **Responsive Design**: Works on desktop and mobile devices

##  Quick Start

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

## 🛠️ Configuration

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

## 🛠️ Development

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

## 🚀 Deployment

### Deploy to Vercel

#### Option 1: One-Click Deploy (Recommended)
Use the [Deploy with Vercel button](#one-click-deployment) at the top of this README.

#### Option 2: Manual Deploy
1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from project directory**:
   ```bash
   cd project-board
   vercel --prod
   ```

3. **Set up Vercel KV Storage** (for persistence):
   ```bash
   # Add KV storage to your project
   vercel kv create
   
   # The environment variables will be automatically added to your project
   ```

### Other Deployment Options

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Digital Ocean App Platform
- AWS Amplify

## 🎮 Usage

1. **Create Tasks**: Click "Add Task" to create new items
2. **Edit Tasks**: Click on tasks to edit details, priority, and due dates
3. **Assign Team Members**: Click the person cell to assign team members
4. **Collaborate**: Share the URL with team members for real-time collaboration

## 🛡️ Technical Details

- **Framework**: Next.js 15 with App Router
- **React**: React 19 with latest features
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Storage**: Vercel KV powered by Upstash (with localStorage fallback)
- **Performance**: Turbopack for fast development
- **Deployment**: Vercel (or any Next.js compatible platform)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

If you have any questions or need help, please open an issue in the repository.
