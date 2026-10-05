import { TriangleAlert } from "lucide-react";
import { motion } from "motion/react";

type Api = {
  url: string;
  name: string;
  status: boolean;
  latency: number;
};

const examplApi: Api[] = [
  {
    url: "https://api.example.com/health",
    name: "Payment API",
    status: true,
    latency: 142,
  },
  {
    url: "https://auth.example.com/health",
    name: "Authentication API",
    status: true,
    latency: 94,
  },
  {
    url: "https://search.example.com/health",
    name: "Search API",
    status: false,
    latency: 0,
  },
  {
    url: "https://billing.example.com/health",
    name: "User Billing Service",
    status: true,
    latency: 100,
  },
];



const ProductSection = () => {
  return (
    <>
      <section
        id="product"
        className="py-12 md:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto  border-b border-border-dark-subtle"
      >
        <div className="p-16 bg-editorial rounded-card-lg">
          <div className="flex justify-between pb-12 border-b border-border-light-medium">
            <div>
              <p className="font-display mb-2 text-[11px] tracking-wide text-text-dark-secondary uppercase">
                Monitor Plus
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-none text-text-dark-primary font-display">
                Your systems at a glance.
              </h1>
            </div>
            <div className="flex items-end-safe gap-2">
              <div className="flex items-center gap-2">
                <motion.span
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                    repeat: Infinity,
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-coral"
                />
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-dark-secondary font-display">
                  realtime telementry
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-12 bg-canvas text-text-light-primary rounded-[20px] sm:rounded-[24px] p-6 sm:p-10 border border-border-dark-strong shadow-xl">
            <div className="pb-6 mb-6 border-b border-border-dark-medium">
              <div className="flex items-center gap-2 mb-1">
                <TriangleAlert
                  size={14}
                  color="#ff5a5f"
                  strokeWidth={1.5}
                  className="mb-1"
                />
                <p className="text-coral font-display text-xs uppercase">
                  Your Api health
                </p>
              </div>
              <h1 className="font-display text-3xl font-extrabold">
                Everything looks good.
              </h1>
            </div>
            <div>
              {examplApi.map((api) => {
                return (
                  <div className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-white/2 px-3 -mx-3 rounded-xl transition-colors cursor-pointer border-b border-border-dark-medium">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2.5 w-2.5 rounded-full  ${api.status ? "bg-healthy shadow shadow-healthy" : "bg-down shadow shadow-down"}`}
                      />
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-[#F5F3EE] group-hover:text-coral transition-colors flex items-center gap-2">
                          {api.name}
                        </h3>
                        <p className="text-xs font-mono text-text-dark-muted mt-0.5">
                          {api.url}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 font-mono text-text-light-primary">
                      <p>{api.latency}</p>
                      <span>ms</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      
    </>
  );
};

export default ProductSection;
