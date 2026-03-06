import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Tag, Space, Modal, Select, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FilterOutlined, InboxOutlined } from '@ant-design/icons';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllRecipes from '../hooks/useGetAllRecipe';
import useDeleteRecipe from '../hooks/useDeleteRecipe';
import type { RecipeResponse } from '../types/api-response';

const { Option } = Select;

const RecipeManage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ difficulty: '', weatherTag: '' });

  const { data: recipes, isPending } = useGetAllRecipes({ 
    page, 
    limit, 
    search, 
    ...filters 
  });
  
  const { deleteRecipe, isDeleting } = useDeleteRecipe();

  const handleDelete = (record: RecipeResponse) => {
    Modal.confirm({
      title: 'Xác nhận xóa công thức',
      content: `Bạn có chắc chắn muốn xóa "${record.name}"? Hành động này không thể hoàn tác.`,
      okText: 'Xóa',
      okButtonProps: { danger: true, loading: isDeleting },
      onOk: () => deleteRecipe(record._id),
    });
  };

  const columns = [
    {
      title: 'HÌNH ẢNH',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (img: string) => <Avatar src={img} shape="square" size={64} icon={<InboxOutlined />} />,
    },
    {
      title: 'TÊN CÔNG THỨC',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: RecipeResponse) => (
        <div>
          <div className="font-bold text-gray-800">{text}</div>
        </div>
      ),
    },
    {
      title: 'ĐỘ KHÓ',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (diff: string) => {
        let color = diff === 'Dễ' ? 'green' : diff === 'Trung bình' ? 'blue' : 'volcano';
        return <Tag color={color}>{diff.toUpperCase()}</Tag>;
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
        const icons: any = { hot: '☀️', cold: '❄️', rainy: '🌧️', neutral: '☁️' };
        return <span>{icons[tag] || '☁️'} {tag}</span>;
      },
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'action',
      width: 150,
      render: (_: any, record: RecipeResponse) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/recipes/edit/${record._id}`)}
          >
            Sửa
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="Quản lý công thức nấu ăn"
      description="Xem, tìm kiếm và điều chỉnh các công thức trong hệ thống."
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
            prefix={<SearchOutlined className="text-gray-400" />}
            style={{ width: 250 }}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
          <Select 
            placeholder="Độ khó" 
            style={{ width: 130 }} 
            allowClear
            onChange={(val) => setFilters(prev => ({ ...prev, difficulty: val }))}
          >
            <Option value="Dễ">Dễ</Option>
            <Option value="Trung bình">Trung bình</Option>
            <Option value="Khó">Khó</Option>
          </Select>
          <Select 
            placeholder="Thời tiết" 
            style={{ width: 130 }} 
            allowClear
            onChange={(val) => setFilters(prev => ({ ...prev, weatherTag: val }))}
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
          onChange: (p, s) => { setPage(p); setLimit(s); }
        }}
      />
    </PageContainer>
  );
};

export default RecipeManage;