import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Select, Upload, Row, Col, Form, InputNumber, message, Spin } from 'antd';
import { InboxOutlined, LeftOutlined, SaveOutlined } from '@ant-design/icons';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllAvailableSale from '../hooks/useGetAllAvailableSale';
import useGetProductDetail from '../hooks/useGetProductDetail';
import useUpdateProduct from '../hooks/useUpdateProduct';

const { TextArea } = Input;
const { Dragger } = Upload;

export default function EditSpecialtyPage() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { data: productData, isLoading: isFetching } = useGetProductDetail(id!);
  const { updateProduct, isUpdating } = useUpdateProduct();
  const { data: sales } = useGetAllAvailableSale();

  useEffect(() => {
    if (productData?.data) {
      const p = productData.data;
      form.setFieldsValue({
        ...p,
        salePercent: p.salePercent?._id || p.salePercent,
        calories: p.nutrition?.calories,
        protein: p.nutrition?.protein,
        fat: p.nutrition?.fat,
        carbs: p.nutrition?.carbs,
        image: p.image ? [{
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: p.image,
        }] : [],
      });
    }
  }, [productData, form]);

  const onFinish = (values: any) => {
    const formData = new FormData();
    
    formData.append('name', values.name);
    formData.append('price', String(values.price));
    formData.append('unit', values.unit);
    formData.append('description', values.description);
    formData.append('stock', String(values.stock));
    formData.append('region', values.region);
    formData.append('isSpecialty', "true");
    
    if (values.salePercent) formData.append('salePercent', values.salePercent);

    formData.append('origin', values.origin);
    formData.append('originDescription', values.originDescription || "");
    formData.append('originFound', values.originFound || "");
    formData.append('story', values.story);

    formData.append('nutrition', JSON.stringify({
      calories: Number(values.calories) || 0,
      protein: Number(values.protein) || 0,
      fat: Number(values.fat) || 0,
      carbs: Number(values.carbs) || 0,
    }));
    formData.append('season', JSON.stringify(values.season || []));
    formData.append('usage_instruction', JSON.stringify(values.usage_instruction || []));

    if (values.image?.fileList?.[0]?.originFileObj) {
      formData.append('image', values.image.fileList[0].originFileObj);
    }

    updateProduct({ 
        id: id!, 
        data: formData 
    }, {
    onSuccess: () => {
        navigate('/manage/list/specials');
    }
    });
  };

  if (isFetching) return <div className="p-20 text-center"><Spin size="large" /></div>;

  return (
    <PageContainer
      title="Chỉnh sửa đặc sản"
      actions={<Button icon={<LeftOutlined />} onClick={() => navigate(-1)}>Quay lại</Button>}
      breadcrumbItems={[
        { title: 'Sản phẩm', link: '/manage/list/products' },
        { title: 'Chỉnh sửa đặc sản' }
      ]}
      description=''
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="grid grid-cols-1 gap-6">
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">1. Thông tin chung</h2>
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item name="name" label="Tên đặc sản" rules={[{ required: true, message: 'Nhập tên' }]}>
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="unit" label="Đơn vị tính" rules={[{ required: true }]}>
                  <Input size="large" placeholder="Vd: kg, túi..." />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label="Mô tả tóm tắt" rules={[{ required: true }]}>
              <TextArea rows={3} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="region" label="Vùng miền" rules={[{ required: true }]}>
                  <Select size="large">
                    <Select.Option value="bac">Miền Bắc</Select.Option>
                    <Select.Option value="trung">Miền Trung</Select.Option>
                    <Select.Option value="nam">Miền Nam</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="salePercent" label="Đợt giảm giá">
                  <Select size="large" placeholder="Chọn đợt sale" allowClear>
                    {sales?.data?.map((s: any) => (
                      <Select.Option key={s._id} value={s._id}>{s.name} ({s.percent}%)</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="season" label="Mùa vụ">
                  <Select size="large" mode="tags" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-indigo-900">2. Nguồn gốc & Câu chuyện sản vật</h2>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="origin" label="Địa danh gốc" rules={[{ required: true, message: 'Nhập xuất xứ' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="originFound" label="Nơi sản xuất">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="originDescription" label="Mô tả vùng nguyên liệu">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="story" label="Câu chuyện sản vật" rules={[{ required: true }]}>
              <TextArea rows={4} placeholder="Lịch sử và ý nghĩa..." />
            </Form.Item>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">3. Thông số thương mại</h2>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="price" label="Giá bán (đ)" rules={[{ required: true }]}>
                  <InputNumber className="w-full" size="large" min={0} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="stock" label="Tồn kho" rules={[{ required: true }]}>
                  <InputNumber className="w-full" size="large" min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="usage_instruction" label="Hướng dẫn sử dụng">
                  <Select mode="tags" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">4. Dinh dưỡng & Hình ảnh</h2>
            <Row gutter={24}>
              <Col span={12}>
                <div className="grid grid-cols-2 gap-x-4">
                  <Form.Item name="calories" label="Calo (kcal)"><InputNumber className="w-full" /></Form.Item>
                  <Form.Item name="protein" label="Đạm (g)"><InputNumber className="w-full" /></Form.Item>
                  <Form.Item name="fat" label="Béo (g)"><InputNumber className="w-full" /></Form.Item>
                  <Form.Item name="carbs" label="Carbs (g)"><InputNumber className="w-full" /></Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <Form.Item name="image" label="Ảnh đặc sản" valuePropName="fileList" getValueFromEvent={(e: any) => Array.isArray(e) ? e : e?.fileList}>
                  <Dragger beforeUpload={() => false} maxCount={1} listType="picture" accept="image/*">
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Kéo thả để thay đổi ảnh</p>
                  </Dragger>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 pb-10">
          <Button size="large" onClick={() => navigate(-1)}>Hủy bỏ</Button>
          <Button size="large" type="primary" icon={<SaveOutlined />} loading={isUpdating} onClick={() => form.submit()}>
            Lưu thay đổi đặc sản
          </Button>
        </div>
      </Form>
    </PageContainer>
  );
}