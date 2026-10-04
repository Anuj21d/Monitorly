import Footer from "../../../components/layout/Footer";
import Navbar from "../../../components/layout/MarketingNavbar";
import PageContainer from "../../../components/layout/PageContainer";
import MainHero from "./MainHero";
import ProductSection from "./ProductSection";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <main className="w-full bg-canvas text-white ">
        <PageContainer>
          <MainHero />
          <ProductSection />
        </PageContainer>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
