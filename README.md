# Todo App - Frontend Assignment Talenavi

A modern, feature-rich todo application built with Vue 3, TypeScript, and Tailwind CSS. This application provides both table and kanban board views for managing tasks with advanced filtering, sorting, and editing capabilities.

## ✨ Features

- **Dual View Modes**: Switch between table and kanban board views
- **Inline Editing**: Double-click any cell to edit tasks directly
- **Advanced Filtering**: Filter tasks by developers and search by keywords
- **Flexible Sorting**: Sort by multiple columns with custom order
- **Bulk Operations**: Select and delete multiple tasks at once
- **Real-time Validation**: Form validation with helpful error messages
- **Error Handling**: Robust error boundaries and user feedback

## 🚀 Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Ant Design Vue
- **State Management**: Pinia
- **Build Tool**: Vite
- **Date Handling**: Day.js
- **HTTP Client**: Axios

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn or bun

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd todo-talenavi
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Environment Configuration**

   ```bash
   cp .env-example .env
   ```

   Update the `.env` file with your configuration:

   ```
   VITE_API_BASE_URL=your_api_base_url
   ```

4. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Vue components
│   ├── modals/         # Modal components
│   ├── ui/             # Reusable UI components
│   └── views/          # Main view components
├── composables/        # Vue composables
├── constants/          # Application constants
├── data/              # Static data and configurations
├── services/          # API services
├── stores/            # Pinia stores
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── style.css          # Global styles
```

## 🎯 Usage

### Task Management

- **Create Task**: Click the "New Task" button to add a new task
- **Edit Task**: Double-click any cell in the table view to edit inline
- **Delete Tasks**: Select tasks and click the delete button
- **Drag & Drop**: In kanban view, drag tasks between status columns

### Filtering & Sorting

- **Search**: Use the search bar to filter tasks by title
- **Developer Filter**: Filter tasks by assigned developers
- **Column Sorting**: Click column headers to sort, or use the sort modal for multi-column sorting

### Views

- **Table View**: Comprehensive table with inline editing and bulk operations
- **Kanban View**: Visual board with drag-and-drop functionality

## 🔧 Development

### Code Style

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Code linting with Vue and TypeScript rules
- **Prettier**: Code formatting (if configured)

### Component Guidelines

- Use Composition API with `<script setup>`
- Define proper TypeScript interfaces for props and emits
- Follow Vue 3 best practices for reactivity and lifecycle
- Use Tailwind CSS for styling with consistent design tokens

### State Management

- **Pinia**: Used for global state management
- **Composables**: For reusable logic and local state
- **Props/Emits**: For component communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

1. Ensure all TypeScript errors are resolved
2. Test functionality in both table and kanban views
3. Check for console errors and warnings

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - The progressive JavaScript framework
- [Ant Design Vue](https://antdv.com/) - Enterprise-class UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Pinia](https://pinia.vuejs.org/) - The Vue Store that you will enjoy using

## 📞 Support

If you have any questions or need help, please:

1. Check the existing issues
2. Create a new issue with detailed description
3. Provide steps to reproduce any bugs

---

**Happy coding! 🚀**
