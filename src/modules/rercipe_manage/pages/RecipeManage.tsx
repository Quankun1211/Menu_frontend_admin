import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Tag, Space, Modal, Select, Avatar } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  PoweroffOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllRecipes from '../hooks/useGetAllRecipe';
import useDeleteRecipe from '../hooks/useDeleteRecipe';
import useActiveRecipe from '../hooks/useActiveRecipe';
import type { RecipeResponse } from '../types/api-response';

const { Option } = Select;

const RecipeManage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    difficulty: '',
    weatherTag: '',
  });

  const { data: recipes, isPending } = useGetAllRecipes({
    page,
    limit,
    search,
    ...filters,
  });

  const { deleteRecipe, isDeleting } = useDeleteRecipe();
  const { activeRecipe, isActivating } = useActiveRecipe();

  // Vô hiệu hóa công thức
  const handleDelete = (record: RecipeResponse) => {
    Modal.confirm({
      title: 'Xác nhận vô hiệu hóa công thức',
      content: (
        <span>
          Bạn có chắc chắn muốn vô hiệu hóa công thức{' '}
          <strong>"{record.name}"</strong>?
          <br />
          Công thức sẽ không còn được sử dụng trong hệ thống nhưng có thể
          kích hoạt lại sau.
        </span>
      ),
      okText: 'Vô hiệu hóa',
      cancelText: 'Hủy',
      okButtonProps: {
        danger: true,
        loading: isDeleting,
      },
      onOk: () => deleteRecipe(record._id),
    });
  };

  // Kích hoạt lại công thức
  const handleActive = (record: RecipeResponse) => {
    Modal.confirm({
      title: 'Xác nhận kích hoạt công thức',
      content: (
        <span>
          Bạn có chắc chắn muốn kích hoạt lại công thức{' '}
          <strong>"{record.name}"</strong>?
        </span>
      ),
      okText: 'Kích hoạt',
      cancelText: 'Hủy',
      okButtonProps: {
        loading: isActivating,
      },
      onOk: () => activeRecipe(record._id),
    });
  };

  const columns = [
    {
      title: 'HÌNH ẢNH',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (img: string) => (
        <Avatar
          src={img}
          shape="square"
          size={64}
          icon={<InboxOutlined />}
        />
      ),
    },

    {
      title: 'TÊN CÔNG THỨC',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: RecipeResponse) => (
        <div>
          <div className="font-bold text-gray-800">{text}</div>

          <Tag
            className="mt-1"
            color={record.isDeleted ? 'red' : 'green'}
          >
            {record.isDeleted ? 'Đã vô hiệu hóa' : 'Đang hoạt động'}
          </Tag>
        </div>
      ),
    },

    {
      title: 'ĐỘ KHÓ',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (diff: string) => {
        const color =
          diff === 'Dễ'
            ? 'green'
            : diff === 'Trung bình'
              ? 'blue'
              : 'volcano';

        return (
          <Tag color={color}>
            {diff.toUpperCase()}
          </Tag>
        );
      },
    },

    {
      title: 'THỜI GIAN',
      dataIndex: 'cookTime',
      key: 'cookTime',
      render: (time: number) => `${time} phút`,
    },

    {
      title: 'THỜI TIẾT',
      dataIndex: 'weatherTag',
      key: 'weatherTag',
      render: (tag: string) => {
        const icons: Record<string, string> = {
          hot: '☀️',
          cold: '❄️',
          rainy: '🌧️',
          neutral: '☁️',
        };

        const labels: Record<string, string> = {
          hot: 'Nóng',
          cold: 'Lạnh',
          rainy: 'Mưa',
          neutral: 'Trung hòa',
        };

        return (
          <span>
            {icons[tag] || '☁️'} {labels[tag] || tag}
          </span>
        );
      },
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'action',
      width: 230,
      render: (_: unknown, record: RecipeResponse) => {
        const isActive = record.isDeleted !== true;

        return (
          <Space size="middle">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() =>
                navigate(`/recipes/edit/${record._id}`)
              }
            >
              Sửa
            </Button>

            <Button
              type="text"
              danger={isActive}
              icon={
                isActive
                  ? <PoweroffOutlined />
                  : <CheckCircleOutlined />
              }
              loading={isActive ? isDeleting : isActivating}
              title={
                isActive
                  ? 'Vô hiệu hóa công thức'
                  : 'Kích hoạt lại công thức'
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
      title="Quản lý công thức nấu ăn"
      description="Xem, tìm kiếm và quản lý trạng thái các công thức trong hệ thống."
      actions={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate('/recipes/add')}
        >
          Thêm công thức
        </Button>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex gap-3">
          <Input
            placeholder="Tìm tên món ăn..."
            prefix={
              <SearchOutlined className="text-gray-400" />
            }
            style={{ width: 250 }}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            allowClear
          />

          <Select
            placeholder="Độ khó"
            style={{ width: 130 }}
            allowClear
            onChange={(val) => {
              setFilters((prev) => ({
                ...prev,
                difficulty: val || '',
              }));
              setPage(1);
            }}
          >
            <Option value="Dễ">Dễ</Option>
            <Option value="Trung bình">Trung bình</Option>
            <Option value="Khó">Khó</Option>
          </Select>

          <Select
            placeholder="Thời tiết"
            style={{ width: 130 }}
            allowClear
            onChange={(val) => {
              setFilters((prev) => ({
                ...prev,
                weatherTag: val || '',
              }));
              setPage(1);
            }}
          >
            <Option value="hot">Nóng</Option>
            <Option value="cold">Lạnh</Option>
            <Option value="rainy">Mưa</Option>
            <Option value="neutral">Trung hòa</Option>
          </Select>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={recipes?.data || []}
        loading={isPending}
        rowKey="_id"
        pagination={{
          current: page,
          pageSize: limit,
          total: recipes?.meta?.total || 0,
          onChange: (p, s) => {
            setPage(p);
            setLimit(s);
          },
        }}
      />
    </PageContainer>
  );
};

export default RecipeManage;