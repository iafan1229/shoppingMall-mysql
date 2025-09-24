import Button from "../atoms/Button";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PaginationProps {
  pagination: PaginationInfo;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  pagination,
  currentPage,
  onPageChange,
}: PaginationProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className='mt-8 flex justify-center items-center gap-2'>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!pagination.hasPrev}
        variant='secondary'
      >
        이전
      </Button>

      <div className='flex gap-1'>
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!pagination.hasNext}
        variant='secondary'
      >
        다음
      </Button>
    </div>
  );
}
