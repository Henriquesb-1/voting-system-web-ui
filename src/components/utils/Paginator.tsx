import "./paginator.css";

interface PaginatorProps {
    pages: number;
    currentPage: any;
    pageURL: string;
}

export default function Paginator({ pages, currentPage, pageURL }: PaginatorProps) {
    function getNecessariesPages(pages: number) {
        const necessariesPages: number[] = [];

        for (let i = 1; i <= pages; i++) necessariesPages.push(i);

        return necessariesPages;
    }

    function renderPagination() {
        const pageItem = getNecessariesPages(pages);

        if (pageItem.length >= 2) {
            return pageItem.map((pageNumber, index) => {
                return (
                    <li key={`pagination-item-${index}`} className={`page-item ${currentPage == index + 1 ? "active" : ""}`}>
                        <a href={`${pageURL}?page=${index + 1}`} className="page-link">
                            {pageNumber}
                        </a>
                    </li>
                )
            })
        }
    }

    return (
        <div className="pagination-container">
            <nav aria-label="Page navegation">
                <ul className="pagination">
                    {renderPagination()}
                </ul>
            </nav>
        </div>
    )
}