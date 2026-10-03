import { useMemo, useState } from "react"

export function usePages<T>() {
    const [page, setPage] = useState(0)
    const [pageCursors, setPageCursors] = useState<T[]>([])

    function setPageCursor(pageCursor: T) {
        const p = [...pageCursors.slice(0, page), pageCursor, ...pageCursors.slice(page + 1)]
        setPageCursors(p)
    }
    function getPageCursor() {
        if (page <= 0)
            return null

        if (page >= pageCursors.length)
            return pageCursors[pageCursors.length - 1]

        return pageCursors[page - 1]
    }

    function previousPage() {
        if (page === 0)
            return

        setPage(page - 1)
    }
    const previousPageActive = useMemo(() => page >= 1, [page])
    
    function nextPage() {
        if (page >= pageCursors.length)
            return
        
        setPage(page + 1)
    }
    const nextPageActive = useMemo(() => page < pageCursors.length, [page, pageCursors])

    return { 
        page:           page,
        pageControls:   { previousPage, previousPageActive, nextPage, nextPageActive },
        pageCursor:     { set: setPageCursor, get: getPageCursor }
    }
}
