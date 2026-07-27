import { Link } from "react-router-dom";
import { Card, Col, Row, Typography } from "antd";
import { AppstoreOutlined, ShoppingCartOutlined, TruckOutlined, UserOutlined } from "@ant-design/icons";

const Dashboard = () => {
  const shortcuts = [
    { title: "Đơn hàng", description: "Theo dõi và xử lý đơn hàng", path: "/order", icon: <ShoppingCartOutlined /> },
    { title: "Sản phẩm", description: "Quản lý sản phẩm và đặc sản", path: "/manage/list/products", icon: <AppstoreOutlined /> },
    { title: "Tài khoản", description: "Quản lý người dùng và nhân sự", path: "/users", icon: <UserOutlined /> },
    { title: "Phí vận chuyển", description: "Cấu hình phí áp dụng cho đơn mới", path: "/settings/shipping", icon: <TruckOutlined /> },
  ];

  return (
    <div className="p-6">
      <Typography.Title level={2}>Bảng điều khiển</Typography.Title>
      <Typography.Paragraph type="secondary">
        Truy cập nhanh các nghiệp vụ quản trị chính.
      </Typography.Paragraph>
      <Row gutter={[16, 16]} className="mt-6">
        {shortcuts.map((item) => (
          <Col xs={24} md={12} xl={6} key={item.path}>
            <Link to={item.path}>
              <Card hoverable className="h-full">
                <div className="mb-4 text-3xl text-blue-600">{item.icon}</div>
                <Typography.Title level={4}>{item.title}</Typography.Title>
                <Typography.Text type="secondary">{item.description}</Typography.Text>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard
