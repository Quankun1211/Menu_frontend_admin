import React, { useState } from 'react';
import { Table, Button, Space, Tag, Image, Typography, Select, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllMenu from '../hooks/useGetAllMenu';
import dayjs from 'dayjs';
import useGetAllCategory from '../../category_manage/hooks/useGetAllCategory';
import useDeleteMenu from '../hooks/useDeleteMenu';
import type { MenuResponse } from '../types/api-response';

const { Text } = Typography;

export default function MenuListPage() {
    const navigate = useNavigate();
    
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10
    });
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

    const { data: allCategory, isPending } = useGetAllCategory({ 
        page: 1, 
        limit: 1000, 
        type: "menu", 
    });

    const { deleteMenu, isDeleting } = useDeleteMenu()

    const { data: response, isLoading } = useGetAllMenu({
        page: pagination.page,
        limit: pagination.limit,
        category: selectedCategory 
    });
    console.log(response?.data);
    

    const handleTableChange = (newPagination: any) => {
        setPagination({
            page: newPagination.current,
            limit: newPagination.pageSize
        });
    };

    const handleCategoryChange = (value: string | undefined) => { 
        setSelectedCategory(value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleDelete = (record: any) => {
        console.log(record);
        
        Modal.confirm({
            title: 'Xác nhận xóa thực đơn',
            content: `Bạn có chắc chắn muốn xóa "${record.title}"? Hành động này không thể hoàn tác.`,
            okText: 'Xóa',
            okButtonProps: { danger: true, loading: isDeleting },
            onOk: () => deleteMenu(record._id),
        });
    };

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            width: 100,
            render: (src: string) => <Image src={src} width={60} height={60} className="rounded-md object-cover" />
        },
        {
            title: 'Tiêu đề Menu',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: MenuResponse) => (
                <div className="flex flex-col">
                    <Text strong>{text}</Text>
                    <Tag color="purple" className="w-fit mt-1">{record.category?.name || 'Chưa phân loại'}</Tag>
                </div>
            )
        },
        {
            title: 'Thông tin nấu',
            key: 'meta',
            render: (record: MenuResponse) => (
                <div className="text-xs">
                    <div>⏱ {record.cookTime} phút</div>
                    <div>👥 {record.meta?.servings} người</div>
                </div>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: MenuResponse) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => navigate(`/menus/edit/${record._id}`)} />
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}/>
                </Space>
            ),
        },
    ];

    return (
        <PageContainer
            title="Quản lý thực đơn"
            actions={
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/menus/add')}>
                    Thêm Menu mới
                </Button>
            }
            description=''
        >
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="mb-4 flex items-center gap-2">
                    <Text strong>Lọc theo danh mục:</Text>
                    <Select
                        placeholder="Tất cả danh mục"
                        allowClear
                        className="w-64"
                        onChange={handleCategoryChange}
                        options={allCategory?.data?.map((cat: any) => ({
                            label: cat.name,
                            value: cat._id
                        })) ?? []} 
                    />
                </div>

                <Table 
                    columns={columns} 
                    dataSource={response?.data || []} 
                    rowKey="_id" 
                    loading={isLoading}
                    onChange={handleTableChange}
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.limit,
                        total: response?.meta?.total || 0,
                    }}
                />
            </div>
        </PageContainer>
    );
}