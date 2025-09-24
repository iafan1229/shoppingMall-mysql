import CategoryFilter from "../molecules/CategoryFilter";
import SortFilter from "../molecules/SortFilter";
import SearchInput from "../molecules/SearchInput";

interface Category {
  id: number;
  name: string;
  description: string | null;
}

interface FilterPanelProps {
  searchKeyword: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortByChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSortOrderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function FilterPanel({
  searchKeyword,
  onSearchChange,
  onSearchSubmit,
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: FilterPanelProps) {
  return (
    <div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
      <div className='space-y-4'>
        {/* 검색창 */}
        <SearchInput
          value={searchKeyword}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
        />

        {/* 필터 옵션 */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* 카테고리 필터 */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onChange={onCategoryChange}
          />

          {/* 정렬 필터 */}
          <SortFilter
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={onSortByChange}
            onSortOrderChange={onSortOrderChange}
          />
        </div>
      </div>
    </div>
  );
}
