# AI Full-Stack Template

This is a full-stack template project for Software Composers to create applications with AI.

## Getting started
To create a new project, you go to `/paths`, choose from our list of Paths, and then use Cursor's Composer feature to quickly scaffold your project!

You can also edit the Path's prompt template to be whatever you like!

## Running Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Copy `.env.local` and fill in your API keys for:
     - OpenAI
     - Anthropic
     - Replicate
     - Deepgram
     - Firebase (if needed)
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies used
This doesn't really matter, but is useful for the AI to understand more about this project. We are using the following technologies
- React with Next.js 14 App Router
- TailwindCSS
- Firebase Auth, Storage, and Database
- Multiple AI endpoints including OpenAI, Anthropic, and Replicate using Vercel's AI SDK
