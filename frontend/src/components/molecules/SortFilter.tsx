import Select from "../atoms/Select";

interface SortFilterProps {
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortByChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSortOrderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SortFilter({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: SortFilterProps) {
  const sortByOptions = [
    { value: "createdAt", label: "최신순" },
    { value: "price", label: "가격순" },
    { value: "name", label: "이름순" },
  ];

  const sortOrderOptions = [
    { value: "desc", label: "내림차순" },
    { value: "asc", label: "오름차순" },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <Select
        value={sortBy}
        onChange={onSortByChange}
        options={sortByOptions}
      />
      <Select
        value={sortOrder}
        onChange={onSortOrderChange}
        options={sortOrderOptions}
      />
    </div>
  );
}
