import Input from "../atoms/Input";
import Button from "../atoms/Button";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
}

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "상품명 또는 설명으로 검색...",
}: SearchInputProps) {
  return (
    <form onSubmit={onSubmit} className='flex gap-2'>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='flex-1'
      />
      <Button type='submit'>검색</Button>
    </form>
  );
}
