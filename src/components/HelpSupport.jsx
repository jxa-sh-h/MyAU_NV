import { useEffect, useRef, useState } from "react";

const supportContacts = [
  { service: "AUF", email: "universityrelations@auf.edu.ph", description: "For student services" },
  { service: "MyAU Mail", email: "mailadmin@auf.edu.ph", description: "For MyAU Mail concerns" },
  { service: "Canvas AUF", email: "myclass@auf.edu.ph", description: "For Canvas AUF concerns" },
  { service: "MISS", email: "miss@auf.edu.ph", description: "For MyAU account concerns" },
];

export default function HelpSupport({ variant }) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, [isOpen]);

  return (
    <div className={`help-support help-support-${variant}`}>
      <button
        className="help-support-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-label="Need help? Contact AUF support"
        onClick={() => setIsOpen(true)}
      >
        <span className="help-support-icon" aria-hidden="true">?</span>
        <span className="help-support-trigger-copy">
          <strong>Need help?</strong>
          <span>{variant === "sidebar" ? "View support contacts" : "Contact AUF support"}</span>
        </span>
      </button>
      <dialog
        ref={dialogRef}
        className="help-support-dialog"
        aria-labelledby={`help-support-title-${variant}`}
        onCancel={(event) => {
          event.preventDefault();
          setIsOpen(false);
        }}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <button className="help-support-close" type="button" aria-label="Close support contacts" onClick={() => setIsOpen(false)}>×</button>
        <span className="login-card-eyebrow">AUF support</span>
        <h2 id={`help-support-title-${variant}`}>How can we help?</h2>
        <p className="help-support-intro">Email the team that handles your concern.</p>
        <ul className="help-support-list">
          {supportContacts.map(({ service, email, description }) => (
            <li key={email}>
              <strong>{service}</strong>
              <a href={`mailto:${email}`}>{email}</a>
              <span>{description}</span>
            </li>
          ))}
        </ul>
        <button className="help-support-done" type="button" onClick={() => setIsOpen(false)}>Close</button>
      </dialog>
    </div>
  );
}
