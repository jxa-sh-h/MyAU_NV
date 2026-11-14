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

function tableCellClass(cell, columnIndex, columnCount) {
  if (typeof cell !== "string") return columnIndex === columnCount - 1 ? "table-last-cell" : "";
  const value = cell.trim();
  const normalized = value.toLocaleLowerCase();
  const classes = [];
  if (columnIndex === 0 && /^[A-Z][A-Z0-9-]{2,9}$/.test(value)) classes.push("table-code-cell");
  if (/^[−-]?\s*(?:₱|php)?\s*\d[\d,]*(?:\.\d{1,2})?$/i.test(value)) classes.push("table-numeric-cell");
  if (/passed|cleared|received|active member|recorded|good standing/i.test(normalized)) classes.push("table-status-good");
  else if (/currently enrolled|enrolled|participant/i.test(normalized)) classes.push("table-status-info");
  else if (/pending|for review|outstanding|overdue|notice on file|in progress|not encoded|no credit|below required/i.test(normalized)) classes.push("table-status-attention");
  if (columnIndex === columnCount - 1) classes.push("table-last-cell");
  return classes.join(" ");
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
                <td className={tableCellClass(cell, cellIndex, row.length)} key={`${label}-${rowIndex}-${cellIndex}`}>{cell}</td>
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
