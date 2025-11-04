# Minecraft Server Status

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

A modern, production-ready Next.js application for checking Minecraft server status with comprehensive MOTD editing capabilities, built with TypeScript, Tailwind CSS, and shadcn/ui components.

## Key Features

### Core Functionality
- **Server Status Checking**: Real-time Minecraft server monitoring with player counts, versions, and performance metrics
- **MOTD Editor**: Advanced Message of the Day editor with color codes, gradients, and professional templates
- **Multi-Platform Support**: Java and Bedrock edition server compatibility
- **Export Capabilities**: Multiple format support (Vanilla, Spigot, BungeeCord, ServerListPlus)

### Security & Performance
- **Rate Limiting**: Dual-layer protection with IP-based and hostname-based restrictions
- **CAPTCHA Integration**: Optional Cloudflare Turnstile protection
- **Optimized Performance**: Fast page loads with Next.js 14 App Router and optimized bundles
- **Cooldown System**: Client-side tracking with real-time countdown indicators

### User Experience
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Mode Support**: Complete theme system with next-themes
- **Smooth Animations**: Framer Motion-powered transitions and micro-interactions
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Professional UI**: shadcn/ui components with custom styling and branding

## Technology Stack

| Category | Technology | Description |
|----------|------------|-------------|
| **Framework** | Next.js 14+ | React framework with App Router |
| **Language** | TypeScript | Type-safe JavaScript with strict mode |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **UI Components** | shadcn/ui | 16+ accessible components |
| **Icons** | Lucide React | Beautiful, consistent icon library |
| **Animations** | Framer Motion | Production-ready motion library |
| **Theme System** | next-themes | Dark/light mode support |
| **CAPTCHA** | Cloudflare Turnstile | Bot protection service |
| **Special Components** | kokonutui, animate-ui | Enhanced UI libraries |



### Prerequisites
- **Node.js**: 20.x or higher
- **Package Manager**: npm, yarn, pnpm, or bun
- **MongoDB**: For data persistence (optional for basic functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/4ngel2769/minecraft-server-status.git
   cd minecraft-server-status
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Copy and configure environment
cp .env.example .env

# Start all services
docker-compose up --build
```

This launches both the application (port 3000) and MongoDB (port 27017) as separate containers.

### Using Docker Directly

```bash
# Build the image
docker build -t minecraft-server-status .

# Run with external MongoDB
docker run -p 3000:3000 -e MONGODB_URI=mongodb://your-uri minecraft-server-status
```

## CI/CD Pipeline

This project includes comprehensive GitHub Actions workflows for automated testing and quality assurance.

### Build Workflow (`.github/workflows/build.yml`)
- **Trigger**: Push/PR to `main` branch
- **Node.js Testing**: Node.js 20.x with dependency caching
- **Quality Checks**: ESLint code analysis and TypeScript compilation
- **Build Validation**: Production build with environment variable validation
- **Artifacts**: Build outputs uploaded for inspection

### Docker Test Workflow (`.github/workflows/docker.yml`)
- **Trigger**: Push/PR to `main` branch
- **Container Build**: Multi-stage Docker build with Buildx and caching
- **Integration Testing**: Full-stack testing with MongoDB container
- **Health Checks**: Application startup and endpoint validation
- **Test Coverage**: Homepage, API endpoints, and health monitoring
- **Cleanup**: Automatic container and network cleanup

### Environment Variables
Configure these repository secrets for production deployments:

| Secret | Description | Required |
|--------|-------------|----------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key | Optional |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID | Optional |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking DSN | Optional |
| `NEXTAUTH_URL` | NextAuth base URL | Production |
| `NEXTAUTH_SECRET` | NextAuth JWT secret | Production |
| `MONGODB_URI` | MongoDB connection string | Production |
| `EMAIL_*` | Email service configuration | Optional |
| `DISCORD_WEBHOOK_URL` | Discord notifications | Optional |

> **Note**: Workflows use dummy values for missing secrets during testing.

## Project Structure

```
minecraft-server-status/
├── app/
│   ├── page.tsx                    # Home page with server search
│   ├── server/
│   │   ├── [slug]/page.tsx         # Server status page
│   │   └── layout.tsx              # Server page metadata
│   ├── motd-editor/
│   │   ├── page.tsx                # MOTD creator/editor
│   │   └── layout.tsx              # MOTD editor metadata
│   ├── api/
│   │   └── server/route.ts         # Server status API endpoint
│   ├── layout.tsx                  # Root layout with Header/Footer
│   └── globals.css                 # Global styles
├── components/
│   ├── ui/                         # shadcn/ui components (16+)
│   ├── kokonutui/                  # kokonutui components
│   ├── animate-ui/                 # Gradient backgrounds
│   ├── header.tsx                  # Navigation header
│   ├── footer.tsx                  # Site footer
│   ├── breadcrumbs.tsx             # Breadcrumb navigation
│   ├── loading.tsx                 # Loading components
│   ├── error-boundary.tsx          # Error handling
│   ├── theme-provider.tsx          # Theme provider
│   └── theme-toggle.tsx            # Theme toggle button
├── lib/
│   ├── minecraft.ts                # Minecraft API utilities
│   ├── motd-formatter.ts           # MOTD formatting library (600+ lines)
│   ├── rate-limit.ts               # Rate limiting system (300+ lines)
│   └── utils.ts                    # Utility functions
├── docs/                           # Documentation
│   ├── MOTD_EDITOR_GUIDE.md        # User guide for MOTD editor
│   ├── MOTD_FORMATTER.md           # API docs for formatter
│   ├── PHASE_8_SUMMARY.md          # Export features summary
│   ├── PHASE_9_SUMMARY.md          # Rate limiting summary
│   ├── PHASE_10_SUMMARY.md         # UI polish summary
│   ├── COMPONENT_REFERENCE.md      # Component usage guide
│   └── RATE_LIMIT_QUICK_START.md   # Rate limit setup guide
├── components.json                 # shadcn/ui configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── next.config.mjs                 # Next.js configuration
```
<!-- ```
├── app/                 # Next.js app directory
├── components/          # React components (ui/, custom)
├── lib/                 # Utilities and libraries
├── docs/                # Documentation
├── components.json      # shadcn/ui config
├── tailwind.config.ts   # Tailwind config
├── tsconfig.json        # TypeScript config
└── next.config.mjs      # Next.js config
``` -->

## Documentation

- **[MOTD Editor Guide](docs/MOTD_EDITOR_GUIDE.md)**: Complete user guide for the MOTD editor
- **[MOTD Formatter API](docs/MOTD_FORMATTER.md)**: Technical documentation for the formatting library
- **[Component Reference](docs/COMPONENT_REFERENCE.md)**: Quick reference for all UI components
- **[Rate Limit Setup](docs/RATE_LIMIT_QUICK_START.md)**: Guide to configuring rate limiting
- **[Phase Summaries](docs/)**: Detailed summaries of each development phase

## API

The application uses the [mcsrvstat.us](https://mcsrvstat.us/) API to fetch server status information.

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, improving documentation, or proposing new features, your help is appreciated.

### Areas for Contribution

- **Bug Fixes**: Check the [Issues](https://github.com/4ngel2769/minecraft-server-status/issues) page
- **Documentation**: Improve guides, add examples, fix typos
- **Features**: Implement items from the [Roadmap](#-roadmap)
- **UI/UX**: Enhance designs, improve accessibility
- **Testing**: Add unit tests, integration tests
- **Internationalization**: Add language support

### Questions?

- Open an [issue](https://github.com/4ngel2769/minecraft-server-status/issues) for questions
- Check existing issues and discussions first
- Provide as much context as possible

Thank you for contributing to Minecraft Server Status! ⚡


See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for components
- [mcsrvstat.us](https://mcsrvstat.us/) for server status API
- [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) for CAPTCHA
- [Framer Motion](https://www.framer.com/motion/) for animations

## Roadmap

- [x] Basic server status checking
- [x] MOTD editor with templates
- [x] Export to multiple formats
- [x] Cloudflare Turnstile integration
- [x] Rate limiting system
- [x] Comprehensive documentation
- [x] User accounts and saved servers
- [ ] Historical server statistics
- [ ] Server comparison tool
- [ ] Plugin/mod detection

---

**Built with 💚 & ☕ by [4ngel2769](https://github.com/4ngel2769)**
