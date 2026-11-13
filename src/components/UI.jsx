import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

export function PageHeading({ page, children }) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{page.section}</p>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>
      {children}
    </div>
  );
}

export function Panel({ title, subtitle, children, className = "" }) {
  return (
    <section className={`panel content-panel ${className}`.trim()}>
      <div className="panel-header">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}

export function Badge({ children, tone = "success" }) {
  const toneClass = tone === "warning" ? "badge-warning" : tone === "pending" ? "badge-neutral" : "badge-success";
  return <span className={`badge ${toneClass}`}>{children}</span>;
}

export function DemoNote({ children }) {
  if (!children) return null;
  return <p className="demo-note">{children}</p>;
}

export function Feedback({ children, tone = "success" }) {
  return children ? <p className={`form-feedback feedback-${tone}`} role="status" aria-live="polite">{children}</p> : null;
}

export function DataTable({ headers, rows, label, searchable = false, sortable = false }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ column: -1, direction: "ascending" });

  const visibleRows = useMemo(() => {
    let result = rows;
    if (searchable && query.trim()) {
      const needle = query.trim().toLocaleLowerCase();
      result = result.filter((row) => row.some((cell) => typeof cell === "string" && cell.toLocaleLowerCase().includes(needle)));
    }
    if (sortable && sort.column >= 0) {
      result = [...result].sort((a, b) => String(a[sort.column]).localeCompare(String(b[sort.column]), undefined, { numeric: true }));
      if (sort.direction === "descending") result.reverse();
    }
    return result;
  }, [query, rows, searchable, sort]);

  function toggleSort(column) {
    setSort((current) => ({
      column,
      direction: current.column === column && current.direction === "ascending" ? "descending" : "ascending",
    }));
  }

  return (
    <>
      {searchable && (
        <div className="table-toolbar">
          <label className="table-search">
            <span className="visually-hidden">Search {label}</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${label.toLocaleLowerCase()}`} />
          </label>
          <span className="table-result-count">{visibleRows.length} of {rows.length} records</span>
        </div>
      )}
      <div className="table-scroll" role="region" aria-label={label} tabIndex="0">
        <table>
          <thead>
            <tr>{headers.map((header, index) => (
              <th scope="col" key={header}>
                {sortable ? (
                  <button className="sortable-header" type="button" onClick={() => toggleSort(index)} aria-label={`Sort by ${header}`}>
                    {header}{sort.column === index ? (sort.direction === "ascending" ? " ↑" : " ↓") : ""}
                  </button>
                ) : header}
              </th>
            ))}</tr>
          </thead>
          <tbody>
            {visibleRows.length > 0 ? visibleRows.map((row, rowIndex) => (
              <tr key={`${label}-${rowIndex}`}>{row.map((cell, cellIndex) => (
                <td className={cellIndex === row.length - 1 ? "table-last-cell" : ""} key={`${label}-${rowIndex}-${cellIndex}`}>{cell}</td>
              ))}</tr>
            )) : <tr><td colSpan={headers.length}><span className="empty-state">No matching records found.</span></td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function SectionCards({ links }) {
  return (
    <div className="section-overview-grid">
      {links.map(({ id, title, description }) => (
        <Link className="service-card section-card-link" to={`/index.html#${id}`} key={id}>
          <span className="service-title"><span className="service-icon"><Icon name="file" /></span><strong>{title}</strong></span>
          <p>{description}</p>
          <span className="service-action">View section <Icon name="arrow" /></span>
        </Link>
      ))}
    </div>
  );
}
