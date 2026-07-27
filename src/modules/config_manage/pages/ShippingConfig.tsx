import { useEffect } from "react";
import { Alert, Button, Form, InputNumber, Skeleton, message } from "antd";
import { SaveOutlined, TruckOutlined } from "@ant-design/icons";
import PageContainer from "../../../components/ui/PageContainer";
import { useShippingFee, useUpdateShippingFee } from "../hooks/useShippingFee";

type ShippingFeeForm = { shippingFee: number };

const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export default function ShippingConfig() {
  const [form] = Form.useForm<ShippingFeeForm>();
  const { data: shippingFee, isPending, isError, refetch } = useShippingFee();
  const updateMutation = useUpdateShippingFee();

  useEffect(() => {
    if (shippingFee !== undefined) form.setFieldsValue({ shippingFee });
  }, [form, shippingFee]);

  const handleSubmit = ({ shippingFee: nextFee }: ShippingFeeForm) => {
    updateMutation.mutate(nextFee, {
      onSuccess: () => message.success("Đã cập nhật phí vận chuyển"),
      onError: (error: any) =>
        message.error(error?.message || "Không thể cập nhật phí vận chuyển"),
    });
  };

  return (
    <PageContainer
      title="Cấu hình vận chuyển"
      description="Thiết lập phí vận chuyển mặc định áp dụng cho đơn hàng mới."
      breadcrumbItems={[
        { title: "Bảng điều khiển", link: "/" },
        { title: "Cấu hình vận chuyển" },
      ]}
    >
      <div className="max-w-2xl">
        {isError && (
          <Alert
            className="mb-6"
            type="error"
            showIcon
            message="Không tải được cấu hình"
            action={<Button onClick={() => refetch()}>Thử lại</Button>}
          />
        )}

        {isPending ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <>
            <div className="mb-6 flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl text-white">
                <TruckOutlined />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phí đang áp dụng</p>
                <p className="text-2xl font-bold text-gray-900">{formatVND(shippingFee ?? 25000)}</p>
              </div>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="shippingFee"
                label="Phí vận chuyển mặc định"
                extra="Nhập 0 nếu muốn miễn phí vận chuyển cho toàn bộ đơn hàng mới."
                rules={[
                  { required: true, message: "Vui lòng nhập phí vận chuyển" },
                  { type: "number", min: 0, max: 10_000_000, message: "Phí phải từ 0 đến 10.000.000đ" },
                ]}
              >
                <InputNumber<number>
                  className="w-full"
                  min={0}
                  max={10_000_000}
                  step={1000}
                  precision={0}
                  addonAfter="VNĐ"
                  formatter={(value) =>
                    value === undefined ? "" : new Intl.NumberFormat("vi-VN").format(Number(value))
                  }
                  parser={(value) => Number((value || "0").replace(/\D/g, ""))}
                  size="large"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={updateMutation.isPending}
              >
                Lưu cấu hình
              </Button>
            </Form>
          </>
        )}
      </div>
    </PageContainer>
  );
}
