import { useEffect, useState } from "react";
import axios from "axios";
import PageContainer from "../../../components/layout/PageContainer";
import DashboardHeader from "../components/DashboardHeader";
import DashboardList from "../components/DashboardList";
import DashboardStats from "../components/DashboardStats";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import type { Monitor } from "../types/types";
import { getMonitors } from "../services/monitorService";

const Dashboard = () => {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMonitors() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getMonitors();

        if (!cancelled) {
          setMonitors(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load monitors:", err);

          setError(
            axios.isAxiosError(err) && err.response?.status === 401
              ? "Please sign in to view your monitors."
              : "Unable to load monitors. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadMonitors();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateMonitor = (newMonitor: Monitor) => {
    setMonitors((current) => [newMonitor, ...current]);
  };

  return (
    <div className="min-h-screen bg-canvas text-text-light-primary flex flex-col font-sans selection:bg-coral selection:text-white antialiased">
      <Navbar />

      <PageContainer className="py-10">
        <DashboardHeader onCreateMonitor={handleCreateMonitor} />

        {isLoading && (
          <p role="status" className="mb-4 text-sm text-neutral">
            Loading monitors...
          </p>
        )}

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-400">
            {error}
          </p>
        )}

        <DashboardStats />
        <SearchBar />
        <DashboardList monitors={monitors} setMonitors={setMonitors} />
      </PageContainer>
    </div>
  );
};

export default Dashboard;
