"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import PipelineDashboard from "../components/PipelineDashboard";
import Login from "../components/Login";
import AddUserModal from "../components/AddUserModal";
import {
  fetchAllCollections,
  forceRefreshData,
  setupRealtimeSync,
} from "./firebase/firebasefunctions";
import { useAuth } from "./context/AuthContext";
import { AuthContextProvider } from "./context/AuthContext";

function HomePage() {
  const [retrievedData, setRetrievedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExtendedView, setIsExtendedView] = useState(false);
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
      <div className="bg-gray-900 p-4 pb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="rounded bg-blue-500 px-3 py-1.5 text-white hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? "Refreshing..." : "Refresh Data"}
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded bg-green-500 px-3 py-1.5 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Add New Contact
          </button>
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isExtendedView}
                onChange={() => setIsExtendedView(!isExtendedView)}
              />
              <div className="w-11 h-6 bg-purple-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              <span className="ms-3 text-sm font-medium text-white">
                {isExtendedView ? "Extended" : "Compact"}
              </span>
            </label>
          </div>
        </div>
      </div>
      {retrievedData && <PipelineDashboard data={retrievedData} isExtendedView={isExtendedView} />}
      <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
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
