function MonthCard(props) {
  return (
    <ul className="item">
    {props.month} ({props.products.length})
    {props.products.map(product =>
      <li key={product.name}>
        <a href='#' className={product.isReleased ? 'released-product' : ''}>
          <i className={product.isReleased ? 'fas fa-check-circle' : 'far fa-question-circle'}></i> {product.name}
        </a>
      </li>
    )}
    </ul>
  )
}

const data = [
  {
    month: 'March',
    products: [
      { name: 'iPad Pro', isReleased: true },
      { name: 'Magic Keyboard', isReleased: true },
      { name: 'MacBook Air' , isReleased: true },
      { name: 'Mac mini', isReleased: true },
      { name: 'Powerbeats', isReleased: true },
    ],
  },
  {
    month: 'April',
    products: [
      { name: 'iPhone SE', isReleased: true },
    ],
  },
  {
    month: 'May',
    products: [
      { name: '13" MacBook Pro' },
      { name: 'iMac' },
      { name: 'Apple TV' },
    ],
  },
  {
    month: 'June',
    products: [
      { name: 'AirTags' },
      { name: 'AirPods Studio' },
      { name: 'Wireless Charging Pad' },
    ],
  },
  {
    month: 'September',
    products: [
      { name: 'iPhone 12 (5.4")' },
      { name: 'iPhone 12 (6.1")' },
      { name: 'iPhone 12 Pro (6.1")' },
      { name: 'iPhone 12 Pro (6.7")' },
      { name: 'Apple Watch Series 6' },
      { name: 'AirPods X' },
      { name: 'HomePod' },
      { name: 'HomePod Lite' },
    ],
  },
  {
    month: 'October',
    products: [
      { name: 'iPad Air' },
      { name: 'iPad' },
    ],
  },
]

const container = document.querySelector('.container')
// PROPS                                       ->
const monthCards = data.map(item => <MonthCard key={item.month} month={item.month} products={item.products}/>)
ReactDOM.render(monthCards, container)
