# DataPulse

# Data Monitoring Dashboard

A React-based web application for monitoring and visualizing log data with user authentication. The application includes a dashboard for viewing logs, filtering data, and visualizing log status distribution, along with secure sign-in and sign-up functionality.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Components](#components)
  - [DashboardCards](#dashboardcards)
  - [Signin](#signin)
  - [Signup](#signup)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features
- **User Authentication**:
  - Sign-up and sign-in functionality with role-based access (Admin or Employee).
  - Token-based authentication stored in `localStorage`.
  - Logout functionality to clear user session.
- **Log Data Monitoring**:
  - Displays paginated log data in a table with columns for serial number, interface name, integration key, status, message, timestamp, and severity.
  - Supports infinite scrolling with a "Load more data" button.
- **Filtering and Search**:
  - Real-time search across interface name, integration key, and message fields (debounced for performance).
  - Status filter with options: Success, Failure, Pending, Warning.
  - Advanced filters for interface name and integration key with dropdowns populated from unique log data values.
  - Clear all filters option.
- **Data Visualization**:
  - Bar chart displaying log count by status (Success, Failure, Pending, Warning) using Chart.js.
  - Responsive chart with customizable options (title, legend, axis labels).
- **Responsive Design**:
  - Mobile-friendly layout with Tailwind CSS for styling.
  - Adaptive padding, font sizes, and component widths for different screen sizes.
- **Error Handling and Loading States**:
  - Displays loading spinners during data fetching.
  - Shows error messages for failed API requests.
  - Indicates when no more data is available to load.

## Technologies Used
- **Frontend**:
  - React (with hooks: `useState`, `useEffect`, `useMemo`)
  - React Router (`useNavigate`) for navigation
  - Chart.js and `react-chartjs-2` for bar chart visualization
  - Tailwind CSS for styling
  - Axios for HTTP requests
- **Backend**:
  - Node.js with Express for API endpoints
- **Database**:
  - MongoDB for storing user and log data
- **Authentication**:
  - JWT (JSON Web Tokens) for secure user authentication

- **Other**:
  - Custom debounce hook for search input optimization
  - LocalStorage for token and user data persistence

## Setup and Installation

1. Install dependencies:
```bash 
npm install

```
2. Create a `.env` file in the root directory and add the following environment variables:
```plaintext
REACT_APP_AUTH_URL=http://localhost:5173/api

```
3. Start the development server:
```bash 
npm run dev

```
4. Open your browser and navigate to `http://localhost:5173` to view the application.
## Usage
- **Sign Up**: Create a new account with a username, email, and password.   
- **Sign In**: Log in with your credentials.
- **Dashboard**: View the log data with options to filter, search, and visualize status distribution.
- **Log Out**: Click the logout button to end your session. 