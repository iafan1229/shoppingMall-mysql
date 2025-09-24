import CategoryFilter from "../molecules/CategoryFilter";
import PriceFilter from "../molecules/PriceFilter";
import SearchInput from "../molecules/SearchInput";

export default function SearchForm() {
  return (
    <>
      <CategoryFilter />
      <PriceFilter />
      <SearchInput />
    </>
  );
}
