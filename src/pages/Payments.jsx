import { useMemo, useState } from "react";
import { assessmentItems, formatPeso, initialPayments } from "../data/mockData.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { DataTable, DemoNote, Feedback, Modal, PageHeader, Panel, StatusBadge } from "../components/UI.jsx";

export default function Payments() {
  const [payments, setPayments] = useLocalStorage("myau.payments", initialPayments);
  const [payOpen, setPayOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [feedback, setFeedback] = useState("");
  const totalAssessment = assessmentItems.reduce((sum, item) => sum + item.amount, 0);
  const paid = payments.reduce((sum, item) => sum + item.amount, 0);
  const balance = Math.max(0, totalAssessment - paid);
  const history = useMemo(() => [...payments].sort((a, b) => new Date(b.date) - new Date(a.date)), [payments]);

  function recordDemoPayment(event) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || parsedAmount > balance) return;
    setPayments((current) => [{
      id: `payment-${Date.now()}`,
      date: new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(new Date()),
      description: "Payment preview · simulated",
      amount: parsedAmount,
      status: "Demo record",
    }, ...current]);
    setFeedback(`${formatPeso(parsedAmount)} was recorded in the local demo. No payment was made.`);
    setPayOpen(false);
    setAmount("");
  }

  return (
    <>
      <PageHeader section="Student Account" title="Payments" description="Review your mock assessment, balance, and payment history." actions={
        <button className="button button-primary" type="button" onClick={() => { setAmount(String(Math.min(balance, 1000))); setFeedback(""); setPayOpen(true); }} disabled={!balance}>Preview payment</button>
      } />
      <Feedback>{feedback}</Feedback>
      <div className="payment-summary">
        <article className="balance-card payment-balance"><span>Sample outstanding balance</span><strong>{formatPeso(balance)}</strong><small>Calculated from fictional account activity</small></article>
        <article className="balance-card"><span>Assessment total</span><strong>{formatPeso(totalAssessment)}</strong><small>Mock current-term charges</small></article>
      </div>
      <Panel title="Assessment breakdown" subtitle="First Semester · AY 2026–2027">
        <DataTable label="Assessment breakdown" columns={[
          { key: "label", label: "Assessment item" },
          { key: "amount", label: "Amount", render: (row) => formatPeso(row.amount) },
        ]} rows={assessmentItems} />
        <p className="table-total">Total assessment <strong>{formatPeso(totalAssessment)}</strong></p>
      </Panel>
      <Panel title="Payment history" subtitle="Payments shown here are local demonstration records.">
        <DataTable label="Payment history" columns={[
          { key: "date", label: "Date" }, { key: "description", label: "Description" },
          { key: "amount", label: "Amount", render: (row) => formatPeso(row.amount) },
          { key: "status", label: "Record status", render: (row) => <StatusBadge tone="neutral">{row.status}</StatusBadge> },
        ]} rows={history} emptyMessage="No payment records yet." />
      </Panel>
      <DemoNote>MYAU does not connect to a payment provider. No payment details are requested and no funds are transferred.</DemoNote>
      {payOpen ? (
        <Modal title="Preview a demo payment" description={`Outstanding balance: ${formatPeso(balance)}. This will not charge an account.`} onClose={() => setPayOpen(false)}>
          <form className="demo-form dialog-form" onSubmit={recordDemoPayment}>
            <label htmlFor="payment-amount">Amount to preview</label>
            <input id="payment-amount" type="number" min="1" max={balance} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required />
            <p className="form-hint">A mock payment record will be added to your browser. No real payment will occur.</p>
            <div className="dialog-actions">
              <button type="button" className="button button-secondary" onClick={() => setPayOpen(false)}>Cancel</button>
              <button type="submit" className="button button-primary">Record demo preview</button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
