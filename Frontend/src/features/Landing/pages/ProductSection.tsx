import { TriangleAlert } from "lucide-react";
import { motion } from "motion/react";
import Button from "../components/Button";

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

type Button = {
  name: string;
};

const exampleButton: Button[] = [
  {
    name: "GitHub Status",
  },
  {
    name: "Cloudflare Trace",
  },
  {
    name: "Payment API",
  },
];

const ProductSection = () => {
  return (
    <>
      <section
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
      <section id="product" className="scroll-mt-20 py-20 md:py-32 px-6 lg:px-12 max-w-7xl mx-auto border-t border-border-dark-subtle">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <div className="text-[11px] font-bold tracking-[0.25em] uppercase text-coral mb-4">
              Add Your First Monitor
            </div>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-[-0.04em] leading-[1.0] text-[#F5F3EE] mb-6 text-balance">
              Give us a URL.
              <br />
              We'll watch
              <br />
              the rest.
            </h2>
            <p className="text-base sm:text-lg text-[#888888] leading-relaxed">
              No agents to install. No complex config files. PulseCheck
              provisions edge synthetic probes across Frankfurt, North Virginia,
              and Singapore in under 5 seconds.
            </p>
            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <div className="text-xs font-mono text-[#666666] mb-3 uppercase tracking-wider">
                Quick test templates:
              </div>
              <div className="flex flex-wrap gap-2">
                {exampleButton.map((button) => {
                  return (
                    <button
                      type="button"
                      className="text-xs font-mono px-3 py-1.5 rounded-lg bg-card-dark hover:bg-white/8 text-text-light-secondary hover:text-white border border-white/10 transition-colors"
                    >
                      {button.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="bg-card-dark rounded-[24px] p-6 sm:p-10 border border-white/12 shadow-xl">
              <form action="" className="space-y-6">
                <div>
                  <label
                    htmlFor=""
                    className="block text-xs font-bold tracking-[0.15em] uppercase text-neutral mb-2 font-mono"
                  >
                    Monitor name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-canvas border border-white/12 focus:border-coral rounded-xl px-4 py-3.5 text-text-light-primary placeholder-text-dark-secondary text-base focus:outline-none transition-colors"
                    value="Payment API"
                    placeholder="Payment API"
                  />
                </div>
                <div>
                  <label
                    htmlFor=""
                    className="block text-xs font-bold tracking-[0.15em] uppercase text-neutral mb-2 font-mono"
                  >
                    URL
                  </label>
                  <input
                    type="url"
                    className="w-full bg-canvas border border-white/12 focus:border-coral rounded-xl px-4 py-3.5 text-[#F5F3EE] placeholder-text-dark-secondary text-base font-mono focus:outline-none transition-colors"
                    placeholder="https://api.example.com/health"
                    value="https://api.example.com/health"
                  />
                </div>
                <div className="pt-2">
                  <Button className="w-full" type="submit" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductSection;
