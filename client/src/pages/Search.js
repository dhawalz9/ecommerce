import React from 'react'
import Layout from '../components/Layout/Layout.js'
import { useSearch } from '../context/search'

const Search = () => {
    const [values,setValues] = useSearch()
  return (
    <Layout title={"Search results"}>
        <div className="container">
            <div className="text-center">
                <h1>Search results</h1>
                <h6>{values?.results.length<1?'No Products found':`Found ${values?.results.length}`}</h6>\

                <div className="d-flex flex-wrap mt-4">
                  {values?.results.map((p)=>(
                  <div className="card m-2" style={{width: '18rem'}}>
                      <img className="card-img-top" src={`/api/v1/product/product-photo/${p._id}`} alt={p.name} />
                      <div className="card-body">
                          <h5 className="card-title">{p.name}</h5>
                          <p className="card-text">{p.description.substring(0,30)}...</p>
                          <p className="card-text"> ₹ {p.price}</p>
                          {/* <a href="#" class="btn btn-primary ms-1">More detail</a> */}
                          {/* <a class="btn btn-secondary ms-1">Add to cart</a> */}
                      </div>
                  </div>
                  ))}
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Search