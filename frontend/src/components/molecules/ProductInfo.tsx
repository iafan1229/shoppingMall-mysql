// frontend/src/components/organisms/ProductInfo.tsx
interface Category {
  id: number;
  name: string;
  description: string | null;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  stock: number;
  category: Category;
  createdAt: string;
}

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("ko-KR").format(parseFloat(price));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { text: "품절", color: "text-red-600", bgColor: "bg-red-50" };
    } else if (stock <= 10) {
      return {
        text: "재고 부족",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      };
    } else {
      return {
        text: "재고 충분",
        color: "text-green-600",
        bgColor: "bg-green-50",
      };
    }
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className='space-y-6'>
      {/* 카테고리 */}
      <div>
        <span className='inline-block px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full'>
          {product.category.name}
        </span>
      </div>

      {/* 상품명 */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          {product.name}
        </h1>
      </div>

      {/* 가격 */}
      <div>
        <div className='flex items-baseline gap-2'>
          <span className='text-3xl font-bold text-blue-600'>
            {formatPrice(product.price)}원
          </span>
          {/* 할인 가격이 있다면 여기에 추가 */}
        </div>
      </div>

      {/* 재고 상태 */}
      <div className='flex items-center gap-3'>
        <span className='text-sm text-gray-600'>재고 상태:</span>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color} ${stockStatus.bgColor}`}
        >
          <span
            className={`w-2 h-2 rounded-full mr-2 ${
              product.stock === 0
                ? "bg-red-500"
                : product.stock <= 10
                ? "bg-orange-500"
                : "bg-green-500"
            }`}
          ></span>
          {stockStatus.text} ({product.stock}개 남음)
        </span>
      </div>

      {/* 상품 설명 */}
      <div className='border-t pt-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-3'>상품 설명</h3>
        <div className='prose prose-gray max-w-none'>
          {product.description ? (
            <p className='text-gray-700 leading-relaxed whitespace-pre-line'>
              {product.description}
            </p>
          ) : (
            <p className='text-gray-500 italic'>
              상품 설명이 등록되지 않았습니다.
            </p>
          )}
        </div>
      </div>

      {/* 추가 상품 정보 */}
      <div className='border-t pt-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-3'>상품 정보</h3>
        <dl className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <dt className='text-sm font-medium text-gray-500'>상품 번호</dt>
            <dd className='text-sm text-gray-900'>
              #{product.id.toString().padStart(6, "0")}
            </dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-gray-500'>카테고리</dt>
            <dd className='text-sm text-gray-900'>{product.category.name}</dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-gray-500'>등록일</dt>
            <dd className='text-sm text-gray-900'>
              {formatDate(product.createdAt)}
            </dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-gray-500'>재고 수량</dt>
            <dd className='text-sm text-gray-900'>{product.stock}개</dd>
          </div>
        </dl>
      </div>

      {/* 배송 정보 (추후 확장 가능) */}
      <div className='border-t pt-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-3'>배송 정보</h3>
        <div className='space-y-2 text-sm text-gray-600'>
          <div className='flex justify-between'>
            <span>배송비</span>
            <span>무료배송</span>
          </div>
          <div className='flex justify-between'>
            <span>배송기간</span>
            <span>2-3일 (영업일 기준)</span>
          </div>
          <div className='flex justify-between'>
            <span>배송지역</span>
            <span>전국</span>
          </div>
        </div>
      </div>
    </div>
  );
}
