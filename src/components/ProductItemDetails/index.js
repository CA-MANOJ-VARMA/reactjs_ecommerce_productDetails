// Write your code here
import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link, Redirect} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: [],
    similarProducts: [],
    apiStatus: apiStatusConstants.initial,
    productCount: 1,
  }

  componentDidMount() {
    this.videoItemDetailsApiUrl()
  }

  videoItemDetailsApiUrl = async () => {
    this.setState({apiStatus: apiStatusConstants.progress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    console.log(response)
    if (response.ok === true) {
      const jsonData = await response.json()
      const similarProducts = jsonData.similar_products
      console.log(jsonData)
      this.setState({
        productDetails: jsonData,
        similarProducts,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status_code === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  loadingFunction = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  incFunction = () => {
    this.setState(prevState => ({
      productCount: prevState.productCount + 1,
    }))
  }

  decFunction = () => {
    const {productCount} = this.state
    if (productCount > 1) {
      this.setState(prevState => ({
        productCount: prevState.productCount - 1,
      }))
    }
  }

  retryButton = () => <Redirect to="/products" />

  successView = () => {
    const {productDetails, similarProducts, productCount} = this.state
    console.log(productDetails)
    console.log(similarProducts)
    return (
      <>
        <div className="css-productDetails-container">
          <div className="css-productDetails-image-container">
            <img
              src={productDetails.image_url}
              alt="product"
              className="css-productDetails-image-itself"
            />
          </div>
          <div className="css-productDetails-details-container">
            <h1>{productDetails.title}</h1>
            <p>Rs.{productDetails.price}/-</p>
            <div className="css-rating-review-container">
              <div className="css-rating-container">
                <p>{productDetails.rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="css-star-image-itself"
                />
              </div>
              <p>{productDetails.total_reviews} Reviews</p>
            </div>
            <p>{productDetails.description}</p>
            <p>Available: {productDetails.availability}</p>
            <p>Brand: {productDetails.brand}</p>
            <hr />
            <div className="css-inc-dec-button-container">
              <button
                type="button"
                className="css-inc-dec-button"
                onClick={this.decFunction}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p>{productCount}</p>
              <button
                type="button"
                className="css-inc-dec-button"
                onClick={this.incFunction}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="css-addtocart-button-itself">
              ADD TO CART
            </button>
          </div>
        </div>
        <div>
          <h1>Similar Products</h1>
          <ul className="css-similarproducts-ul-container">
            {similarProducts.map(eachProduct => (
              <SimilarProductItem product={eachProduct} key={eachProduct.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  failureView = () => (
    <>
      <div className="css-failure-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          style={{
            width: '250px',
          }}
        />
        <h1 style={{fontSize: '15px'}}>Product Not Found</h1>
        <button type="button" onClick={this.retryButton}>
          Continue Shopping
        </button>
      </div>
    </>
  )

  statusFunction = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.progress:
        return this.loadingFunction()
      case apiStatusConstants.success:
        return this.successView()
      case apiStatusConstants.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="css-productDetails-whole-container">
          {this.statusFunction()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
