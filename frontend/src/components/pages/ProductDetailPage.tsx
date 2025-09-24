// frontend/src/components/pages/ProductDetailPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ShopLayout from "../templates/ShopLayout";
import ProductImageGallery from "../molecules/ProductImageGallery";
import ProductInfo from "../molecules/ProductInfo";
import AddToCartSection from "../molecules/AddToCartSection";

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

interface ProductDetailPageProps {
  productId: number;
}

export default function ProductDetailPage({
  productId,
}: ProductDetailPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 상품 상세 정보 가져오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/products/${productId}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("상품을 찾을 수 없습니다.");
          }
          throw new Error("상품 정보를 불러오는데 실패했습니다.");
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("상품 조회 실패:", error);
        setError(
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // 장바구니 추가 핸들러
  const handleAddToCart = async (quantity: number) => {
    if (!product) return;

    try {
      // 임시로 userId를 1로 설정 (실제로는 로그인 시스템과 연동)
      const userId = 1;

      const response = await fetch("http://localhost:8080/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId: product.id,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "장바구니 추가에 실패했습니다.");
      }

      alert("장바구니에 상품이 추가되었습니다!");
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      alert(
        error instanceof Error ? error.message : "장바구니 추가에 실패했습니다."
      );
    }
  };

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <ShopLayout>
        <div className='text-center py-12'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          <p className='mt-4 text-gray-600'>상품 정보를 불러오는 중...</p>
        </div>
      </ShopLayout>
    );
  }

  if (error || !product) {
    return (
      <ShopLayout>
        <div className='text-center py-12'>
          <div className='mb-4'>
            <svg
              className='mx-auto h-16 w-16 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            상품을 찾을 수 없습니다
          </h2>
          <p className='text-gray-600 mb-6'>{error}</p>
          <button
            onClick={handleGoBack}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            돌아가기
          </button>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      {/* 뒤로가기 버튼 */}
      <div className='mb-6'>
        <button
          onClick={handleGoBack}
          className='flex items-center text-gray-600 hover:text-gray-900 transition-colors'
        >
          <svg
            className='w-5 h-5 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          상품 목록으로 돌아가기
        </button>
      </div>

      {/* 상품 상세 정보 */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-8'>
          {/* 상품 이미지 갤러리 */}
          <div>
            <ProductImageGallery product={product} />
          </div>

          {/* 상품 정보 및 장바구니 담기 */}
          <div className='space-y-6'>
            <ProductInfo product={product} />
            <AddToCartSection product={product} onAddToCart={handleAddToCart} />
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
