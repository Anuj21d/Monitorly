
import { useState } from "react";
import PageContainer from "../../../components/layout/PageContainer";
import DashboardHeader from "../components/DashboardHeader";
import DashboardList from "../components/DashboardList";
import DashboardStats from "../components/DashboardStats";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import type { Monitor } from "../types/types";

const Dashboard = () => {
  const [monitors, setMonitors] = useState<Monitor[]>([]);

  const handleCreateMonitor = (newMonitor: Monitor) => {
    setMonitors((currentMonitors) => [
      newMonitor,
      ...currentMonitors,
    ]);
  };

  return (
    <div className="min-h-screen bg-canvas text-text-light-primary flex flex-col font-sans selection:bg-coral selection:text-white antialiased">
      <Navbar />
      <PageContainer className="py-10">
        <DashboardHeader onCreateMonitor={handleCreateMonitor} />
        <DashboardStats />
        <SearchBar />
        <DashboardList
          monitors={monitors}
          setMonitors={setMonitors}
        />
      </PageContainer>
    </div>
  );
};

export default Dashboard;
