import { useNavigate } from 'react-router-dom';
import { 
  Form, Input, Button, Select, Space, Row, Col, 
  InputNumber, Divider, Card, Upload, message, Switch 
} from 'antd';
import { 
  PlusOutlined, MinusCircleOutlined, LeftOutlined, 
  UploadOutlined, SaveOutlined 
} from '@ant-design/icons';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllProducts from '../../product_manage/hooks/useGetAllProducts';
import useGetAllIngredients from '../hooks/useGetAllIngredient';
import useCreateRecipe from '../hooks/useCreateRecipe';
import useGetAllCategory from '../../category_manage/hooks/useGetAllCategory';
import type { RecipeRequest } from '../types/api-request';

const { TextArea } = Input;

const AddRecipe = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { createRecipe, isCreating } = useCreateRecipe();
  const { data: allProducts } = useGetAllProducts({ page: 1, limit: 1000, status: "in_stock" });
  const { data: ingredients } = useGetAllIngredients({ limit: 1000 });
  const { data: allCategory } = useGetAllCategory({ 
    page: 1, 
    limit: 1000, 
    type: "recipe", 
  });

  const onFinish = (values: any) => {
    const formData = new FormData();
    
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('difficulty', values.difficulty);
    formData.append('weatherTag', values.weatherTag);
    formData.append('cookTime', values.cookTime || 0);
    formData.append('instructionUrl', values.instructionUrl || "");
    formData.append('category', values.category);

    if (values.image && values.image.length > 0) {
      formData.append('image', values.image[0].originFileObj);
    } else {
      return message.error("Vui lòng tải lên ảnh đại diện cho công thức!");
    }

    formData.append('ingredients', JSON.stringify(values.ingredients || []));
    formData.append('instructions', JSON.stringify(values.instructions || []));
    formData.append('additionalIngredients', JSON.stringify(values.additionalIngredients || []));
    formData.append('meta', JSON.stringify({
      ...values.meta,
      isPrepped: values.meta?.isPrepped || false
    }));
    formData.append('tips', JSON.stringify(values.tips || {}));
    formData.append('suggestedSideDishes', JSON.stringify(values.suggestedSideDishes || {}));
    formData.append('isSystem', "true");

    createRecipe(formData, {
      onSuccess: () => {
        message.success("Tạo công thức thành công!");
        navigate('/recipes');
      }
    });
  };

  return (
    <PageContainer 
      title="Thêm công thức mới"
      actions={
        <Button icon={<LeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      }
      description=''
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          difficulty: 'Dễ',
          weatherTag: 'neutral',
          ingredients: [{ itemType: 'Ingredient' }],
          instructions: [{ step: 1 }],
          meta: { servings: "2-3", cookType: "Tự nấu tại nhà", isPrepped: false }
        }}
      >
        <Row gutter={24}>
          <Col span={16}>
            <Card title="Thông tin cơ bản" className="mb-6">
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item name="name" label="Tên công thức" rules={[{ required: true, message: 'Nhập tên món ăn' }]}>
                    <Input placeholder="Vd: Canh chua cá lóc" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Chọn danh mục' }]}>
                    <Select placeholder="Chọn danh mục">
                      {allCategory?.data?.map((cat: any) => (
                        <Select.Option key={cat._id} value={cat._id}>{cat.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="description" label="Mô tả món ăn" rules={[{ required: true, message: 'Nhập mô tả' }]}>
                <TextArea rows={3} placeholder="Mô tả cách thức hoặc hương vị món ăn..." />
              </Form.Item>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="difficulty" label="Độ khó">
                    <Select>
                      <Select.Option value="Dễ">Dễ</Select.Option>
                      <Select.Option value="Trung bình">Trung bình</Select.Option>
                      <Select.Option value="Khó">Khó</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="cookTime" label="Thời gian nấu (phút)">
                    <InputNumber className="w-full" min={1} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="weatherTag" label="Gợi ý thời tiết">
                    <Select>
                      <Select.Option value="neutral">Bình thường</Select.Option>
                      <Select.Option value="hot">Ngày nóng</Select.Option>
                      <Select.Option value="cold">Ngày lạnh</Select.Option>
                      <Select.Option value="rainy">Ngày mưa</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Nguyên liệu (Hệ thống)" className="mb-6">
              <Form.List name="ingredients">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <Form.Item {...restField} name={[name, 'itemType']} rules={[{ required: true }]}>
                          <Select 
                            style={{ width: 120 }} 
                            onChange={() => {
                              form.setFieldValue(['ingredients', name, 'ingredientId'], undefined);
                              form.setFieldValue(['ingredients', name, 'quantity'], 1);
                            }}
                          >
                            <Select.Option value="Ingredient">Nguyên liệu</Select.Option>
                            <Select.Option value="Product">Sản phẩm</Select.Option>
                          </Select>
                        </Form.Item>

                        <Form.Item noStyle shouldUpdate={(prev, curr) => prev.ingredients?.[name]?.itemType !== curr.ingredients?.[name]?.itemType}>
                          {() => (
                            <Form.Item {...restField} name={[name, 'ingredientId']} rules={[{ required: true, message: 'Chọn mục' }]}>
                              <Select showSearch placeholder="Chọn..." style={{ width: 250 }} optionFilterProp="children">
                                {form.getFieldValue(['ingredients', name, 'itemType']) === 'Product'
                                  ? allProducts?.data?.map((p: any) => <Select.Option key={p._id} value={p._id}>{p.name}</Select.Option>)
                                  : ingredients?.data?.map((i: any) => <Select.Option key={i._id} value={i._id}>{i.customName}</Select.Option>)
                                }
                              </Select>
                            </Form.Item>
                          )}
                        </Form.Item>

                        <Form.Item noStyle shouldUpdate={(prev, curr) => prev.ingredients?.[name]?.itemType !== curr.ingredients?.[name]?.itemType}>
                          {() => {
                            const isProduct = form.getFieldValue(['ingredients', name, 'itemType']) === 'Product';
                            
                            const numberProps: any = {
                              placeholder: "SL",
                              style: { width: 80 },
                              min: isProduct ? 1 : 0.0001,
                              step: isProduct ? 1 : 0.1,
                            };

                            if (isProduct) {
                              numberProps.precision = 0;
                            }

                            return (
                              <Form.Item {...restField} name={[name, 'quantity']} rules={[{ required: true }]}>
                                <InputNumber {...numberProps} />
                              </Form.Item>
                            );
                          }}
                        </Form.Item>

                        <Form.Item {...restField} name={[name, 'note']}>
                          <Input placeholder="Ghi chú" />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Button type="dashed" onClick={() => add({ itemType: 'Ingredient', quantity: 1 })} block icon={<PlusOutlined />}>
                      Thêm nguyên liệu/sản phẩm hệ thống
                    </Button>
                  </>
                )}
              </Form.List>
            </Card>

            <Card title="Nguyên liệu phụ (Tự nhập tay)" className="mb-6">
              <Form.List name="additionalIngredients">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Tên' }]}>
                          <Input placeholder="Vd: Muối, Tiêu..." style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'quantity']}>
                          <Input placeholder="Số lượng" style={{ width: 100 }} />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'unit']}>
                          <Input placeholder="Đơn vị" style={{ width: 100 }} />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Thêm nguyên liệu phụ</Button>
                  </>
                )}
              </Form.List>
            </Card>

            <Card title="Hướng dẫn thực hiện" className="mb-6">
              <Form.List name="instructions">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <div key={key} className="p-4 mb-4 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-bold text-blue-600">BƯỚC {index + 1}</span>
                          <MinusCircleOutlined className="text-red-500" onClick={() => remove(name)} />
                        </div>
                        <Form.Item {...restField} name={[name, 'step']} hidden initialValue={index + 1}><Input /></Form.Item>
                        <Form.Item {...restField} name={[name, 'title']} rules={[{ required: true }]} label="Tiêu đề bước">
                          <Input placeholder="Vd: Sơ chế cá lóc" />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'description']} rules={[{ required: true }]} label="Chi tiết cách làm">
                          <TextArea rows={2} placeholder="Rửa sạch cá với muối..." />
                        </Form.Item>
                      </div>
                    ))}
                    <Button type="dashed" onClick={() => add({ step: fields.length + 1 })} block icon={<PlusOutlined />}>Thêm bước</Button>
                  </>
                )}
              </Form.List>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Hình ảnh đại diện" className="mb-6">
              <Form.Item 
                name="image" 
                valuePropName="fileList"
                getValueFromEvent={(e: any) => {
                  if (Array.isArray(e)) return e;
                  return e?.fileList;
                }}
                rules={[{ required: true, message: 'Vui lòng tải ảnh đại diện!' }]}
              >
                <Upload.Dragger 
                  maxCount={1} 
                  beforeUpload={() => false} 
                  listType="picture"
                >
                  <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                  <p className="ant-upload-text">Kéo ảnh vào đây</p>
                </Upload.Dragger>
              </Form.Item>
            </Card>

            <Card title="Thông số Meta" className="mb-6">
              <Form.Item name={['meta', 'servings']} label="Khẩu phần">
                <Input placeholder="Vd: 2-3 người" />
              </Form.Item>
              <Form.Item name={['meta', 'cookType']} label="Hình thức">
                <Input placeholder="Vd: Tự nấu tại nhà" />
              </Form.Item>
              <Form.Item name={['meta', 'isPrepped']} label="Đã sơ chế sẵn?" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="instructionUrl" label="Link Video">
                <Input placeholder="https://youtube.com/..." />
              </Form.Item>
            </Card>

            <Card title="Gợi ý món ăn kèm" className="mb-6">
              <Form.Item name={['suggestedSideDishes', 'description']} label="Mô tả">
                <TextArea rows={2} />
              </Form.Item>
              <Form.List name={['suggestedSideDishes', 'dishes']}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <Space key={field.key} className="flex mb-2" align="baseline">
                        <Form.Item {...field} noStyle><Input placeholder="Tên món" /></Form.Item>
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Space>
                    ))}
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Thêm món kèm</Button>
                  </>
                )}
              </Form.List>
            </Card>

            <Card title="Mẹo & Dinh dưỡng" className="mb-6">
              <Form.List name={['tips', 'folkTips']}>
                {(fields, { add, remove }) => (
                  <>
                    <label>Mẹo dân gian:</label>
                    {fields.map((field) => (
                      <Space key={field.key} className="flex mb-2" align="baseline">
                        <Form.Item {...field} noStyle><Input placeholder="Ướp cá với gừng..." /></Form.Item>
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Space>
                    ))}
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="mb-4">Thêm mẹo</Button>
                  </>
                )}
              </Form.List>
              <Divider plain>Dinh dưỡng / 100g</Divider>
              <Row gutter={8}>
                <Col span={12}><Form.Item name={['tips', 'nutrition', 'calories']} label="Calories"><InputNumber className="w-full" /></Form.Item></Col>
                <Col span={12}><Form.Item name={['tips', 'nutrition', 'protein']} label="Protein"><InputNumber className="w-full" /></Form.Item></Col>
                <Col span={12}><Form.Item name={['tips', 'nutrition', 'fat']} label="Fat"><InputNumber className="w-full" /></Form.Item></Col>
                <Col span={12}><Form.Item name={['tips', 'nutrition', 'carbs']} label="Carbs"><InputNumber className="w-full" /></Form.Item></Col>
                <Col span={24}><Form.Item name={['tips', 'nutrition', 'description']} label="Mô tả dinh dưỡng"><Input /></Form.Item></Col>
              </Row>
            </Card>

            <Button 
              type="primary" 
              block 
              size="large" 
              icon={<SaveOutlined />} 
              loading={isCreating} 
              onClick={() => form.submit()} 
              className="h-14 text-lg font-bold uppercase"
            >
              Lưu công thức
            </Button>
          </Col>
        </Row>
      </Form>
    </PageContainer>
  );
};

export default AddRecipe;