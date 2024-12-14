"use client";
import { useEffect, useState } from 'react';
import Head from 'next/head';
import PipelineDashboard from '../components/PipelineDashboard';
import Login from '../components/Login';
import { fetchAllCollections, forceRefreshData, setupRealtimeSync } from './firebase/firebasefunctions';
import { useAuth } from './context/AuthContext';
import { AuthContextProvider } from './context/AuthContext';

function HomePage() {
  const [retrievedData, setRetrievedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleDataUpdate = (newData) => {
    setRetrievedData(newData);
  };

  useEffect(() => {
    if (user) {
      // Initial data fetch
      const initialFetch = async () => {
        try {
          setIsLoading(true);
          const data = await fetchAllCollections();
          console.log("\n\n\n\nInitial data:", data, "Data ends\n\n\n\n");
          setRetrievedData(data);
        } catch (error) {
          console.error("Error in initial fetch:", error);
        } finally {
          setIsLoading(false);
        }
      };

      initialFetch();

      // Setup real-time sync
      const cleanup = setupRealtimeSync(handleDataUpdate);

      // Cleanup listeners when component unmounts
      return () => cleanup();
    }
  }, [user]);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const data = await forceRefreshData();
      setRetrievedData(data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Pipeline Dashboard</title>
      </Head>
      <div className="p-4 bg-gray-900">
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
      {retrievedData && <PipelineDashboard data={retrievedData} />}
    </div>
  );
}

export default function Home() {
  return (
    <AuthContextProvider>
      <HomePage />
    </AuthContextProvider>
  );
}
