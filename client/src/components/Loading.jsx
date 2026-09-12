export function Loading() {
  return (
    <div className="w-20 md:w-28 text-[#f2d27b] mx-auto my-4">
      <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="6" height="6" rx="1">
          <animate id="spinner_w36s" begin="0;spinner_5GfT.end-0.25s" attributeName="x" dur="0.75s" values="4;14;4"></animate>
          <animate begin="0;spinner_5GfT.end-0.25s" attributeName="y" dur="0.75s" values="4;14;4"></animate>
        </rect>
        <rect x="4" y="14" width="6" height="6" rx="1">
          <animate begin="spinner_w36s.end-0.5s" attributeName="x" dur="0.75s" values="4;14;4"></animate>
          <animate begin="spinner_w36s.end-0.5s" attributeName="y" dur="0.75s" values="14;4;14"></animate>
        </rect>
        <rect x="14" y="4" width="6" height="6" rx="1">
          <animate begin="spinner_w36s.end-0.625s" attributeName="x" dur="0.75s" values="14;4;14"></animate>
          <animate begin="spinner_w36s.end-0.625s" attributeName="y" dur="0.75s" values="4;14;4"></animate>
        </rect>
        <rect x="14" y="14" width="6" height="6" rx="1">
          <animate id="spinner_5GfT" begin="spinner_w36s.end-0.375s" attributeName="x" dur="0.75s" values="14;4;14"></animate>
          <animate begin="spinner_w36s.end-0.375s" attributeName="y" dur="0.75s" values="14;4;14"></animate>
        </rect>
      </svg>
    </div>
  );
}
