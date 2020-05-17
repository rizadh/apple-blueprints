function MonthCard({ month, products, isReleased }) {
  return (
    <ul className="item">
    {month} <span class="counter">{products.length}</span>
    {products.map(({ name, isReleased }) =>
      <li key={name}>
        <a href='#' className={isReleased ? 'released-product' : ''}>
          <i className={isReleased ? 'fas fa-check-circle' : 'far fa-question-circle'} /> {name}
        </a>
      </li>
    )}
    </ul>
  )
}

function YearCard({ months, year }) {
  const totalProducts = months.reduce((total, { products }) => total + products.length, 0)
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
          { name: '13" MacBook Pro', isReleased: true },
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
  {
    yearName: '2021',
    months: [
      {
        products: [
          { name: 'iPhone SE Plus' },
          { name: 'Game Controller' },
          { name: 'iPad Pro' },
        ],
      },
    ],
  },

  {
    yearName: '2022',
    months: [
      {
        products: [
          { name: 'Apple Glasses' },
        ],
      },
    ],
  },
]

// PROPS                                      ->
const yearCards = years.map(({ yearName, months }) => <YearCard key={yearName} year={yearName} months={months}/>)
ReactDOM.render(yearCards, document.querySelector('.wrapper'))
