# 🎓 Teachable Dashboard

Welcome to the **Teachable Dashboard**! 🚀 This Next.js app provides a sleek and intuitive interface to manage and view courses and student enrollments from Teachable. Easily track student progress, filter completed courses, and enjoy a seamless user experience.

## ✨ Features

- 📚 View a list of courses with course cards.
- 👥 See enrolled students and their progress.
- ✅ Filter students who have completed courses.
- 🖼️ Optimized image loading from trusted sources.

## 🛠️ Getting Started

Follow these simple steps to get the project up and running locally:

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd teachable-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of your project and add your Teachable API key:

```env
NEXT_PUBLIC_TEACHABLE_API_KEY=your_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action! 🎉

## 🧪 Running Tests

### Unit Tests

Run unit tests with Jest and React Testing Library:

```bash
npm test
```

Or run tests in watch mode:

```bash
npm run test:watch
```

### End-to-End Tests

Run Cypress tests to ensure everything works smoothly:

```bash
npm run dev # Start your app first
npm run cypress # Open Cypress UI
```

Or run Cypress tests headlessly:

```bash
npm run cypress:headless
```

## 🚀 How to Use the App

- Browse through available courses.
- Click on "View Students" to see enrolled students and their progress.
- Use the "Completed" toggle to filter students who have finished the course.
- Close the modal to return to the course list.
- Note optimizations such as
  - Lazy loading of images;
  - Caching of responses (via react-query) so subsequent requests show know loading
  - No redundant lookups for users: one call is made to cache users

## 🌟 Next Steps

Want to contribute or expand the project? Here are some exciting ideas:

- 🔐 Leverage the Teachable OAuth for authing into experience
- 📈 Add analytics to track student engagement and for baselines for future A/B tests.
- 🔔 Implement notifications for updates on student progress.
  - This could be acheived through having a local cache of the students' progress and comparing the fresh data
