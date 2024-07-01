import React from "react";
import { MonthCard } from "./MonthCard";

export function YearCard({ months, year }) {
  return (
    <div className="yearCard">
      <h2 className="year-label">{year}</h2>
      <div className="container">
        {months.map(({ name, products }) => (
          <MonthCard key={name ?? "unknown"} month={name} products={products} />
        ))}
      </div>
    </div>
  );
}
