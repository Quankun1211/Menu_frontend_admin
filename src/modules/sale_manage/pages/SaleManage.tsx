import { useState } from 'react';
import { Table, Button, Tag, Space, Modal, Input, InputNumber, Form, DatePicker, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllSales from '../hooks/useGetAllSale';
import useCreateSale from '../hooks/useCreateSale';
import useUpdateSale from '../hooks/useUpdateSale';
import useDeleteSale from '../hooks/useDeleteSale';
import type { SaleRequest } from '../types/api-request';

const { RangePicker } = DatePicker;

export default function SaleManage() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: sales, isLoading } = useGetAllSales();
  const { createSale, isCreating } = useCreateSale();
  const { updateSale, isUpdating } = useUpdateSale();
  const { deleteSale } = useDeleteSale();

  const showModal = (record?: any) => {
    if (record) {
      setEditingId(record._id);
      form.setFieldsValue({
        name: record.name,
        percent: record.percent,
        range: [dayjs(record.startDate), dayjs(record.endDate)],
        description: record.description,
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleFinish = (values: any) => {
    const payload = {
      percent: values.percent,
      startDate: values.range[0].toISOString(),
      endDate: values.range[1].toISOString(),
    };

    if (editingId) {
      updateSale({ id: editingId, data: payload }, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      createSale(payload, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      render: (_: any, __: any, index: number) => (
        <div className="font-semibold text-gray-800">
          {index + 1}
        </div>
      ),
    },
    {
      title: 'MỨC GIẢM',
      dataIndex: 'percent',
      key: 'percent',
      render: (p: number) => <Tag color="volcano" className="font-bold">{p}%</Tag>,
    },
    {
      title: 'THỜI GIAN',
      key: 'duration',
      render: (record: any) => (
        <div className="text-xs">
          <div>Bắt đầu: {dayjs(record.startDate).format('DD/MM/YYYY')}</div>
          <div>Kết thúc: {dayjs(record.endDate).format('DD/MM/YYYY')}</div>
        </div>
      ),
    },
    {
      title: 'TRẠNG THÁI',
      key: 'status',
      render: (record: any) => {
        const now = dayjs();
        if (now.isBefore(dayjs(record.startDate))) return <Tag color="blue">SẮP DIỄN RA</Tag>;
        if (now.isAfter(dayjs(record.endDate))) return <Tag color="default">ĐÃ KẾT THÚC</Tag>;
        return <Tag color="green">ĐANG DIỄN RA</Tag>;
      },
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => {
              Modal.confirm({
                title: 'Xóa chương trình sale?',
                content: 'Hành động này sẽ gỡ giảm giá khỏi các sản phẩm liên quan.',
                onOk: () => deleteSale(record._id),
              });
            }} 
          />
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="Quản lý giảm giá"
      description="Tạo và điều chỉnh các chương trình khuyến mãi cho hệ thống."
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Tạo đợt Sale mới
        </Button>
      }
    >
      <Table 
        columns={columns} 
        dataSource={sales?.data} 
        loading={isLoading} 
        rowKey="_id"
      />

      <Modal
        title={editingId ? "Chỉnh sửa đợt Sale" : "Thêm đợt Sale mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating || isUpdating}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="percent" label="Phần trăm giảm (%)" rules={[{ required: true }]}>
              <InputNumber min={1} max={100} className="w-full" />
            </Form.Item>
            <Form.Item name="range" label="Thời gian áp dụng" rules={[{ required: true }]}>
              <RangePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Mô tả tóm tắt">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}