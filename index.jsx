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

const years = [
  {
    yearName: '2020',
    months: [
      {
        name: 'march',
        products: [
          { name: 'iPad Pro', isReleased: true },
          { name: 'Magic Keyboard', isReleased: true },
          { name: 'MacBook Air' , isReleased: true },
          { name: 'Mac mini', isReleased: true },
          { name: 'Powerbeats', isReleased: true },
        ],
      },
      {
        name: 'april',
        products: [
          { name: 'iPhone SE', isReleased: true },
        ],
      },
      {
        name: 'may',
        products: [
          { name: '13" MacBook Pro', isReleased: true },
        ],
      },
      {
        name: 'september',
        products: [
          { name: 'iPhone 12 (5.4")' },
          { name: 'iPhone 12 (6.1")' },
          { name: 'iPhone 12 Pro (6.1")' },
          { name: 'iPhone 12 Pro (6.7")' },
          { name: 'Apple Watch Series 6' },
          { name: 'AirTags' },
          { name: 'AirPods Studio' },
          { name: 'AirPods X' },
          { name: 'Small Wireless Charging Pad' },
        ],
      },
      {
        name: 'unknown',
        products: [
          { name: 'iMac' },
          { name: 'HomePod' },
          { name: 'HomePod Lite' },
          { name: 'iPad Air' },
          { name: 'iPad' },
          { name: 'Apple TV' },
        ],
      },
    ],
  },
  {
    yearName: '2021',
    months: [
      {
        products: [
          { name: 'iPhone SE Plus' },
          { name: 'Game Controller' },
          { name: 'iPad Pro' },
          { name: 'ARM MacBooks' },
        ],
      },
    ],
  },
  {
    yearName: '2022',
    months: [
      {
        products: [
          { name: 'Apple Glass' },
        ],
      },
    ],
  },
]

ReactDOM.render(<App />, document.querySelector('.wrapper'))
