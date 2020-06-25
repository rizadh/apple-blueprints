import years from './data'

function MonthCard({ month, products, isReleased }) {
  const setProduct = React.useContext(SetProductContext)

  return (
    <ul className="item">
    {month} <span className="counter">{products.length}</span>
    {products.map(({ name, isReleased }) =>
      <li key={name}>
        <a href='#' className={isReleased ? 'released-product' : ''} onClick={() => setProduct({ name })}>
          <i className={isReleased ? 'fas fa-check-circle' : 'far fa-question-circle'} /> {name}
        </a>
      </li>
    )}
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
function ProductContainer({ product: { name }}) {
  const setProduct = React.useContext(SetProductContext)
  const close = React.useCallback(() => setProduct(null))

  return (
    <div class="product-container">
      <i class="fas fa-check-circle product-status"></i><div class="product-status">&nbsp;Released</div>
      <div class="product-name">{name}</div>
      <div class="product-description">The original iPhone SE was discontinued in 2018. Apple has revived the name April 2020 with a new 4.7-inch model that looks like the iPhone 8 model with more powerful internals.</div>

      <div class="product-header">
        Features
        <ul class="product-features">
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

      <div class="product-header">
        Sources
        <ul class="product-features">
          <li><a href="#" class="source-link">Jon Prosser</a></li>
          <li><a href="#" class="source-link">Ming-Chi Kuo</a></li>
        </ul>

        <div class="close-button" onClick={close}>Okay</div>
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

const SetProductContext = React.createContext()

function App() {
  const [product, setProduct] = React.useState(null)

  return <SetProductContext.Provider value={setProduct}>
    {years.map(({ yearName, months }) => <YearCard key={yearName} year={yearName} months={months}/>) }
    {product && <Modal><ProductContainer product={product} /></Modal>}
  </SetProductContext.Provider>
}

ReactDOM.render(<App />, document.querySelector('.wrapper'))
