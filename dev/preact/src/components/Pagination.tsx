import { useActions, usePagination } from "@nosto/search-js/preact/hooks"
import { type ComponentChildren } from "preact"
import { useCallback, useState } from "preact/hooks"

import { styles } from "./Pagination.styles"

function PaginationLink({
  goToPage,
  active,
  children
}: {
  goToPage: () => void
  active?: boolean
  children: ComponentChildren
}) {
  const [hovered, setHovered] = useState(false)
  const style = active ? styles.linkActive : hovered ? styles.linkHover : styles.link

  return (
    <a
      href="#"
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={e => {
        e.preventDefault()
        goToPage()
      }}
    >
      {children}
    </a>
  )
}

export function Pagination() {
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

  const handlePaginate = useCallback((page: { from: number | undefined }) => () => paginate(page), [paginate])

  return (
    <div style={styles.container}>
      {prev && <PaginationLink goToPage={handlePaginate(prev)}>{"←"}</PaginationLink>}
      {first && (
        <>
          <PaginationLink goToPage={handlePaginate(first)}>{first.page}</PaginationLink>
          <span style={styles.ellipsis}>{"···"}</span>
        </>
      )}
      {pages.map(({ page, from, current }) => (
        <PaginationLink key={page} active={current} goToPage={handlePaginate({ from })}>
          {page}
        </PaginationLink>
      ))}
      {last && (
        <>
          <span style={styles.ellipsis}>{"···"}</span>
          <PaginationLink goToPage={handlePaginate(last)}>{last.page}</PaginationLink>
        </>
      )}
      {next && <PaginationLink goToPage={handlePaginate(next)}>{"→"}</PaginationLink>}
    </div>
  )
}
