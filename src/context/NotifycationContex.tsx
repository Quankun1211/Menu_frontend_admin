import { notification } from "antd";
import { createContext, useContext } from "react";
import type { NotificationInstance } from "antd/es/notification/interface";

const NotificationContext = createContext({
  api: null as unknown as NotificationInstance,
  contextHolder: null as unknown as React.ReactNode,
});

function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [api, contextHolder] = notification.useNotification({
    top: 60,
  });
  
  if (!api) return <>{children}</>;

  return (
    <NotificationContext.Provider value={{ api, contextHolder }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
export function useNotification() {
  return useContext(NotificationContext);
}
