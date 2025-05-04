# IJAMTS Journal Website

This is a modern academic journal website for the International Journal of Advances in Management, Technology and Science (IJAMTS). The website is built with Next.js, React, and TailwindCSS.

## Features

- Modern, clean, and professional design
- Fully responsive layout
- Academic color palette (navy blue, slate gray, white)
- Sticky navigation with mobile-friendly menu
- Two-column layout for content organization
- Editorial board section with member profiles
- Archives section for browsing published papers
- Document viewer for previewing publications
- Submission system for authors
- Contact form for inquiries
- SEO optimized with schema.org metadata
- Dark mode support

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [React](https://react.dev/) - UI library
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Firebase](https://firebase.google.com/) - Backend services for document storage and retrieval

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ijamts-journal.git
cd ijamts-journal
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Project Structure

- `public/` - Static assets like images and icons
- `src/app/` - Next.js app router files
  - `archives/` - Archives page for browsing published papers
  - `contact/` - Contact page with inquiry form
  - `editorial-board/` - Editorial board members and information
  - `submission/` - Paper submission system
- `src/components/` - Reusable UI components
- `lib/` - Utility functions and configurations

## Key Pages

- **Home** (`/`) - Landing page with recent publications and announcements
- **Editorial Board** (`/editorial-board`) - Information about the journal's editorial team
- **Archives** (`/archives`) - Browse and view all published papers
- **Submission** (`/submission`) - Instructions and form for authors to submit papers
- **Contact** (`/contact`) - Contact form for inquiries

## Customization

You can customize the website by modifying the following files:

- `src/app/globals.css` - Global styles and theme variables
- `src/components/` - UI components for different parts of the website
- `src/app/editorial-board/page.tsx` - Editorial board member information

## Deployment

This website can be deployed on any platform that supports Next.js applications, such as:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Design inspired by academic journal websites and best practices
- SVG icons created specifically for this project
