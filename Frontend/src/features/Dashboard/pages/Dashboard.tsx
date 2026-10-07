import PageContainer from "../../../components/layout/PageContainer";
import DashboardHeader from "../components/DashboardHeader";
import DashboardList from "../components/DashboardList";
import DashboardStats from "../components/DashboardStats";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-canvas text-text-light-primary flex flex-col font-sans selection:bg-coral selection:text-white antialiased">
      <Navbar />
      <PageContainer className="py-10">
        <DashboardHeader />
        <DashboardStats />
        <SearchBar />
        <DashboardList />
      </PageContainer>
    </div>
  );
};

export default Dashboard;
