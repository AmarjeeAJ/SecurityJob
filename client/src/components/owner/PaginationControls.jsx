import Button from '../common/Button.jsx';

export default function PaginationControls({ page, totalPages, total, onPageChange }) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row">
      <p className="text-sm text-slate-500">
        Page {page} of {totalPages} &middot; {total} candidate{total === 1 ? '' : 's'}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="!py-2 !px-4">
          Previous
        </Button>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="!py-2 !px-4">
          Next
        </Button>
      </div>
    </div>
  );
}
