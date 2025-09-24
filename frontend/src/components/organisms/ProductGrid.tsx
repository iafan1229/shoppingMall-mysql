import ProductCard from "../molecules/ProductCard";

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

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className='text-center py-12'>
        <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500 text-lg'>검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
