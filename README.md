# Nativya - Regional Language Data Collection Platform

A modern web application for collecting and preserving regional Indian language data through community-driven contributions. Users can contribute text and audio data in their native languages to help develop language models and preserve linguistic diversity.

## 🌟 Features

### Language Support
- **12+ Indian Languages**: Hindi, Bengali, Tamil, Telugu, Malayalam, Kannada, Gujarati, Marathi, Punjabi, Odia, Assamese, Urdu
- **Native Language Display**: Shows language names in their native scripts
- **Language Selection**: Easy-to-use interface for choosing preferred language

### Data Collection
- **Text Contributions**: Rich text input with character counting
- **Audio Recording**: Built-in microphone recording with playback
- **Prompt System**: Curated prompts across multiple categories:
  - Daily Life & Routines
  - Family Traditions
  - Food & Cuisine
  - Culture & Customs
  - Travel Experiences

### User Experience
- **Progressive Workflow**: Step-by-step contribution process
- **Real-time Feedback**: Success notifications and progress tracking
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Data Export**: Download contributions as JSON files
- **Privacy-First**: All data stored locally with user control

### Dashboard & Analytics
- **Contribution Tracking**: View all submitted contributions
- **Language Statistics**: Breakdown by language and content type
- **Metadata Tracking**: Device info, recording duration, text length
- **Data Management**: Export and clear contributions

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18 or later
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nativya-ui
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Audio Recording**: Web Audio API
- **Data Storage**: Local Storage (browser)

### Project Structure
```
nativya-ui/
├── app/
│   ├── components/          # React components
│   │   ├── LanguageSelector.tsx
│   │   ├── PromptSelector.tsx
│   │   ├── DataContribution.tsx
│   │   ├── ContributionsDashboard.tsx
│   │   └── Navigation.tsx
│   ├── data/               # Static data
│   │   ├── languages.ts    # Language definitions
│   │   └── prompts.ts      # Prompt categories
│   ├── store/              # State management
│   │   └── useAppStore.ts  # Zustand store
│   ├── types/              # TypeScript types
│   │   └── index.ts        # Type definitions
│   ├── lib/                # Utilities
│   │   └── utils.ts        # Helper functions
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── public/                 # Static assets
└── package.json           # Dependencies
```

### Key Components

#### LanguageSelector
- Displays available Indian languages with native names
- Search functionality for easy language discovery
- Visual language selection with flags

#### PromptSelector
- Categorized prompts for different topics
- Filter by category (daily, family, food, culture, travel)
- Example suggestions for each prompt

#### DataContribution
- Dual input modes: text and audio recording
- Real-time audio recording with timer
- Form validation and submission handling

#### ContributionsDashboard
- Comprehensive view of all contributions
- Statistics and analytics
- Export functionality for data portability

## 📊 Data Structure

### Contribution Format
```typescript
interface DataContribution {
  id: string;
  languageCode: string;
  promptId: string;
  textContent?: string;
  audioBlob?: Blob;
  audioUrl?: string;
  timestamp: Date;
  metadata: {
    deviceInfo: string;
    recordingDuration?: number;
    textLength?: number;
  };
}
```

### Language Definition
```typescript
interface Language {
  code: string;        // ISO language code
  name: string;        // English name
  nativeName: string;  // Native script name
  flag: string;        // Country flag emoji
}
```

## 🔧 Configuration

### Adding New Languages
1. Add language definition to `app/data/languages.ts`
2. Include native name and proper language code
3. Update language support documentation

### Adding New Prompts
1. Add prompt to `app/data/prompts.ts`
2. Categorize appropriately (daily, family, food, culture, travel)
3. Include examples for better user guidance

### Customizing Styling
- Modify Tailwind classes in components
- Update color scheme in `tailwind.config.js`
- Customize responsive breakpoints

## 🌐 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Audio Recording**: Requires HTTPS in production
- **Local Storage**: Persistent data across sessions
- **Mobile Support**: Responsive design for smartphones and tablets

## 🔒 Privacy & Security

- **Local Storage**: All data stored in user's browser
- **No Server Storage**: No data sent to external servers
- **User Control**: Complete control over data export and deletion
- **Audio Permissions**: Explicit microphone permission required

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Configure build settings
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Compatible with Next.js static export
- **AWS Amplify**: Full Next.js support
- **Self-hosted**: Standard Node.js deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain responsive design
- Test on multiple devices
- Ensure accessibility compliance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Indian Language Community**: For preserving linguistic diversity
- **Next.js Team**: For the excellent framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Zustand**: For lightweight state management

## 📞 Support

For questions, issues, or contributions:
- Create an issue on GitHub
- Contact the development team
- Check documentation for common solutions

---

**Nativya** - Empowering regional language preservation through community-driven data collection. 🌍📝🎤
