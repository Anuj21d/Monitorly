import { useState } from "react";
import Button from "../components/Button";

type ApiData = {
  name: string;
  url: string;
};

const exampleButton: ApiData[] = [
  {
    name: "GitHub Status",
    url: "https://www.githubstatus.com/api/v2/status.json",
  },
  {
    name: "Cloudflare Trace",
    url: "https://www.cloudflare.com/cdn-cgi/trace",
  },
  {
    name: "Payment API",
    url: "https://api.example.com/health",
  },
];

const DemoAPI = () => {
  const [apiData, setApiData] = useState<ApiData>(() => {
    const saved = localStorage.getItem("apiData");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Payment API",
          url: "https://api.example.com/health",
        };
  });

  return (
    <section
      id="example"
      className="scroll-mt-20 py-20 md:py-32 px-6 lg:px-12 max-w-7xl mx-auto border-t border-border-dark-subtle"
    >
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
          <p className="text-base sm:text-lg text-neutral leading-relaxed">
            No agents to install. No complex config files. PulseCheck provisions
            edge synthetic probes across Frankfurt, North Virginia, and
            Singapore in under 5 seconds.
          </p>
          <div className="mt-8 pt-6 border-t border-white/8">
            <div className="text-xs font-mono text-text-light-muted mb-3 uppercase tracking-wider">
              Quick test templates:
            </div>
            <div className="flex flex-wrap gap-2">
              {exampleButton.map((button, index) => {
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setApiData(button);
                      localStorage.setItem("apiData", JSON.stringify(button));
                    }}
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
                  value={apiData.name}
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
                  value={apiData.url}
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
  );
};

export default DemoAPI;
