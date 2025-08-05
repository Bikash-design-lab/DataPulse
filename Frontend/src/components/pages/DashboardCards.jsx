import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/logged/data`;

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const DashboardCards = () => {
  const [logData, setLogData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', interfaceName: '', integrationKey: '' });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const limit = 20;

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 400);

  // Update filters when debounced search changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
    setPage(1);
  }, [debouncedSearch]);

  // Fetch data with pagination and filters
  const fetchData = async (reset = false) => {
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const params = new URLSearchParams({
        page: currentPage,
        limit,
        search: filters.search,
        status: filters.status,
        interfaceName: filters.interfaceName,
        integrationKey: filters.integrationKey,
      });
      const resp = await fetch(`${URL}?${params}`);
      if (!resp.ok) throw new Error('Network error');
      const json = await resp.json();
      const newData = json.data || [];
      setLogData((prev) => (reset ? newData : [...prev, ...newData]));
      setHasMore(newData.length === limit);
      if (!reset) setPage(currentPage + 1);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      console.error('Failed to fetch logged data:', error);
      setLoading(false);
    }
  };

  // Apply client-side filtering whenever logData or filters change
  useEffect(() => {
    const applyFilters = () => {
      let result = [...logData];

      // Apply search filter (case-insensitive, searches interfaceName, integrationKey, message)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(
          (log) =>
            log.interfaceName?.toLowerCase().includes(searchLower) ||
            log.integrationKey?.toLowerCase().includes(searchLower) ||
            log.message?.toLowerCase().includes(searchLower)
        );
      }

      // Apply status filter
      if (filters.status) {
        result = result.filter((log) => log.status.toLowerCase() === filters.status.toLowerCase());
      }

      // Apply interfaceName filter
      if (filters.interfaceName) {
        result = result.filter((log) => log.interfaceName === filters.interfaceName);
      }

      // Apply integrationKey filter
      if (filters.integrationKey) {
        result = result.filter((log) => log.integrationKey === filters.integrationKey);
      }

      setFilteredData(result);
    };

    applyFilters();
  }, [logData, filters]);

  // Initial fetch and refetch on filter change
  useEffect(() => {
    fetchData(true);
  }, [filters.status, filters.interfaceName, filters.integrationKey, filters.search]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle status filter
  const handleStatusFilter = (e) => {
    setFilters({ ...filters, status: e.target.value });
    setPage(1);
  };

  // Handle advanced filter changes
  const handleAdvancedFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  // Clear advanced filters
  const clearFilters = () => {
    setFilters({ search: '', status: '', interfaceName: '', integrationKey: '' });
    setSearchInput('');
    setPage(1);
    setShowAdvancedFilters(false);
  };

  // Status color mapping
  const getStatusColor = (status) => {
    return status.toLowerCase() === 'success' ? 'bg-green-100 text-green-800' :
           status.toLowerCase() === 'failure' ? 'bg-red-100 text-red-800' :
           status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
           'bg-orange-100 text-orange-800'; // For 'warning' if present
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get unique values for filter dropdowns
  const uniqueInterfaces = useMemo(() => 
    [...new Set(logData.map(log => log.interfaceName))].sort(), [logData]
  );
  const uniqueIntegrationKeys = useMemo(() => 
    [...new Set(logData.map(log => log.integrationKey))].sort(), [logData]
  );

  // Active filters count
  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

// Chart data for status counts
const chartData = useMemo(() => {
  const statusCounts = filteredData.reduce((acc, log) => {
    const status = log.status?.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  return {
    labels: ['Success', 'Failure', 'Pending', 'Warning'],
    datasets: [{
      label: 'Log Count by Status',
      data: [
        statusCounts.success || 0,
        statusCounts.failure || 0,
        statusCounts.pending || 0,
        statusCounts.warning || 0,
      ],
      backgroundColor: ['#34D399', '#EF4444', '#FBBF24', '#F97316'],
      borderColor: ['#10B981', '#DC2626', '#F59E0B', '#EA580C'],
      borderWidth: 1,
    }],
  };
}, [filteredData]);

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Log Status Distribution' },
  },
  scales: {
    y: { beginAtZero: true, title: { display: true, text: 'Count' } },
    x: { title: { display: true, text: 'Status' } },
  },
};


  return (
    
    <div className="w-full min-h-screen bg-gray-100 p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:text-left flex justify-center border-2">Data Monitoring</h1>
        {/* Chart Section */}
        <div className="w-full mb-6 bg-white p-4 rounded-lg shadow">
          <div className="h-56 sm:h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

      {/* Search and Status Filter */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mb-4 w-full">
        <div className="relative w-full sm:w-1/3">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchInput}
            onChange={handleSearch}
            className="p-2 pl-10 rounded border w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filters.status}
          onChange={handleStatusFilter}
          className="p-2 rounded border w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="failure">Failed</option>
          <option value="pending">Pending</option>
          <option value="warning">Warning</option>
        </select>
        <button
          onClick={() => setShowAdvancedFilters(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full sm:w-auto relative"
        >
          <svg className="inline-block h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Advanced Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 h-5 w-5 flex items-center justify-center text-xs bg-blue-700 text-white rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filters Modal */}
      {showAdvancedFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Advanced Filters</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleAdvancedFilterChange}
                className="p-2 rounded border w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="success">Success</option>
                <option value="failure">Failed</option>
                <option value="pending">Pending</option>
                <option value="warning">Warning</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Interface Name</label>
              <select
                name="interfaceName"
                value={filters.interfaceName}
                onChange={handleAdvancedFilterChange}
                className="p-2 rounded border w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Interfaces</option>
                {uniqueInterfaces.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Integration Key</label>
              <select
                name="integrationKey"
                value={filters.integrationKey}
                onChange={handleAdvancedFilterChange}
                className="p-2 rounded border w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Integration Keys</option>
                {uniqueIntegrationKeys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="w-full overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">S-no.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Interface</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Integration Key</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Message</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Timestamp</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((log,id) => (
              <tr key={log._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-4 text-sm text-gray-900 sm:px-6 whitespace-nowrap sm:whitespace-normal">{id+1}</td>
                <td className="px-4 py-4 text-sm text-gray-900 sm:px-6 whitespace-nowrap sm:whitespace-normal">{log.interfaceName}</td>
                <td className="px-4 py-4 text-sm text-gray-600 font-mono sm:px-6 whitespace-nowrap sm:whitespace-normal">{log.integrationKey}</td>
                <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(log.status)}`}>
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 sm:px-6 max-w-md truncate" title={log.message}>{log.message}</td>
                <td className="px-4 py-4 text-sm text-gray-600 sm:px-6 whitespace-nowrap sm:whitespace-normal">{formatTimestamp(log.timestamp)}</td>
                <td className="px-4 py-4 text-sm text-gray-900 sm:px-6 text-right">{log.severity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={() => fetchData(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-gray-300 w-full sm:w-auto max-w-md"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load more data'}
          </button>
        </div>
      )}

      {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
      {loading && filteredData.length === 0 && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mx-auto"></div>
        </div>
      )}
      {!hasMore && filteredData.length > 0 && <div className="text-center py-4 text-gray-500">No more data to load</div>}
    </div>
  );
};

export default DashboardCards;
