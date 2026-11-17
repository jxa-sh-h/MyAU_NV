import { useState } from "react";
import { Link } from "react-router-dom";
import { currentBalance, ledgerEntries, periodicDues } from "../data/mockData.js";
import { useActiveStudentAccount } from "../hooks/useActiveStudentAccount.js";
import Icon from "../components/Icon.jsx";
import { Feedback } from "../components/UI.jsx";

export function PaymentPage() {
  const { account, profile } = useActiveStudentAccount();
  const accountData = account.data ?? {};
  const activeBalance = accountData.currentBalance ?? currentBalance;
  const activeDues = accountData.periodicDues ?? periodicDues;
  const activeLedger = accountData.ledgerEntries ?? ledgerEntries;
  const activeFee = accountData.fee ?? { assessment: "72,714.00", grant: "12,014.00", paid: "25,000.00" };
  const [paymentType, setPaymentType] = useState("installment");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const paymentTypes = [
    { id: "installment", label: "Installment fee", description: "Pay a scheduled installment.", amount: `₱${activeDues[1][1]}` },
    { id: "other-fee", label: "Other school fee", description: "Settle laboratory or service-related fees.", amount: `₱${activeFee.otherFeeAmount ?? "1,919.00"}` },
    { id: "downpayment", label: "Downpayment", description: "Make an additional payment to your balance.", amount: `₱${activeFee.downpaymentAmount ?? "5,000.00"}` },
  ];
  const selectedPayment = paymentTypes.find(({ id }) => id === paymentType);

  function previewPayment() {
    setLoading(true);
    setFeedback("");
    window.setTimeout(() => {
      setFeedback(`Payment preview ready for ${selectedPayment.label} using ${paymentMethod === "card" ? "card" : paymentMethod === "wallet" ? "e-wallet" : "online banking"}.`);
      setLoading(false);
    }, 450);
  }

  return (
    <main className="payment-standalone" aria-label="Online payment">
      <header className="payment-standalone-header">
        <Link className="payment-brand" to="/index.html#dashboard"><img className="payment-brand-logo" src="/img/MYAU_logo.png" alt="" aria-hidden="true" /><strong>MyAU Pay</strong></Link>
        <Link className="payment-return" to="/index.html#dashboard">Back to portal <Icon name="arrow" /></Link>
      </header>
      <div className="payment-standalone-content">
        <section className="payment-summary-card" aria-labelledby="payment-summary-title">
          <div><p className="payment-eyebrow">Student account</p><h1 id="payment-summary-title">Payment summary</h1><p className="payment-student-name">{profile.name} <span>· {profile.id}</span></p></div>
          <div className="payment-balance-overview"><span>Outstanding balance</span><strong>{activeBalance.amount}</strong><small>First Semester, 2026–2027</small></div>
        </section>
        <section className="payment-checkout" aria-labelledby="make-payment-title">
          <div className="payment-checkout-main">
            <h2 id="make-payment-title">Make a payment</h2>
            <p>Choose what you would like to pay, then select a payment method.</p>
            <div className="payment-type-options" role="radiogroup" aria-label="Payment type">
              {paymentTypes.map((option) => <label className={`payment-type-option${paymentType === option.id ? " selected" : ""}`} key={option.id}>
                <input type="radio" name="payment-type" value={option.id} checked={paymentType === option.id} onChange={() => { setPaymentType(option.id); setFeedback(""); }} />
                <span><strong>{option.label}</strong><small>{option.description}</small></span><b>{option.amount}</b>
              </label>)}
            </div>
            <h3>Payment method</h3>
            <div className="payment-method-options" role="radiogroup" aria-label="Payment method">
              {[['card', 'Card', 'Debit or credit card'], ['wallet', 'E-wallet', 'GCash or Maya'], ['bank', 'Online banking', 'Bank transfer']].map(([id, label, detail]) => <label className={paymentMethod === id ? "selected" : ""} key={id}>
                <input type="radio" name="payment-method" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} />
                <span><strong>{label}</strong><small>{detail}</small></span>
              </label>)}
            </div>
          </div>
          <aside className="payment-order-summary">
            <h2>Payment details</h2>
            <dl><div><dt>Payment for</dt><dd>{selectedPayment.label}</dd></div><div><dt>Amount</dt><dd>{selectedPayment.amount}</dd></div></dl>
            <button className="button button-primary" type="button" onClick={previewPayment} disabled={loading}>{loading ? <><span className="loading-spinner" />Preparing…</> : "Preview payment"}</button>
            <Feedback>{feedback}</Feedback>
          </aside>
        </section>
        <section className="payment-help" aria-labelledby="payment-help-title">
          <div><p className="payment-eyebrow">Help</p><h2 id="payment-help-title">Payment instructions</h2><p>Review the payment process before you continue.</p><div className="payment-help-actions"><a className="button button-secondary" href="/payment_instruction.pdf" target="_blank" rel="noreferrer">Open PDF <Icon name="external" /></a><a className="text-link" href="/payment_instruction.pdf" download>Download PDF</a></div></div>
          <iframe src="/payment_instruction.pdf#zoom=125" title="Payment instructions PDF" />
        </section>
        <section className="payment-account-details" aria-labelledby="payment-account-details-title">
          <div className="payment-section-heading"><div><p className="payment-eyebrow">Account details</p><h2 id="payment-account-details-title">Charges and payment activity</h2></div><span>Current term</span></div>
          <div className="payment-tables">
            <section><h3>Current charges</h3><table><thead><tr><th>Item</th><th>Amount</th></tr></thead><tbody><tr><td>Tuition and school fees</td><td>₱{activeFee.assessment}</td></tr><tr><td>Scholarship / grant</td><td>− ₱{activeFee.grant}</td></tr><tr><td>Payments received</td><td>− ₱{activeFee.paid}</td></tr></tbody></table></section>
            <section><h3>Installment schedule</h3><p className="payment-table-note">Original schedule. Grants and payments applied to date are reflected in the outstanding balance.</p><table><thead><tr><th>Due period</th><th>Amount</th></tr></thead><tbody>{activeDues.map(([period, amount]) => <tr key={period}><td>{period}</td><td>₱{amount}</td></tr>)}</tbody></table></section>
            <section><h3>Recent payments</h3><table><thead><tr><th>Date</th><th>Amount</th></tr></thead><tbody>{activeLedger.filter(([, , , debit, credit]) => debit === "—" && credit !== "0.00").slice(-3).reverse().map(([date, , , , credit]) => <tr key={`${date}-${credit}`}><td>{date}</td><td>₱{credit}</td></tr>)}</tbody></table></section>
          </div>
        </section>
      </div>
    </main>
  );
}
