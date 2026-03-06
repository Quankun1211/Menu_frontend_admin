import { faPhone, faEnvelope, faMapLocation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation } from 'react-router'
const Footer = () => {
  const location = useLocation();

  const isPaymentPageSlug = location.pathname.startsWith('/payment/');
  const isPaymentPage = location.pathname === '/payment';
  const isFavouritePage = location.pathname === '/favourite';
  const isHistoryPage = location.pathname === '/history';
  if (isPaymentPage || isFavouritePage || isHistoryPage || isPaymentPageSlug) {
    return null;
  }
  return (
    <div className='px-20 py-10 bg-[#4ba64bd7] flex gap-6 text-white'>
      <div className='w-1/4'>
        <h1 className='text-xl font-bold capitalize'>Công ty tnhh thực phẩm sạch ABC</h1>
        <p>Địa chỉ: Số 123, đường XYZ, Phường 1, TP.HN</p>
        <p className='border-b-2 border-white border-solid pb-4'>Sở Kế hoạch và Đầu Tư Thành Phố Hà Nội</p>
        <div className='mt-4'> 
          <div className='flex items-center gap-2 mt-1'>
            <FontAwesomeIcon icon={faPhone} style={{color: "#ffffff",}} />
            01234 5678 / 0987 654 321
          </div>
          <div className='flex items-center gap-2 mt-1'>
            <FontAwesomeIcon icon={faEnvelope} style={{color: "#ffffff",}} />
            example@gmail.com
          </div>
          <div className='flex items-center gap-2 mt-1'>
            <FontAwesomeIcon icon={faMapLocation} style={{color: "#ffffff",}} />
            Địa chỉ: Số 123, đường XYZ, Phường 1, TP.HN
          </div>
        </div>
      </div>
      <div className='w-1/4'>
        <h1 className='text-xl font-bold capitalize'>Trợ giúp nhanh</h1>
        <p>Chính sách và quy định chung</p>
        <p>Hướng dẫn mua hàng</p>
        <p>Liên hệ</p>
      </div>
      <div className='w-1/4'>
        <h1 className='text-xl font-bold capitalize'>Chính sách bán hàng</h1>
        <p>Chính sách bảo mật</p>
        <p>Chính sách vận chuyển</p>
        <p>Chính sách đổi trả</p>
      </div>
      <div className='w-1/4'>
        <h1 className='text-xl font-bold capitalize'>Dịch vụ khách hàng</h1>
        <p>Danh mục sản phẩm</p>
        <p>Về chúng tôi</p>
      </div>
    </div>
  )
}

export default Footer