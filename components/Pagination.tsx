import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  itemsAmount: number;
  itemsPerPage: number;
  redirectUrl: string;
};

const PAGINATION_BORDER_ITEMS = 4;

export const Pagination = ({
  currentPage,
  itemsAmount,
  itemsPerPage,
  redirectUrl,
}: PaginationProps) => {
  const amountOfPages = Math.ceil(itemsAmount / itemsPerPage);

  const prevPagesArray =
    currentPage < PAGINATION_BORDER_ITEMS
      ? Array.from({ length: PAGINATION_BORDER_ITEMS }).map((_, i) => i + 1)
      : [1];

  const nextPagesArray =
    currentPage > amountOfPages + 1 - PAGINATION_BORDER_ITEMS
      ? Array.from({ length: PAGINATION_BORDER_ITEMS })
          .map((_, i) => amountOfPages - i)
          .reverse()
      : [amountOfPages];

  const currPagesArray = [currentPage - 1, currentPage, currentPage + 1];

  const shouldShowMiddlePages =
    currentPage >= PAGINATION_BORDER_ITEMS &&
    currentPage <= amountOfPages + 1 - PAGINATION_BORDER_ITEMS;

  const shouldShowAdditionalDots =
    currentPage <= amountOfPages + 1 - PAGINATION_BORDER_ITEMS;

  return (
    <nav>
      <div style={{ display: "flex" }}>
        {prevPagesArray.map((pageNumber) => (
          <Link key={pageNumber} href={`${redirectUrl}/${pageNumber}`}>
            <a>
              {currentPage === pageNumber ? ` >${pageNumber}< ` : pageNumber}
            </a>
          </Link>
        ))}

        <div className="text-2xl">...</div>
        {shouldShowMiddlePages && (
          <>
            {currPagesArray.map((pageNumber) => (
              <Link key={pageNumber} href={`${redirectUrl}/${pageNumber}`}>
                <a>
                  {currentPage === pageNumber
                    ? ` >${pageNumber}< `
                    : pageNumber}
                </a>
              </Link>
            ))}
            {shouldShowAdditionalDots && <div className="text-2xl">...</div>}
          </>
        )}
        {nextPagesArray.map((pageNumber) => (
          <Link key={pageNumber} href={`${redirectUrl}/${pageNumber}`}>
            <a>
              {currentPage === pageNumber ? ` >${pageNumber}< ` : pageNumber}
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
};
