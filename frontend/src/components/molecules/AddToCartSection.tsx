// frontend/src/components/organisms/AddToCartSection.tsx
"use client";

import { useState } from "react";
import Button from "../atoms/Button";

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

interface AddToCartSectionProps {
  product: Product;
  onAddToCart: (quantity: number) => Promise<void>;
}

export default function AddToCartSection({
  product,
  onAddToCart,
}: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("ko-KR").format(parseFloat(price));
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > product.stock) return;
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    if (product.stock === 0 || isAdding) return;

    try {
      setIsAdding(true);
      await onAddToCart(quantity);
    } finally {
      setIsAdding(false);
    }
  };

  const totalPrice = parseFloat(product.price) * quantity;
  const isOutOfStock = product.stock === 0;

  return (
    <div className='bg-gray-50 rounded-lg p-6 sticky top-4'>
      <div className='space-y-6'>
        {/* 수량 선택 */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            수량
          </label>
          <div className='flex items-center space-x-3'>
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isOutOfStock}
              className='w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M20 12H4'
                />
              </svg>
            </button>

            <input
              type='number'
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(parseInt(e.target.value) || 1)
              }
              min='1'
              max={product.stock}
              disabled={isOutOfStock}
              className='w-20 text-center px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
            />

            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock || isOutOfStock}
              className='w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4v16m8-8H4'
                />
              </svg>
            </button>
          </div>

          {!isOutOfStock && (
            <p className='text-xs text-gray-500 mt-1'>
              최대 {product.stock}개까지 선택 가능
            </p>
          )}
        </div>

        {/* 총 가격 */}
        <div className='border-t pt-4'>
          <div className='flex justify-between items-center'>
            <span className='text-lg font-medium text-gray-700'>총 금액</span>
            <span className='text-2xl font-bold text-blue-600'>
              {formatPrice(totalPrice.toString())}원
            </span>
          </div>
          <div className='text-sm text-gray-500 mt-1'>
            {formatPrice(product.price)}원 × {quantity}개
          </div>
        </div>

        {/* 장바구니 담기 버튼 */}
        <div className='space-y-3'>
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className='w-full py-4 text-lg font-semibold'
            variant='primary'
          >
            {isAdding ? (
              <div className='flex items-center justify-center space-x-2'>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                <span>장바구니에 추가하는 중...</span>
              </div>
            ) : isOutOfStock ? (
              "품절"
            ) : (
              "장바구니에 담기"
            )}
          </Button>

          {/* 바로 구매 버튼 (추후 구현) */}
          <Button
            disabled={isOutOfStock}
            variant='secondary'
            className='w-full py-4 text-lg font-semibold'
          >
            {isOutOfStock ? "품절" : "바로 구매"}
          </Button>
        </div>

        {/* 재고 부족 알림 */}
        {isOutOfStock && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <div className='flex items-center space-x-2'>
              <svg
                className='w-5 h-5 text-red-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span className='text-red-700 font-medium'>
                현재 품절된 상품입니다
              </span>
            </div>
            <p className='text-red-600 text-sm mt-2'>
              재입고 알림을 받으려면 알림 신청을 해주세요.
            </p>
          </div>
        )}

        {/* 위시리스트 추가 버튼 (추후 구현) */}
        <div className='border-t pt-4'>
          <button className='flex items-center justify-center w-full py-2 text-gray-600 hover:text-gray-800 transition-colors'>
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
                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
              />
            </svg>
            위시리스트에 추가
          </button>
        </div>

        {/* 공유하기 버튼 */}
        <div className='border-t pt-4'>
          <button className='flex items-center justify-center w-full py-2 text-gray-600 hover:text-gray-800 transition-colors'>
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
                d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z'
              />
            </svg>
            상품 공유하기
          </button>
        </div>
      </div>
    </div>
  );
}
