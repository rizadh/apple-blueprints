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
          <i className={isReleased ? 'fas fa-check-circle' : 'far fa-question-circle'}/> {name}
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

function ProductContainer({ product: { name, isReleased, description, features, sources }, onDismiss }) {
  return (
    <div className="product-container">

      <i className={isReleased ? 'fas fa-check-circle product-status released-product' : 'far fa-question-circle product-status rumoured-product'}/>
      <i className={isReleased ? 'released-product' : ''}/>

      <div className={isReleased ? 'product-status released-product' : 'product-status rumoured-product'}>&nbsp;{isReleased ? 'Released' : 'Rumoured'}</div>

      <div className="product-name">{name}</div>
      <div className="product-description">{description}</div>

      <div className="product-header">
        Features
        <ul className="product-features">
          {features.map(feature => <li key={feature}>{feature}</li>)}
        </ul>
      </div>

      {
        // if sources is truey return <div>...</div> which React will show
        // else, return sources which is falsy so React will ignore
        sources &&
        <div className="product-header">
          Sources
          <ul className="product-features">
            {sources.map(source => <li key={source} className="source-link"><a href={source.link} target="_blank" className="source-link">{source.name}</a></li>)}
          </ul>
          <div className="close-button" onClick={onDismiss}>Okay</div>
        </div>
      }

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
