// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {product} = props
  console.log(product)

  return (
    <li className="css-li-container">
      <div className="css-similarproductitem-container">
        <img
          src={product.image_url}
          alt={`similar product ${product.title}`}
          className="css-similarproduct-image-itself"
        />
        <p>{product.title}</p>
        <p>by {product.brand}</p>
        <div>
          <p>Rs. {product.price}</p>
          <div className="css-rating-container">
            <p>{product.rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="css-star-image-itself"
            />
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
