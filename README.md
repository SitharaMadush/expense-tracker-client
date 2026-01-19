# Expense Tracker Frontend

A Vue 3 single-page application for tracking personal income and expenses with visual analytics. This frontend connects to a Laravel backend API and demonstrates modern frontend development practices.

## Key Skills Demonstrated

- **Modern Vue 3**: Composition API with `<script setup>` syntax
- **State Management**: Pinia stores for authentication and theme
- **Data Visualization**: Interactive charts with Chart.js and vue-chartjs
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **API Integration**: Axios with interceptors for token-based authentication

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Vue 3** | Frontend framework (Composition API) |
| **Vite 7** | Build tool & dev server |
| **Pinia** | State management |
| **Vue Router 4** | Client-side routing |
| **Axios** | HTTP client |
| **Tailwind CSS 4** | Utility-first styling |
| **Chart.js** | Data visualization |
| **vue-chartjs** | Vue wrapper for Chart.js |
| **Moment.js** | Date formatting |

---

## Features

- **Dashboard**: Overview with income/expense pie charts and monthly expense bar chart
- **Transaction Management**: Full CRUD operations with sortable, paginated data table
- **Category Management**: Organize transactions with color-coded categories
- **Authentication**: Login, registration, and secure logout
- **Theme Switching**: Dark, light, and system-preference modes
- **Responsive UI**: Mobile-friendly navigation with collapsible menu

---

## Project Structure

```
src/
├── main.js                     # Application entry point
├── App.vue                     # Root component
├── style.css                   # Global styles
│
├── views/                      # Page components
│   ├── HomeView.vue            # Dashboard with charts
│   ├── TransactionsView.vue    # Transaction list & CRUD
│   ├── CategoriesView.vue      # Category management
│   ├── LoginView.vue           # Login page
│   └── RegisterView.vue        # Registration page
│
├── components/
│   ├── AppLayout.vue           # Authenticated layout with nav
│   └── charts/                 # Chart components
│       ├── PieChart.vue
│       ├── MonthlyExpenseBar.vue
│       └── TransactionCategoryPie.vue
│
├── stores/                     # Pinia stores
│   ├── auth.js                 # Authentication state & actions
│   └── theme.js                # Theme mode management
│
├── router/
│   └── index.js                # Route definitions & guards
│
├── lib/
│   └── api.js                  # Axios instance with auth interceptor
│
└── helpers/
    └── chartHelper.js          # Chart utility functions
```

---

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Running Laravel backend API

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend API

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost/api/v1` |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## API Endpoints

The frontend consumes the following API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | User registration |
| POST | `/login` | User authentication |
| POST | `/logout` | End session |
| GET | `/me` | Get current user |
| GET | `/transactions` | List transactions (paginated) |
| POST | `/transactions` | Create transaction |
| PUT | `/transactions/{id}` | Update transaction |
| DELETE | `/transactions/{id}` | Delete transaction |
| GET | `/categories` | List categories |

---

## License

MIT License
