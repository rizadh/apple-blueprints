function MonthCard(props) {
  return (
    <ul className="item">
    {props.month} ({props.products.length})
    {props.products.map(product =>
      <li key={product.name}>
        <a href='#' className={product.isReleased ? 'released-product' : ''}>
          <i className={product.isReleased ? 'fas fa-check-circle' : 'far fa-question-circle'} /> {product.name}
        </a>
      </li>
    )}
    </ul>
  )
}

function YearCard(props) {
  const totalProducts = props.months.reduce((total, currentMonth) => total + currentMonth.products.length, 0)

  return (
    <>
      <div className="year">{props.year} ({totalProducts})</div>
      <div className="container">
        {props.months.map(month => <MonthCard key={month.name} month={month.name} products={month.products}/>)}
      </div>
    </>
  )
}

const years = [
  {
    yearName: '2020',
    months: [
      {
        name: 'March',
        products: [
          { name: 'iPad Pro', isReleased: true },
          { name: 'Magic Keyboard', isReleased: true },
          { name: 'MacBook Air' , isReleased: true },
          { name: 'Mac mini', isReleased: true },
          { name: 'Powerbeats', isReleased: true },
        ],
      },
      {
        name: 'April',
        products: [
          { name: 'iPhone SE', isReleased: true },
        ],
      },
      {
        name: 'May',
        products: [
          { name: '13" MacBook Pro' },
          { name: 'iMac' },
          { name: 'Apple TV' },
        ],
      },
      {
        name: 'June',
        products: [
          { name: 'AirTags' },
          { name: 'AirPods Studio' },
          { name: 'Wireless Charging Pad' },
        ],
      },
      {
        name: 'September',
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
        name: 'October',
        products: [
          { name: 'iPad Air' },
          { name: 'iPad' },
        ],
      },
    ],
  },
]

// PROPS                                     ->
const yearCards = years.map(year => <YearCard key={year.yearName} year={year.yearName} months={year.months}/>)
ReactDOM.render(yearCards, document.querySelector('.wrapper'))
