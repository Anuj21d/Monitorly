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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    let cancelled = false;

    async function loadMonitors(isInitialLoad = false) {
      try {
        if (isInitialLoad) {
          setIsLoading(true);
          setError(null);
        }

        const data = await getMonitors();

        if (!cancelled) {
          setMonitors(data);
          setError(null);
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
        if (!cancelled && isInitialLoad) {
          setIsLoading(false);
        }
      }
    }

    void loadMonitors(true);

    const intervalId = window.setInterval(() => {
      void loadMonitors();
    }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  const handleCreateMonitor = (newMonitor: Monitor) => {
    setMonitors((current) => [newMonitor, ...current]);
  };

  const filteredMonitors = monitors.filter((monitor) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      monitor.name.toLowerCase().includes(query) ||
      monitor.url.toLowerCase().includes(query);

    const matchesStatus =
      activeFilter === "All" ||
      monitor.status.toLowerCase() === activeFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

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

        <DashboardStats monitors={monitors} />
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <DashboardList monitors={filteredMonitors} setMonitors={setMonitors} />
      </PageContainer>
    </div>
  );
};

export default Dashboard;
