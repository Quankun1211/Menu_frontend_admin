import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Upload, Row, Col, Radio, Form, InputNumber, message, Spin } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllCategory from '../../category_manage/hooks/useGetAllCategory';
import useGetAllAvailableSale from '../hooks/useGetAllAvailableSale';
import useGetProductDetail from '../hooks/useGetProductDetail';
import useUpdateProduct from '../hooks/useUpdateProduct'; 

const { TextArea } = Input;
const { Dragger } = Upload;

export default function EditProductPage() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isSpecialty, setIsSpecialty] = useState(false);

  const { data: product, isLoading: isFetching } = useGetProductDetail(id!);
  const { data: categories } = useGetAllCategory({ page: 1, limit: 100, type: 'product' });
  const { data: sales } = useGetAllAvailableSale();
  const { updateProduct, isUpdating } = useUpdateProduct();

  useEffect(() => {
    if (product?.data) {
      const p = product.data;
      setIsSpecialty(p.isSpecialty);
      
      form.setFieldsValue({
        name: p.name,
        price: p.price,
        unit: p.unit,
        description: p.description,
        stock: p.stock,
        region: p.region,
        categoryId: p.categoryId?._id || p.categoryId,
        salePercent: p.salePercent?._id || p.salePercent,
        origin: p.origin,
        originFound: p.originFound,
        originDescription: p.originDescription,
        story: p.story,
        season: p.season,
        usage_instruction: p.usage_instruction,
        calories: p.nutrition?.calories,
        protein: p.nutrition?.protein,
        fat: p.nutrition?.fat,
        carbs: p.nutrition?.carbs,
      });
    }
  }, [product, form]);

  const onFinish = (values: any) => {
    const formData = new FormData();
    
    formData.append('name', values.name);
    formData.append('price', String(values.price));
    formData.append('unit', values.unit);
    formData.append('description', values.description);
    formData.append('stock', String(values.stock));
    formData.append('region', values.region);
    formData.append('isSpecialty', String(isSpecialty));
    
    if (!isSpecialty && values.categoryId) {
      formData.append('categoryId', values.categoryId);
    }
    if (values.salePercent) {
      formData.append('salePercent', values.salePercent);
    }

    formData.append('origin', values.origin || (isSpecialty ? "" : "Việt Nam"));
    formData.append('originDescription', values.originDescription || "");
    formData.append('originFound', values.originFound || "");
    formData.append('story', values.story || "");

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

    updateProduct({ id: id!, data: formData });
  };

  if (isFetching) return <div className="h-screen flex justify-center items-center"><Spin size="large" /></div>;

  return (
    <PageContainer
      title="Chỉnh sửa sản phẩm"
      description={`Cập nhật thông tin cho: ${product?.data?.name || 'Sản phẩm'}`}
      breadcrumbItems={[
        { title: 'Sản phẩm', link: '/manage/list/products' },
        { title: 'Chỉnh sửa' }
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Loại sản phẩm</h2>
            <Form.Item name="isSpecialty" className="mb-0">
              <Radio.Group 
                value={isSpecialty}
                onChange={(e) => {
                  setIsSpecialty(e.target.value);
                  form.setFieldsValue({ categoryId: undefined }); 
                }}
              >
                <Radio value={false}>Sản phẩm thường</Radio>
                <Radio value={true}>Đặc sản vùng miền</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">1. Thông tin chung</h2>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="unit" label="Đơn vị tính" rules={[{ required: true }]}>
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={6}>
                {!isSpecialty && (
                  <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true }]}>
                    <Select size="large" allowClear>
                      {categories?.data?.map((cat: any) => (
                        <Select.Option key={cat._id} value={cat._id}>{cat.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Col>
            </Row>

            <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
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
                <Form.Item name="salePercent" label="Chương trình giảm giá">
                  <Select size="large" allowClear>
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

          <div className={`p-6 rounded-xl border shadow-sm transition-colors duration-300 ${isSpecialty ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-200'}`}>
            <h2 className={`text-lg font-semibold mb-4 ${isSpecialty ? 'text-indigo-900' : 'text-gray-800'}`}>
              2. Nguồn gốc & Câu chuyện
            </h2>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="origin" label="Địa danh gốc" rules={[{ required: isSpecialty }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="originFound" label="Nơi sản xuất">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="originDescription" label="Mô tả vùng">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="story" label="Câu chuyện" rules={[{ required: isSpecialty }]}>
              <TextArea rows={2} />
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
                  <Form.Item name="calories" label="Calo"><InputNumber className="w-full" /></Form.Item>
                  <Form.Item name="protein" label="Đạm"><InputNumber className="w-full" /></Form.Item>
                  <Form.Item name="fat" label="Béo"><InputNumber className="w-full" /></Form.Item>
                  <Form.Item name="carbs" label="Carbs"><InputNumber className="w-full" /></Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <Form.Item name="image" label="Ảnh sản phẩm (Để trống nếu không muốn đổi)">
                  <Dragger beforeUpload={() => false} maxCount={1} listType="picture" accept="image/*">
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text text-sm">Nhấp hoặc kéo ảnh mới vào đây</p>
                  </Dragger>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 pb-10">
          <Button size="large" onClick={() => form.resetFields()}>Hoàn tác</Button>
          <Button size="large" type="primary" loading={isUpdating} onClick={() => form.submit()}>
            Cập nhật sản phẩm
          </Button>
        </div>
      </Form>
    </PageContainer>
  );
}