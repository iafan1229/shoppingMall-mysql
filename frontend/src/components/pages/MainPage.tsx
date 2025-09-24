import ShopLayout from "../templates/ShopLayout";
import FilterPanel from "../organisms/FilterPanel";
import ProductGrid from "../organisms/ProductGrid";
import Pagination from "../molecules/Pagination";
import { useState, useEffect } from "react";
import { useScrollPosition } from "../../hooks/useScrollPosition";

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

export default function MainPage() {
  const { saveScrollPosition } = useScrollPosition("product-list");

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
        limit: "10",
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

  // 여기에 추가
  const handleProductClick = (productId: number) => {
    saveScrollPosition();
    // 상품 상세 페이지 이동 로직 (필요시)
  };
  return (
    <ShopLayout>
      {/* 검색 및 필터 영역 */}
      <FilterPanel
        searchKeyword={searchKeyword}
        onSearchChange={(e) => setSearchKeyword(e.target.value)}
        onSearchSubmit={handleSearch}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={(e) => setSelectedCategory(e.target.value)}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={(e) => setSortBy(e.target.value)}
        onSortOrderChange={(e) =>
          setSortOrder(e.target.value as "asc" | "desc")
        }
      />

      {/* 검색 결과 정보 */}
      {pagination && (
        <div className='mb-4 text-gray-600'>
          총 <span className='font-semibold'>{pagination.totalCount}</span>
          개의 상품
        </div>
      )}

      {/* 상품 그리드 */}
      <ProductGrid products={products} loading={loading} />

      {/* 페이지네이션 */}
      {pagination && (
        <Pagination
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={searchProducts}
        />
      )}
    </ShopLayout>
  );
}
