import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Form, Input, Button, Select, Space, Row, Col, 
  InputNumber, Divider, Card, Upload, message, Switch, Spin 
} from 'antd';
import { 
  PlusOutlined, MinusCircleOutlined, LeftOutlined, 
  UploadOutlined, SaveOutlined 
} from '@ant-design/icons';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllProducts from '../../product_manage/hooks/useGetAllProducts';
import useGetAllIngredients from '../hooks/useGetAllIngredient';
import useUpdateRecipe from '../hooks/useUpdateRecipe';
import useGetRecipeDetail from '../hooks/useGetRecipeDetail';
import useGetAllCategory from '../../category_manage/hooks/useGetAllCategory';

const { TextArea } = Input;

const EditRecipe = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { data: recipeData, isPending: isFetching } = useGetRecipeDetail(id!);
  const { updateRecipe, isUpdating } = useUpdateRecipe();
  const { data: allProducts } = useGetAllProducts({ page: 1, limit: 1000, status: "in_stock" });
  const { data: ingredients } = useGetAllIngredients({ limit: 1000 });
  const { data: allCategory } = useGetAllCategory({ page: 1, limit: 1000, type: "recipe" });

  useEffect(() => {
    if (recipeData?.data) {
      const recipe = recipeData.data;
      form.setFieldsValue({
        ...recipe,
        category: recipe.category?._id || recipe.category,
        image: recipe.image ? [{
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: recipe.image,
        }] : [],
      });
    }
  }, [recipeData, form]);

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
      if (values.image[0].originFileObj) {
        formData.append('image', values.image[0].originFileObj);
      }
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

    updateRecipe({ id: id!, formData }, {
      onSuccess: () => {
        message.success("Cập nhật công thức thành công!");
        navigate('/recipes');
      }
    });
  };

  if (isFetching) return <div className="flex justify-center p-10"><Spin size="large" /></div>;

  return (
    <PageContainer 
      title="Chỉnh sửa công thức"
      actions={
        <Button icon={<LeftOutlined />} onClick={() => navigate(-1)}>Quay lại</Button>
      }
      description=''
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
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
                <TextArea rows={3} />
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
                          <Select style={{ width: 120 }} onChange={() => form.setFieldValue(['ingredients', name, 'ingredientId'], undefined)}>
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
                        <Form.Item {...restField} name={[name, 'quantity']} rules={[{ required: true }]}>
                          <InputNumber placeholder="SL" min={0.1} style={{ width: 80 }} />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'note']}>
                          <Input placeholder="Ghi chú" />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Button type="dashed" onClick={() => add({ itemType: 'Ingredient' })} block icon={<PlusOutlined />}>Thêm nguyên liệu</Button>
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
                          <Input placeholder="Tiêu đề..." />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'description']} rules={[{ required: true }]} label="Chi tiết">
                          <TextArea rows={2} />
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
                getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
              >
                <Upload.Dragger maxCount={1} beforeUpload={() => false} listType="picture">
                  <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                  <p className="ant-upload-text">Thay đổi ảnh đại diện</p>
                </Upload.Dragger>
              </Form.Item>
            </Card>

            <Card title="Thông số Meta" className="mb-6">
              <Form.Item name={['meta', 'servings']} label="Khẩu phần"><Input /></Form.Item>
              <Form.Item name={['meta', 'cookType']} label="Hình thức"><Input /></Form.Item>
              <Form.Item name={['meta', 'isPrepped']} label="Đã sơ chế sẵn?" valuePropName="checked"><Switch /></Form.Item>
              <Form.Item name="instructionUrl" label="Link Video"><Input /></Form.Item>
            </Card>

            <Button 
              type="primary" 
              block 
              size="large" 
              icon={<SaveOutlined />} 
              loading={isUpdating} 
              onClick={() => form.submit()} 
              className="h-14 text-lg font-bold uppercase"
            >
              Cập nhật công thức
            </Button>
          </Col>
        </Row>
      </Form>
    </PageContainer>
  );
};

export default EditRecipe;