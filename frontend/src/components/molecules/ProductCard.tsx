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

interface ProductCardProps {
  product: Product;
  onProductClick?: (productId: number) => void;
}

export default function ProductCard({
  product,
  onProductClick,
}: ProductCardProps) {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("ko-KR").format(parseFloat(price));
  };

  const handleClick = () => {
    onProductClick?.(product.id);
  };

  return (
    <div
      className='bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer'
      onClick={handleClick}
    >
      {/* 상품 이미지 */}
      <div className='relative h-48 bg-gray-200'>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-gray-400'>
            No Image
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className='p-4'>
        <div className='text-sm text-gray-500 mb-1'>
          {product.category.name}
        </div>
        <h3 className='font-semibold text-gray-900 mb-2 line-clamp-1'>
          {product.name}
        </h3>
        <p className='text-sm text-gray-600 mb-3 line-clamp-2'>
          {product.description || "상품 설명이 없습니다."}
        </p>
        <div className='flex items-center justify-between'>
          <span className='text-lg font-bold text-blue-600'>
            {formatPrice(product.price)}원
          </span>
          <span className='text-sm text-gray-500'>재고: {product.stock}</span>
        </div>
      </div>
    </div>
  );
}
