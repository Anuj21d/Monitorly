import { motion } from "motion/react";
import Footer from "../../../components/layout/Footer";
import Navbar from "../../../components/layout/MarketingNavbar";
import PageContainer from "../../../components/layout/PageContainer";
import Button from "../components/Button";
import DemoAPI from "../components/DemoAPI";
import FeatureSection from "../components/FeatureSection";
import MainHero from "../components/MainHero";
import ProductSection from "../components/ProductSection";

const LandingPage = () => {
  return (
    <>
      <Navbar />

      <main className="w-full bg-canvas text-white">
        <PageContainer>
          
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <MainHero />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <ProductSection />
          </motion.div>

  
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <FeatureSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <DemoAPI />
          </motion.div>

          <motion.section
            className="py-24 md:py-36 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
            >
              <motion.div
                className="text-[11px] font-bold tracking-[0.25em] uppercase text-coral mb-6"
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
              >
                Instant Deployment
              </motion.div>

              <motion.h2
                className="text-5xl sm:text-7xl lg:text-[5.5rem] font-extrabold tracking-[-0.04em] leading-[0.95] text-text-light-primary mb-8 text-balance"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                Stop checking.
                <br />
                <span className="text-coral">Start monitoring.</span>
              </motion.h2>

              <motion.p
                className="text-lg sm:text-xl text-neutral max-w-xl mx-auto mb-10 md:mb-12 font-normal"
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45 }}
              >
                PulseCheck watches your APIs so you don't have to.
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.96 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Button className="text-lg" />
              </motion.div>
            </motion.div>
          </motion.section>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

export default LandingPage;
