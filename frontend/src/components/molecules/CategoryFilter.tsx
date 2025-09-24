import Select from "../atoms/Select";

interface Category {
  id: number;
  name: string;
  description: string | null;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onChange,
}: CategoryFilterProps) {
  const options = [
    { value: "", label: "전체 카테고리" },
    ...categories.map((category) => ({
      value: category.id.toString(),
      label: category.name,
    })),
  ];

  return (
    <Select value={selectedCategory} onChange={onChange} options={options} />
  );
}
