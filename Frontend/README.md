# Data Monitoring Dashboard Frontend

React-based frontend for user authentication and log data monitoring with a responsive dashboard, filtering, and visualization.

## Features
- **Authentication**: Sign-up, sign-in, logout with role-based access (Admin/Employee) using JWT in `localStorage`.
- **Log Monitoring**: Paginated table with logs (interface, integration key, status, message, timestamp, severity).
- **Filtering/Search**: Real-time search (debounced), status filter (Success, Failure, Pending, Warning), advanced filters for interface/integration key.
- **Visualization**: Bar chart for log status counts using Chart.js.
- **Responsive**: Mobile-friendly with Tailwind CSS.
- **Error/Loading**: Spinners, error messages, and "no more data" indicator.

## Technologies
- React (`^19.1.0`), React Router (`^7.7.1`), React Hook Form (`^7.62.0`)
- Chart.js (`^4.5.0`), `react-chartjs-2` (`^5.3.0`)
- Axios (`^1.11.0`), `react-infinite-scroll-component` (`^6.1.0`)
- Tailwind CSS (`^3.4.17`), Vite (`^7.0.4`), ESLint (`^9.30.1`)

## Setup
1. Clone: `git clone <repository-url> && cd <frontend-folder>`
2. Install: `npm install`
3. Add `.env`:
   ```env
   VITE_BASE_URL=http://localhost:3000 // backedend API URL
   
   ```