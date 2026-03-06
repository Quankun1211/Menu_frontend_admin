import React, { useState } from 'react';
import { Button, Input, Select, Upload, Row, Col, Radio, Form, InputNumber, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllCategory from '../../category_manage/hooks/useGetAllCategory';
import useGetAllAvailableSale from '../hooks/useGetAllAvailableSale';
import useCreateProduct from '../hooks/useCreateProduct'; 

const { TextArea } = Input;
const { Dragger } = Upload;

export default function AddProductPage() {
  const [form] = Form.useForm();
  const [isSpecialty, setIsSpecialty] = useState(false);

  const { data: categories } = useGetAllCategory({ 
    page: 1, 
    limit: 100, 
    type: 'product' 
  });
  const { data: sales } = useGetAllAvailableSale();
  
  const { createProduct, isCreating } = useCreateProduct();

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
    } else {
      return message.error("Vui lòng tải lên hình ảnh sản phẩm");
    }

    createProduct(formData);
  };

  return (
    <PageContainer
      title="Thêm sản phẩm mới"
      description="Nhập thông tin sản phẩm hoặc đặc sản vùng miền để cập nhật vào hệ thống."
      breadcrumbItems={[
        { title: 'Sản phẩm', link: '/manage/list/products' },
        { title: 'Thêm mới' }
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ region: 'bac', price: 0, stock: 0, isSpecialty: false }}
      >
        <div className="grid grid-cols-1 gap-6">
          {/* LOẠI SẢN PHẨM */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Loại sản phẩm</h2>
            <Form.Item name="isSpecialty" className="mb-0">
              <Radio.Group 
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
                <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                  <Input size="large" placeholder="Vd: Su su Tam Đảo..." />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="unit" label="Đơn vị tính" rules={[{ required: true, message: 'Vd: kg, hộp...' }]}>
                  <Input size="large" placeholder="kg, túi, chai..." />
                </Form.Item>
              </Col>
              <Col span={6}>
                {!isSpecialty && (
                  <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true, message: 'Chọn danh mục' }]}>
                    <Select size="large" placeholder="Chọn danh mục" allowClear>
                      {categories?.data?.map((cat: any) => (
                        <Select.Option key={cat._id} value={cat._id}>{cat.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Col>
            </Row>

            <Form.Item name="description" label="Mô tả sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
              <TextArea rows={3} placeholder="Mô tả tóm tắt đặc điểm sản phẩm..." />
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
                  <Select size="large" placeholder="Chọn đợt sale" allowClear>
                    {sales?.data?.map((s: any) => (
                      <Select.Option key={s._id} value={s._id}>
                        {s.name} ({s.percent}%)
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="season" label="Mùa vụ">
                  <Select size="large" mode="tags" placeholder="Vd: Quanh năm, Mùa Thu" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className={`p-6 rounded-xl border shadow-sm transition-colors duration-300 ${isSpecialty ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-200'}`}>
            <h2 className={`text-lg font-semibold mb-4 ${isSpecialty ? 'text-indigo-900' : 'text-gray-800'}`}>
              2. Nguồn gốc & Câu chuyện {isSpecialty && <span className="text-red-500 text-sm ml-2">(Bắt buộc cho đặc sản)</span>}
            </h2>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="origin" label="Địa danh gốc" rules={[{ required: isSpecialty, message: 'Nhập xuất xứ' }]}>
                  <Input placeholder="Vd: Tam Đảo, Vĩnh Phúc" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="originFound" label="Nơi sản xuất/Tìm thấy">
                  <Input placeholder="Vd: Vườn quốc gia..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="originDescription" label="Mô tả vùng nguyên liệu">
                  <Input placeholder="Vd: Đất đỏ bazan, khí hậu núi cao..." />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="story" label="Câu chuyện sản vật" rules={[{ required: isSpecialty, message: 'Vui lòng kể câu chuyện' }]}>
              <TextArea rows={2} placeholder="Viết về lịch sử, ý nghĩa của sản phẩm này..." />
            </Form.Item>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">3. Thông số thương mại</h2>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="price" label="Giá bán (đ)" rules={[{ required: true, message: 'Nhập giá' }]}>
                  <InputNumber 
                    className="w-full" 
                    size="large" 
                    min={0}
                    formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="stock" label="Tồn kho" rules={[{ required: true, message: 'Nhập tồn kho' }]}>
                  <InputNumber className="w-full" size="large" min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="usage_instruction" label="Hướng dẫn sử dụng (Nhập bước 1 -> Enter -> Nhập bước 2)">
                  <Select mode="tags" size="large" placeholder="Vd: Rửa sạch, Nấu chín 10 phút..." />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">4. Dinh dưỡng & Hình ảnh</h2>
            <Row gutter={24}>
              <Col span={12}>
                <div className="grid grid-cols-2 gap-x-4">
                  <Form.Item name="calories" label="Calo (kcal)"><InputNumber className="w-full" min={0} /></Form.Item>
                  <Form.Item name="protein" label="Đạm (g)"><InputNumber className="w-full" min={0} /></Form.Item>
                  <Form.Item name="fat" label="Béo (g)"><InputNumber className="w-full" min={0} /></Form.Item>
                  <Form.Item name="carbs" label="Carbs (g)"><InputNumber className="w-full" min={0} /></Form.Item>
                </div>
              </Col>
              <Col span={12}>
                <Form.Item name="image" label="Ảnh sản phẩm (Bắt buộc)" rules={[{ required: true, message: 'Tải ảnh lên' }]}>
                  <Dragger 
                    beforeUpload={() => false} 
                    maxCount={1} 
                    listType="picture"
                    accept="image/*"
                  >
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text text-sm font-medium">Kéo thả ảnh hoặc click để chọn</p>
                    <p className="ant-upload-hint text-xs">Hỗ trợ định dạng .jpg, .png, .webp</p>
                  </Dragger>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 pb-10">
          <Button size="large" disabled={isCreating} onClick={() => form.resetFields()}>
            Hủy bỏ
          </Button>
          <Button 
            size="large" 
            type="primary" 
            loading={isCreating} 
            onClick={() => form.submit()}
          >
            {isCreating ? 'Đang lưu hệ thống...' : 'Xác nhận tạo sản phẩm'}
          </Button>
        </div>
      </Form>
    </PageContainer>
  );
}