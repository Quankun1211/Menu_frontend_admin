import React from "react";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

export interface PaginateProps {
  current: number,
  total: number,
  pageSize: number,
  onChange: (page: number) => void,
  classname?: string
}

const Paginate: React.FC<PaginateProps> = ({
  current,
  total,
  pageSize,
  onChange,
  classname
}) => {
  const totalPages = Math.ceil(total / pageSize)

  const handleChange = (page: number) => {
    if(page !== current && page > 0 && page <= totalPages) {
      onChange(page)
    }
  }

  const pageNumbers: Array<number | string> = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (current <= 4) {
      pageNumbers.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (current >= totalPages - 3) {
      pageNumbers.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pageNumbers.push(
        1,
        "...",
        current - 1,
        current,
        current + 1,
        "...",
        totalPages
      );
    }
  }

  const defaultClasses = "flex gap-2 items-center justify-center mt-4";

  return (
    <div className={twMerge(defaultClasses, classname)}>
      <button
        disabled={current === 1}
        onClick={() => handleChange(current - 1)}
        className="px-2 py-1 rounded-lg border disabled:opacity-50 hover:bg-gray-100"
      >
        <FontAwesomeIcon className="text-[12px]!" icon={faAngleLeft}/>
      </button>

      {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 py-1 text-gray-500 select-none"
              >
                ...
              </span>
            )
          }

          return (
            <button
              key={page}
              onClick={() => handleChange(page as number)}
              className={`px-3 py-1 rounded-lg border
                ${current === page
                  ? "bg-green-500 text-white border-green-500"
                  : "hover:bg-gray-100"}
              `}
            >
              {page}
            </button>
          )
        })}


      <button
        disabled={current === totalPages}
        onClick={() => handleChange(current + 1)}
        className="px-2 py-1 rounded-lg border disabled:opacity-50 hover:bg-gray-100"
      >
        <FontAwesomeIcon className="text-[12px]!" icon={faAngleRight}/>
      </button>
    </div>
  )
}

export default Paginate