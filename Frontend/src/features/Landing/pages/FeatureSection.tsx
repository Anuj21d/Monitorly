type Features = {
  subTitle: string;
  title: string;
  desc: string;
  button: string[];
};

const featuresData: Features[] = [
  {
    subTitle: "Uptime",
    title: "Know when something breaks.",
    desc: "Automatically monitor your endpoints and detect failures. PulseCheck executes continuous, multi-region synthetic probes against your HTTP, REST, GraphQL, and WebSocket infrastructure.",
    button: [
      "Multi-region consensus",
      "Zero false positives",
      "Custom SSL & TLS cert expiry checks",
    ],
  },
  {
    subTitle: "Latency",
    title: "See performance before users complain.",
    desc: "Track response times over time. Spot gradual database connection stalls, regional routing degradation, and memory leaks before they escalate into catastrophic customer outages.",
    button: [
      "P50 / P95 / P99 percentiles",
      "DNS + TCP + TLS breakdown",
      "Payload size inspection",
    ],
  },
  {
    subTitle: "Incidents",
    title: "Every outage tells a story.",
    desc: "Understand when an incident started, how long it lasted, and when it was resolved. Automated timeline reconstruction pairs with instant root-cause diagnostics to give your engineering team instant clarity.",
    button: [
      "Chronological timeline",
      "HTTP response dump",
      "Webhook & Slack dispatch",
    ],
  },
];

const FeatureSection = () => {
  return (
    <section
      id="features"
      className="py-32 px-12 border-t border-border-dark-subtle"
    >
      <div className="mb-24">
        <p className="text-coral font-display text-[11px] uppercase tracking-[0.25em] mb-4">
          why monitor Pulse
        </p>
        <div className="font-display font-extrabold text-7xl">
          Your users shouldn't
          <br />
          be the first people
          <br />
          to discover an outage.
        </div>
      </div>
      <div className="space-y-12 md:space-y-16">
        {featuresData.map((feature, index) => {
          return (
            <div
              className="border-t border-white/12 pt-8 md:pt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              key={index}
            >
              <div className="lg:col-span-2">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tighter text-[#444444]">
                  0{index + 1}
                </span>
              </div>
              <div className="lg:col-span-4">
                <div className="text-xs font-bold tracking-[0.2em] uppercase text-coral mb-2">
                  {feature.subTitle}
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text-light-primary leading-tight">
                  "{feature.title}"
                </h3>
              </div>
              <div className="lg:col-span-6 space-y-4">
                <p className="text-lg text-text-light-secondary leading-relaxed">
                  {feature.desc}
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-text-dark-muted">
                  {feature.button.map((text, id) => {
                    return (
                      <span
                        key={id}
                        className="border border-white/[0.1] px-3 py-1.5 rounded-lg"
                      >
                        {text}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureSection;
