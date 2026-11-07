import { useMemo, useState } from "react";
import { initialBooks } from "../data/mockData.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { DataTable, DemoNote, Feedback, PageHeader, Panel, StatusBadge } from "../components/UI.jsx";

export default function Library() {
  const [books, setBooks] = useLocalStorage("myau.libraryBooks", initialBooks);
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const filtered = useMemo(() => books.filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase())), [books, query]);

  function updateLoan(id) {
    const book = books.find((item) => item.id === id);
    setBooks((current) => current.map((item) => item.id === id
      ? { ...item, status: item.status === "Borrowed" ? "Renewed · demo" : "Borrowed", due: item.status === "Borrowed" ? "Dec 02, 2026" : "Nov 18, 2026" }
      : item));
    setFeedback(book.status === "Borrowed" ? `Renewal preview recorded for “${book.title}”.` : `Demo loan status restored for “${book.title}”.`);
  }

  return (
    <>
      <PageHeader section="University Services" title="Library" description="Review borrowed materials and library information." />
      <Feedback>{feedback}</Feedback>
      <div className="service-banner">
        <div><p className="eyebrow">Research resources</p><h2>Explore academic databases</h2><p>External database access may require credentials provided by the university.</p></div>
        <a className="button button-primary" href="https://search.ebscohost.com/" target="_blank" rel="noopener noreferrer">Open EBSCO <span aria-hidden="true">↗</span></a>
      </div>
      <Panel title="Borrowed materials" subtitle="Fictional circulation records for this demonstration account.">
        <div className="table-tools"><label className="search-field"><span className="visually-hidden">Search borrowed books</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title or author" /></label></div>
        <DataTable label="Borrowed library materials" columns={[
          { key: "title", label: "Title" }, { key: "author", label: "Author" }, { key: "due", label: "Due date" },
          { key: "status", label: "Status", render: (row) => <StatusBadge tone={row.status.startsWith("Renewed") ? "neutral" : "warning"}>{row.status}</StatusBadge> },
          { key: "action", label: "Action", render: (row) => <button className="text-button" type="button" onClick={() => updateLoan(row.id)}>{row.status === "Borrowed" ? "Preview renewal" : "Undo renewal"}</button> },
        ]} rows={filtered} emptyMessage="No borrowed items match your search." />
      </Panel>
      <DemoNote>Loan records and renewal actions are local simulations. No library account is accessed or updated.</DemoNote>
    </>
  );
}
