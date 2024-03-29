import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import {Checkbox, Radio, Space} from 'antd'
import toast from 'react-hot-toast';
import { Prices } from '../components/Prices';
import "../styles/home.css"

const HomePage = () => {
  const[products,setProducts] = useState([])
  const [categories,setCategories] = useState([])
  const [checked,setChecked] = useState([])
  const [radio,setRadio] = useState([])
  const [total,setTotal] = useState(0)
  const [page,setPage] = useState(1)
  const [loading,setLoading] = useState(false)
  const navigate=useNavigate()

  const getAllProducts = async () => {
    try {
      setLoading(true)
      const {data} = await axios.get(`api/v1/product/product-list/${page}`)
      setLoading(false)
      setProducts(data.products)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const getAllCategories = async () => {
    try {
      const {data} = await axios.get('/api/v1/category/get-category')
      if(data?.success){
        setCategories(data?.categories)
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong in getting categories")
    }
  }

  //get total count of products
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    if(page===1) return;
    loadMore()
  },[page])

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleFiler = (value,id) => {
    let all = [...checked]
    if(value){
      all.push(id)
    }
    else{
      all = all.filter((c)=>c!==id)
    }
    setChecked(all)
  }

  useEffect(()=>{
    getAllCategories();
    getTotal();
  },[])

  useEffect(() => {
    if((!checked.length)||(!radio.length)){
      getAllProducts()
    }
  },[checked.length,radio.length])
  
  const filteredProducts = useCallback(async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filter", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  }, [checked, radio]);

  useEffect(() => {
    if((checked.length)||(radio.length)){
      filteredProducts()
    }
  },[checked.length,radio.length,filteredProducts])
  
    


  return (
    <Layout title={"All products"}>
      <div className="row mt-3">
        <div className="col-md-3">
          <h6 className="text-center mt-4">Filter by category</h6>
          <div className="d-flex flex-column">
          {
            categories?.map((c)=>(
                <Checkbox key={c._id} className="pb-2 ps-4" onChange={(e)=>handleFiler(e.target.checked,c._id)}>{c.name}</Checkbox>
            ))
          }
          </div>
          <h6 className="text-center mt-4">Filter by price</h6>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e)=>setRadio(e.target.value)}>
            <Space direction="vertical">
              {
                Prices?.map((p)=>(
                  <div key={p._id} className="pb-2 ps-4">
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))
              }
            </Space>
            </Radio.Group>
          </div>

          <div className="d-flex flex-column">
            <button className='btn btn-danger' onClick={()=>window.location.reload()}>
              RESET FILTERS
            </button>
          </div>


        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p)=>(
              <div className="card m-2" style={{width: '18rem'}}>
                  <img className="card-img-top" src={`/api/v1/product/product-photo/${p._id}`} alt={p.name} />
                  <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.description.substring(0,30)}...</p>
                      <p className="card-text"> ₹ {p.price}</p>
                      <button onClick={()=>navigate(`/product/${p.slug}`)} class="btn btn-primary ms-1">More detail</button>
                      {/* <a class="btn btn-secondary ms-1">Add to cart</a> */}
                  </div>
              </div>
            ))}
          </div>
          <div className='m-2 p-3'>
            {products && products.length < total && (
              <button className="btn btn-warning" onClick={
                (e)=>{
                  e.preventDefault()
                  setPage(page+1)
                }}>
                {loading ? "Loading..." : "Load more"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage
