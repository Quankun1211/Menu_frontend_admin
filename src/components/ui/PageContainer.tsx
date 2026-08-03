import type { ReactNode } from 'react';
import { Breadcrumb } from 'antd';
import { useNavigate } from 'react-router';

interface BreadcrumbItem {
  title: string;
  link?: string;
}

interface PageContainerProps {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
}

const PageContainer = ({ title, description, actions, children, breadcrumbItems }: PageContainerProps) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${breadcrumbItems ? "mb-2" : "mb-6"}`}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">{actions}</div>
      </div>
      
      {breadcrumbItems && (
        <Breadcrumb 
          className="mb-10"
          items={breadcrumbItems.map((item) => ({
            title: item.link ? (
              <span 
                className="cursor-pointer hover:text-blue-600" 
                onClick={() => navigate(item.link!)}
              >
                {item.title}
              </span>
            ) : (
              <span className="text-gray-500">{item.title}</span>
            )
          }))}
        />
      )}

      <div className={`bg-white p-4 sm:p-6 ${breadcrumbItems && "mt-4"} rounded-2xl border border-slate-200 shadow-sm`}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
