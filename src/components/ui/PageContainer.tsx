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
    <div className="p-6">
      <div className={`flex justify-between items-center ${breadcrumbItems ? "mb-2" : "mb-6"}`}>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-500">{description}</p>
        </div>
        <div className="flex gap-3">{actions}</div>
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

      <div className={`bg-white p-6 ${breadcrumbItems && "mt-4"} rounded-xl border border-gray-100 shadow-sm`}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;