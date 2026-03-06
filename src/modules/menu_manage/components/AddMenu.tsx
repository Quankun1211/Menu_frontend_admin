import React, { useState } from 'react';
import { 
    Form, Input, Button, Upload, Select, InputNumber, 
    Switch, Card, Space, Breadcrumb, message 
} from 'antd';
import { UploadOutlined, ArrowLeftOutlined, SaveOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllCategory from '../../category_manage/hooks/useGetAllCategory';
import useGetAllRecipes from '../../rercipe_manage/hooks/useGetAllRecipe';
import useCreateMenu from '../hooks/useCreateMenu';
const { TextArea } = Input;

export default function AddMenuPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);
    
    const { mutate: createMenu, isPending } = useCreateMenu();
    const { data: categories } = useGetAllCategory({ 
        page: 1, 
        limit: 1000, 
        type: "menu", 
    });
    const { data: recipesData } = useGetAllRecipes({ 
        page: 1, 
        limit: 1000, 
    });

    const onFinish = (values: any) => {
        if (fileList.length === 0) {
            return message.error("Vui lòng tải lên hình ảnh menu!");
        }

        const formData = new FormData();
        
        formData.append('title', values.title);
        formData.append('titleBanner', values.titleBanner);
        formData.append('description', values.description || '');
        formData.append('category', values.category);
        formData.append('cookTime', values.cookTime.toString());
        
        formData.append('recipes', JSON.stringify(values.recipes));
        
        const meta = {
            servings: values.servings,
            cookType: values.cookType,
            isPrepped: values.isPrepped
        };
        formData.append('meta', JSON.stringify(meta));

        if (fileList[0]?.originFileObj) {
            formData.append('image', fileList[0].originFileObj);
        }

        createMenu(formData, {
            onSuccess: () => {
                navigate('/menus');
            }
        });
    };

    return (
        <PageContainer
            title="Thêm thực đơn mới"
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
                    servings: "2-3",
                    cookType: "Tự nấu tại nhà",
                    isPrepped: false,
                    cookTime: 30
                }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card title="Thông tin cơ bản" className="shadow-sm">
                            <Form.Item
                                label="Tiêu đề Menu"
                                name="title"
                                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                            >
                                <Input placeholder="Ví dụ: Thực đơn gia đình cuối tuần" />
                            </Form.Item>

                            <Form.Item
                                label="Tiêu đề Banner"
                                name="titleBanner"
                                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề banner!' }]}
                            >
                                <Input placeholder="Dòng chữ hiển thị trên ảnh bìa" />
                            </Form.Item>

                            <Form.Item label="Mô tả" name="description">
                                <TextArea rows={4} placeholder="Mô tả ngắn về thực đơn này..." />
                            </Form.Item>
                        </Card>

                        <Card title="Công thức & Món ăn" className="shadow-sm">
                            <Form.Item
                                label="Chọn các món ăn (Recipes)"
                                name="recipes"
                                rules={[{ required: true, message: 'Chọn ít nhất 1 món ăn!' }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Tìm và chọn các món ăn có sẵn"
                                    className="w-full"
                                    options={recipesData?.data?.map((r: any) => ({
                                        label: r.name,
                                        value: r._id
                                    })) || []}
                                />
                            </Form.Item>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card title="Hình ảnh đại diện" className="shadow-sm">
                            <Form.Item>
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    beforeUpload={() => false}
                                    onChange={({ fileList }) => setFileList(fileList)}
                                    maxCount={1}
                                >
                                    {fileList.length < 1 && (
                                        <div>
                                            <UploadOutlined />
                                            <div style={{ marginTop: 8 }}>Tải ảnh</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Card>

                        <Card title="Phân loại & Thông số" className="shadow-sm">
                            <Form.Item
                                label="Danh mục Menu"
                                name="category"
                                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                            >
                                <Select
                                    placeholder="Chọn loại thực đơn"
                                    options={categories?.data?.map((c: any) => ({
                                        label: c.name,
                                        value: c._id
                                    })) || []}
                                />
                            </Form.Item>

                            <Form.Item label="Thời gian nấu (phút)" name="cookTime">
                                <InputNumber min={1} className="w-full" />
                            </Form.Item>

                            <Form.Item label="Khẩu phần (người)" name="servings">
                                <Input placeholder="Ví dụ: 2-3 hoặc 4-5" />
                            </Form.Item>

                            <Form.Item label="Kiểu nấu" name="cookType">
                                <Select options={[
                                    { label: 'Tự nấu tại nhà', value: 'Tự nấu tại nhà' },
                                    { label: 'Sơ chế sẵn', value: 'Sơ chế sẵn' },
                                    { label: 'Gói nguyên liệu', value: 'Gói nguyên liệu' },
                                ]} />
                            </Form.Item>

                            <Form.Item label="Đã sơ chế sẵn?" name="isPrepped" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Card>

                        <div className="flex flex-col gap-2">
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                icon={<SaveOutlined />} 
                                size="large" 
                                block
                                loading={isPending} 
                            >
                                Lưu thực đơn
                            </Button>
                            <Button 
                                icon={<ArrowLeftOutlined />} 
                                size="large" 
                                block 
                                onClick={() => navigate(-1)}
                            >
                                Hủy bỏ
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
        </PageContainer>
    );
}