// frontend/src/components/molecules/ProductImageGallery.tsx
"use client";

import { useState } from "react";

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

interface ProductImageGalleryProps {
  product: Product;
}

export default function ProductImageGallery({
  product,
}: ProductImageGalleryProps) {
  // 실제 프로젝트에서는 여러 이미지를 지원할 수 있도록 확장 가능
  const images = [
    product.imageUrl ||
      `https://via.placeholder.com/600x600?text=${encodeURIComponent(
        product.name
      )}`,
    // 추가 이미지들... (현재는 하나의 이미지만 지원)
  ];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageLoaded(false);
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.target as HTMLImageElement;
    target.src = `https://via.placeholder.com/600x600?text=${encodeURIComponent(
      product.name
    )}`;
    setIsImageLoaded(true);
  };

  return (
    <div className='space-y-4'>
      {/* 메인 이미지 */}
      <div className='relative bg-gray-100 rounded-lg overflow-hidden aspect-square'>
        {!isImageLoaded && (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-200'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400'></div>
          </div>
        )}
        <img
          src={images[selectedImageIndex]}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* 재고 부족 오버레이 */}
        {product.stock === 0 && (
          <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-red-600 text-white px-4 py-2 rounded-lg font-semibold'>
              품절
            </div>
          </div>
        )}
      </div>

      {/* 썸네일 이미지 (현재는 하나만 있지만 확장 가능) */}
      {images.length > 1 && (
        <div className='grid grid-cols-4 gap-2'>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImageIndex === index
                  ? "border-blue-600"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                className='w-full h-full object-cover'
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}

      {/* 이미지 확대 기능 (추후 모달로 구현 가능) */}
      <div className='text-center'>
        <button className='text-sm text-blue-600 hover:text-blue-700 underline'>
          이미지 확대 보기
        </button>
      </div>
    </div>
  );
}
