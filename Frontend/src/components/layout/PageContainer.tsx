import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  return (
    <div className={`mx-auto w-full max-w-[1280px] px-[48px] ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
