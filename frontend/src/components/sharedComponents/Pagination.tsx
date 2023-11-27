import { Link } from "react-router-dom";


export interface PaginationData {
    count: number | null | undefined;
    next: string | null | undefined;
    previous: string | null | undefined;
  }

interface PaginationInterface{
    data: PaginationData;
    page: string | undefined;
    url: string;
}
const Pagination: React.FC<PaginationInterface> = ({data, page, url}) =>{
    // console.log(data.previous !== null || data.next!== null)
    // console.log(((data.previous !== (null || undefined || '')) || (data.next !== (null || undefined || ''))))
    // console.log(((data.previous !== (null || ''))))
    // console.log(data.previous)
    return(
        <>
  
    {(data.previous !== (null) || data.next !== (null)) && (
      <nav className='d-flex justify-content-center mt-auto'>
      <ul className="pagination">
      {data.previous && (
        <li className="page-item">
          <Link to={`${url}${parseInt(page!) - 1}`} className="page-link" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </Link>
        </li>
      )}
      {data.previous !== null && (
        
        <li className="page-item">

          <Link to={`${url}${parseInt(page!) - 1}`} className="page-link">{`${parseInt(page!) - 1}`}</Link>
        </li>
      )}
       
        <li className="page-item">

          <Link to={`${url}${parseInt(page!)}`} className="page-link">{`${parseInt(page!)}`}</Link>
        </li>

      {data.next !== null  && (
        <li className="page-item">
  
          <Link to={`${url}${parseInt(page!) + 1}`} className="page-link">{`${parseInt(page!) + 1}`}</Link>
        </li>
      )}
      {data.next && (
        <li className="page-item">
          <Link to={`${url}${parseInt(page!) + 1}`} className="page-link" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </Link>
        </li>
      )}
        
      </ul>
    </nav>
    )}
    
      </>
    )
};
export default Pagination;