import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Image,
  Typography,
  Select,
  Modal,
} from 'antd';
import {
  PlusOutlined,
  PoweroffOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllMenu from '../hooks/useGetAllMenu';
import useGetAllCategory from '../../category_manage/hooks/useGetAllCategory';
import useDeleteMenu from '../hooks/useDeleteMenu';
import useActiveMenu from '../hooks/useActiveMenu';
import type { MenuResponse } from '../types/api-response';

const { Text } = Typography;

export default function MenuListPage() {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >(undefined);

  const { data: allCategory, isPending } = useGetAllCategory({
    page: 1,
    limit: 100,
    type: 'menu',
  });

  const { deleteMenu, isDeleting } = useDeleteMenu();

  const { activeMenu, isActivating } = useActiveMenu();

  const { data: response, isLoading } = useGetAllMenu({
    page: pagination.page,
    limit: pagination.limit,
    category: selectedCategory,
  });

  const handleTableChange = (newPagination: any) => {
    setPagination({
      page: newPagination.current,
      limit: newPagination.pageSize,
    });
  };

  const handleCategoryChange = (value: string | undefined) => {
    setSelectedCategory(value);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleDelete = (record: MenuResponse) => {
    Modal.confirm({
      title: 'Xác nhận vô hiệu hóa thực đơn',
      content: (
        <span>
          Bạn có chắc chắn muốn vô hiệu hóa thực đơn{' '}
          <strong>"{record.title}"</strong>?
          <br />
          Thực đơn sẽ được ẩn khỏi hệ thống nhưng có thể kích hoạt lại sau.
        </span>
      ),
      okText: 'Vô hiệu hóa',
      cancelText: 'Hủy',
      okButtonProps: {
        danger: true,
        loading: isDeleting,
      },
      onOk: () => deleteMenu(record._id),
    });
  };

  const handleActive = (record: MenuResponse) => {
    Modal.confirm({
      title: 'Xác nhận kích hoạt thực đơn',
      content: (
        <span>
          Bạn có chắc chắn muốn kích hoạt lại thực đơn{' '}
          <strong>"{record.title}"</strong>?
        </span>
      ),
      okText: 'Kích hoạt',
      cancelText: 'Hủy',
      okButtonProps: {
        loading: isActivating,
      },
      onOk: () => activeMenu(record._id),
    });
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (src: string) => (
        <Image
          src={src}
          width={60}
          height={60}
          className="rounded-md object-cover"
        />
      ),
    },

    {
      title: 'Tiêu đề Menu',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: MenuResponse) => {
        const isActive = record.isDeleted == false;

        return (
          <div className="flex flex-col">
            <Text strong>{text}</Text>

            <div className="flex items-center gap-2 mt-1">
              <Tag color="purple" className="w-fit">
                {record.category?.name || 'Chưa phân loại'}
              </Tag>

              <Tag
                color={isActive ? 'green' : 'red'}
                className="w-fit"
              >
                {isActive ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
              </Tag>
            </div>
          </div>
        );
      },
    },

    {
      title: 'Thông tin nấu',
      key: 'meta',
      render: (record: MenuResponse) => (
        <div className="text-xs">
          <div>⏱ {record.cookTime} phút</div>
          <div>👥 {record.meta?.servings} người</div>
        </div>
      ),
    },

    {
      title: 'Thao tác',
      key: 'action',
      width: 220,
      render: (record: MenuResponse) => {
        const isActive = record.isDeleted == false;
        
        return (
          <Space size="middle">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() =>
                navigate(`/menus/edit/${record._id}`)
              }
            >
              Sửa
            </Button>

            <Button
              type="text"
              danger={isActive}
              icon={
                isActive ? (
                  <PoweroffOutlined />
                ) : (
                  <CheckCircleOutlined />
                )
              }
              loading={isActive ? isDeleting : isActivating}
              title={
                isActive
                  ? 'Vô hiệu hóa thực đơn'
                  : 'Kích hoạt lại thực đơn'
              }
              onClick={() => {
                if (isActive) {
                  handleDelete(record);
                } else {
                  handleActive(record);
                }
              }}
            >
              {isActive ? 'Ẩn' : 'Kích hoạt'}
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer
      title="Quản lý thực đơn"
      description="Quản lý thông tin, danh mục và trạng thái các thực đơn trong hệ thống."
      actions={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/menus/add')}
        >
          Thêm Menu mới
        </Button>
      }
    >
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-4 flex items-center gap-2">
          <Text strong>Lọc theo danh mục:</Text>

          <Select
            placeholder="Tất cả danh mục"
            allowClear
            className="w-64"
            onChange={handleCategoryChange}
            options={
              allCategory?.data?.map((cat: any) => ({
                label: cat.name,
                value: cat._id,
              })) ?? []
            }
          />
        </div>

        <Table
          columns={columns}
          dataSource={response?.data || []}
          rowKey="_id"
          loading={isLoading || isPending}
          onChange={handleTableChange}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: response?.meta?.total || 0,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
            showTotal: (total) => `Tổng ${total} thực đơn`,
          }}
        />
      </div>
    </PageContainer>
  );
}