import years from "./data";

function ProductItem({ product }) {
  const { name, status } = product;
  const [showDetails, setShowDetails] = React.useState(false);
  const showModal = React.useCallback(() => setShowDetails(true));
  const closeModal = React.useCallback(() => setShowDetails(false));

  return (
    <>
      <li>
        <a href="#" className={status + "-product"} onClick={showModal}>
          <i
            className={
              status ? "fas fa-check-circle" : "far fa-question-circle"
            }
          />{" "}
          {name}
        </a>
      </li>
      {showDetails && (
        <Modal>
          <div className="overlay" onClick={closeModal} />
          <ProductContainer product={product} onDismiss={closeModal} />
        </Modal>
      )}
    </>
  );
}

function MonthCard({ month, products, status }) {
  return (
    <ul className="item">
      {month} <span className="counter">{products.length}</span>
      {products.map((product) => (
        <ProductItem key={product.name} product={product} />
      ))}
    </ul>
  );
}

function YearCard({ months, year }) {
  return (
    <>
      <div className="year">{year}</div>
      <div className="container">
        {months.map(({ name, products }) => (
          <MonthCard key={name} month={name} products={products} />
        ))}
      </div>
    </>
  );
}

function ProductContainer({
  product: { name, status, description, features, sources },
  onDismiss,
}) {
  return (
    <div className="product-container">
      <i
        className={
          status
            ? "fas fa-check-circle product-status released-product"
            : "far fa-question-circle product-status rumoured-product"
        }
      />
      <div
        className={
          status
            ? "product-status released-product"
            : "product-status rumoured-product"
        }
      >
        &nbsp;{status ? "Released" : "Rumoured"}
      </div>

      <div className="product-name">{name}</div>
      <div className="product-description">{description}</div>

      {features && (
        <div className="product-header">
          Features
          <ul className="product-features">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
      {sources && (
        <div className="product-header">
          Sources
          <ul className="product-features">
            {sources.map((source) => (
              <li key={source} className="source-link">
                <a href={source.link} target="_blank" className="source-link">
                  {source.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="okay-button" onClick={onDismiss}>
        Okay
      </div>
    </div>
  );
}

function Modal({ children }) {
  const element = React.useRef(document.createElement("div"));

  React.useEffect(() => {
    const parentNode = document.querySelector("#modal-container");
    parentNode.appendChild(element.current);

    return () => element.current.remove();
  });

  return ReactDOM.createPortal(children, element.current);
}

function App() {
  return years.map(({ yearName, months }) => (
    <YearCard key={yearName} year={yearName} months={months} />
  ));
}

ReactDOM.render(<App />, document.querySelector(".wrapper"));
