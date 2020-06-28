import years from './data'

function ProductItem({ product }) {
  const { name, isReleased } = product
  const [showDetails, setShowDetails] = React.useState(false)
  const showModal = React.useCallback(() => setShowDetails(true))
  const closeModal = React.useCallback(() => setShowDetails(false))

  return (
    <>
      <li>
        <a href='#' className={isReleased ? 'released-product' : ''} onClick={showModal}>
          <i className={isReleased ? 'fas fa-check-circle' : 'far fa-question-circle'} /> {name}
        </a>
      </li>
      {showDetails && <Modal><ProductContainer product={product} onDismiss={closeModal}/></Modal>}
    </>
  )
}

function MonthCard({ month, products, isReleased }) {
  return (
    <ul className="item">
    {month} <span className="counter">{products.length}</span>
    {products.map(product => <ProductItem key={product.name} product={product} />)}
    </ul>
  )
}

function YearCard({ months, year }) {
  return (
    <>
      <div className="year">{year}</div>
      <div className="container">
        {months.map(({ name, products }) => <MonthCard key={name} month={name} products={products}/>)}
      </div>
    </>
  )
}

// TODO: Remove placeholders and use product details to populate UI
function ProductContainer({ product: { name }, onDismiss }) {
  return (
    <div className="product-container">
      <i className="fas fa-check-circle product-status"></i><div className="product-status">&nbsp;Released</div>
      <div className="product-name">{name}</div>
      <div className="product-description">The original iPhone SE was discontinued in 2018. Apple has revived the name April 2020 with a new 4.7-inch model that looks like the iPhone 8 model with more powerful internals.</div>

      <div className="product-header">
        Features
        <ul className="product-features">
          <li>4.7-inch display</li>
          <li>A13 Bionic Chip</li>
          <li>iPhone 8</li>
          <li>Touch ID</li>
          <li>Single-lens rear camera</li>
          <li>3GB RAM</li>
          <li>Red, white and black colours</li>
          <li>$399 starting price</li>
        </ul>
      </div>

      <div className="product-header">
        Sources
        <ul className="product-features">
          <li><a href="#" className="source-link">Jon Prosser</a></li>
          <li><a href="#" className="source-link">Ming-Chi Kuo</a></li>
        </ul>

        <div className="close-button" onClick={onDismiss}>Okay</div>
      </div>
    </div>
  )
}

function Modal({ children }) {
  const element = React.useRef(document.createElement('div'))

  React.useEffect(() => {
    const parentNode = document.querySelector('#modal-container')
    parentNode.appendChild(element.current)

    return () => element.current.remove()
  })

  return ReactDOM.createPortal(children, element.current)
}

function App() {
  return years.map(({ yearName, months }) => <YearCard key={yearName} year={yearName} months={months}/>)
}

ReactDOM.render(<App />, document.querySelector('.wrapper'))
