"use client";

import { useState, useEffect } from "react";

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

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface SearchResponse {
  data: Product[];
  pagination: PaginationInfo;
}

export default function HomePage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);

  // 카테고리 목록 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("카테고리 로딩 실패:", error);
      }
    };

    fetchCategories();
  }, []);

  // 상품 검색 함수
  const searchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        keyword: searchKeyword,
        page: page.toString(),
        limit: "12",
        sortBy,
        sortOrder,
        ...(selectedCategory && { categoryId: selectedCategory }),
      });

      const response = await fetch(
        `http://localhost:8080/api/products/search?${params}`
      );
      const data: SearchResponse = await response.json();

      setProducts(data.data);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error("상품 검색 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 초기 상품 목록 로드
  useEffect(() => {
    searchProducts(1);
  }, [sortBy, sortOrder, selectedCategory]);

  // 검색 버튼 클릭 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts(1);
  };

  // 가격 포맷팅
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("ko-KR").format(parseFloat(price));
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 헤더 */}
      <header className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <h1 className='text-3xl font-bold text-gray-900'>쇼핑몰</h1>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* 검색 및 필터 영역 */}
        <div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
          <form onSubmit={handleSearch} className='space-y-4'>
            {/* 검색창 */}
            <div className='flex gap-2'>
              <input
                type='text'
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder='상품명 또는 설명으로 검색...'
                className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <button
                type='submit'
                className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
              >
                검색
              </button>
            </div>

            {/* 필터 옵션 */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {/* 카테고리 필터 */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>전체 카테고리</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* 정렬 기준 */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value='createdAt'>최신순</option>
                <option value='price'>가격순</option>
                <option value='name'>이름순</option>
              </select>

              {/* 정렬 순서 */}
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value='desc'>내림차순</option>
                <option value='asc'>오름차순</option>
              </select>
            </div>
          </form>
        </div>

        {/* 검색 결과 정보 */}
        {pagination && (
          <div className='mb-4 text-gray-600'>
            총 <span className='font-semibold'>{pagination.totalCount}</span>
            개의 상품
          </div>
        )}

        {/* 로딩 상태 */}
        {loading && (
          <div className='text-center py-12'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          </div>
        )}

        {/* 상품 그리드 */}
        {!loading && (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {products.map((product) => (
                <div
                  key={product.id}
                  className='bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden'
                >
                  {/* 상품 이미지 */}
                  <div className='relative h-48 bg-gray-200'>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className='object-cover'
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
                      <span className='text-sm text-gray-500'>
                        재고: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 검색 결과 없음 */}
            {products.length === 0 && (
              <div className='text-center py-12'>
                <p className='text-gray-500 text-lg'>검색 결과가 없습니다.</p>
              </div>
            )}

            {/* 페이지네이션 */}
            {pagination && pagination.totalPages > 1 && (
              <div className='mt-8 flex justify-center items-center gap-2'>
                <button
                  onClick={() => searchProducts(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors'
                >
                  이전
                </button>

                <div className='flex gap-1'>
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => searchProducts(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => searchProducts(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors'
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
