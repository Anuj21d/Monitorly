import PageContainer from "./PageContainer";

type Link = {
  name: string;
  link: string;
};

const footerLinks: Link[] = [
  {
    name: "GitHub",
    link: "https://github.com/Anuj21d",
  },
  {
    name: "Linkedin",
    link: "https://www.linkedin.com/in/anuj-dandavate-254482363",
  },
  {
    name: "Email",
    link: "mailto:hello@example.com?subject=Project%20Inquiry",
  },
  {
    name: "WhatsApp",
    link: "https://wa.me/919876543210?text=Hello%20I%20want%20to%20know%20more",
  },
];

const Footer = () => {
  return (
    <footer className="bg-canvas ">
      <PageContainer className="py-16 px-6 border-t border-border-dark-subtle">
        <div className="flex justify-between">
          <div>
            <div className="font-extrabold tracking-tighter text-2xl leading-none text-[#F5F3EE] flex flex-col mb-4">
              <span className="text-text-light-primary font-display font-bold tracking-tighter">
                Monitor
              </span>
              <span className="text-coral font-display font-bold hover:text-text-light-primary tracking-tighter">
                Plus
              </span>
            </div>
            <p className="text-xs max-w-xs text-text-light-muted font-mono">
              High-precision edge API uptime & latency intelligence for modern
              engineering teams.
            </p>
          </div>
          <div className="text-text-dark-muted flex justify-evenly items-end gap-8 font-body text-sm font-semibold">
            {footerLinks.map((ele) => {
              return (
                <a className="hover:text-text-light-primary" href={ele.link} target="_blank" rel="noopener noreferrer">
                  {ele.name}
                </a>
              );
            })}
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border-dark-medium">
          <div className="flex items-center justify-between text-text-dark-secondary text-xs font-mono">
            <p>© 2026 PulseCheck. All rights reserved.</p>
            <div className="flex gap-4">
              <span>Terms of Service</span>
              <span>Privacy Policy</span>
              <span>Security Whitepaper</span>
            </div>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
};

export default Footer;
