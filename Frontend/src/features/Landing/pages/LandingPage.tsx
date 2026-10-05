import Footer from "../../../components/layout/Footer";
import Navbar from "../../../components/layout/MarketingNavbar";
import PageContainer from "../../../components/layout/PageContainer";
import Button from "../components/Button";
import DemoAPI from "./DemoAPI";
import FeatureSection from "./FeatureSection";
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
          <FeatureSection />
          <DemoAPI />
          <section className="py-24 md:py-36 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/8 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="text-[11px] font-bold tracking-[0.25em] uppercase text-coral mb-6">
                Instant Deployment
              </div>
              <h2 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-extrabold tracking-[-0.04em] leading-[0.95] text-text-light-primary mb-8 text-balance">
                Stop checking.
                <br />
                <span className="text-coral">Start monitoring.</span>
              </h2>
              <p className="text-lg sm:text-xl text-neutral max-w-xl mx-auto mb-10 md:mb-12 font-normal">
                PulseCheck watches your APIs so you don't have to.
              </p>
              <div>
                <Button className="text-lg" />
              </div>
            </div>
          </section>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
