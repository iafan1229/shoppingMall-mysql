// frontend/src/app/products/[id]/page.tsx
import ProductDetailPage from "@/components/pages/ProductDetailPage";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetail({ params }: ProductDetailPageProps) {
  const productId = parseInt(params.id);

  // 유효하지 않은 ID 처리
  if (isNaN(productId)) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            잘못된 상품 ID
          </h1>
          <p className='text-gray-600'>올바른 상품 페이지로 이동해주세요.</p>
        </div>
      </div>
    );
  }

  return <ProductDetailPage productId={productId} />;
}
