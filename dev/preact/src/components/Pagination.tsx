import { useActions, usePagination } from "@nosto/search-js/preact"
import { type ComponentChildren } from "preact"
import { useCallback } from "preact/hooks"

function PaginationLink({ goToPage, children }: { goToPage: () => void; children: ComponentChildren }) {
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault()
        goToPage()
      }}
    >
      {children}
    </a>
  )
}

export default function Pagination() {
  const { prev, first, pages, last, next } = usePagination({
    width: 5
  })

  const { updateSearch } = useActions()

  const paginate = useCallback(
    ({ from }: { from: number | undefined }) => {
      updateSearch({ products: { from } })
      scrollTo(0, 0)
    },
    [updateSearch]
  )

  const handlePaginate = (page: { from: number | undefined }) => () => paginate(page)

  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
      {prev && <PaginationLink goToPage={handlePaginate(prev)}>{"<"}</PaginationLink>}
      {first && (
        <>
          <PaginationLink goToPage={handlePaginate(first)}>{first.page}</PaginationLink>
          <span>...</span>
        </>
      )}
      {pages.map(({ page, from }) => (
        <PaginationLink key={page} goToPage={handlePaginate({ from })}>
          {page}
        </PaginationLink>
      ))}
      {last && (
        <>
          <span>...</span>
          <PaginationLink goToPage={handlePaginate(last)}>{last.page}</PaginationLink>
        </>
      )}
      {next && <PaginationLink goToPage={handlePaginate(next)}>{">"}</PaginationLink>}
    </div>
  )
}
