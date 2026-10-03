import Footer from "../../../components/layout/Footer";
import Navbar from "../../../components/layout/MarketingNavbar";
import PageContainer from "../../../components/layout/PageContainer";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <main className="w-full bg-canvas text-white ">
        <PageContainer>
          <section className="relative pt-16 md:pt-28 md:pb-32 px-6 lg:px-12 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold">Monitorly</h1>
          </section>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
