import { useEffect, useRef } from "react";
import Icon from "./Icon.jsx";

export function PageHeader({ section, title, description, actions }) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{section}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className="heading-actions">{actions}</div> : null}
    </div>
  );
}

export function Panel({ title, subtitle, actions, children, className = "" }) {
  return (
    <section className={`panel content-panel ${className}`.trim()}>
      {(title || subtitle || actions) && (
        <div className="panel-header">
          <div>
            {title ? <h2>{title}</h2> : null}
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          {actions}
        </div>
      )}
      <div className="panel-body">{children}</div>
    </section>
  );
}

export function DataTable({ columns, rows, label, emptyMessage = "No matching records." }) {
  return (
    <div className="table-scroll" role="region" aria-label={label} tabIndex="0">
      <table>
        <thead><tr>{columns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}</tr></thead>
        <tbody>
          {rows.length ? rows.map((row) => (
            <tr key={row.id ?? row[columns[0].key]}>
              {columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}
            </tr>
          )) : <tr><td className="empty-cell" colSpan={columns.length}>{emptyMessage}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export function StatusBadge({ children, tone = "success" }) {
  const className = tone === "warning" ? "badge-warning" : tone === "neutral" ? "badge-neutral" : "badge-success";
  return <span className={`badge ${className}`}>{children}</span>;
}

export function DemoNote({ children = "Fictional demonstration data. This portal is not connected to official AUF systems." }) {
  return <p className="demo-note">{children}</p>;
}

export function StatCard({ icon, label, value, detail, tone = "teal" }) {
  return (
    <article className="summary-card">
      <span className={`summary-icon ${tone}`}><Icon name={icon} /></span>
      <div className="summary-details">
        <span className="summary-label">{label}</span>
        <strong className="summary-value">{value}</strong>
        {detail ? <span className="summary-meta">{detail}</span> : null}
      </div>
    </article>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <span className="placeholder-icon"><Icon name="search" /></span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function Modal({ title, description, onClose, children, labelledBy = "dialog-title" }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    dialogRef.current?.focus();
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog-card" role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex="-1" ref={dialogRef}>
        <div className="dialog-header">
          <div><h2 id={labelledBy}>{title}</h2>{description ? <p>{description}</p> : null}</div>
          <button className="icon-button dialog-close" type="button" onClick={onClose} aria-label="Close dialog"><Icon name="close" /></button>
        </div>
        <div className="dialog-content">{children}</div>
      </section>
    </div>
  );
}

export function Feedback({ children, tone = "success" }) {
  if (!children) return null;
  return <p className={`feedback-message ${tone}`} role="status" aria-live="polite">{children}</p>;
}
