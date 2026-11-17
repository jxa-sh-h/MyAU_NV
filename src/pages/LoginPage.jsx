import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HelpSupport from "../components/HelpSupport.jsx";
import Icon from "../components/Icon.jsx";
import { findDemoAccount } from "../data/demoAccounts.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [acknowledged, setAcknowledged] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [demoNotice, setDemoNotice] = useState(null);
  const [, setSession] = useLocalStorage("myau-demo-session", null);

  useEffect(() => {
    if (acknowledged && !demoNotice) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [acknowledged, demoNotice]);

  function signIn(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = String(data.get("username") || "").trim();
    const password = String(data.get("password") || "");
    if (!username || !password) {
      setMessageTone("error");
      setMessage("Enter both your username and password.");
      return;
    }
    const account = findDemoAccount(username);
    if (!account || account.password !== password) {
      setMessageTone("error");
      setMessage("The username or password is incorrect. Please try again.");
      return;
    }
    setSession({ username: account.username });
    setMessageTone("success");
    setMessage("Sign-in successful. Opening your portal…");
    window.setTimeout(() => navigate("/index.html#dashboard"), 250);
  }

  return (
    <>
      <main className="login-page">
        <div className="login-layout">
          <section className="login-branding" aria-labelledby="login-title">
            <div className="login-title-lockup">
              <img className="login-university-logo" src="/img/auf_logo.png" alt="Angeles University Foundation crest" />
              <h1 id="login-title">MyAU</h1>
            </div>
            <h2 className="login-brand-tagline">Automated University</h2>
            <p className="login-description">
              Access academic information, enrollment, student accounts, and
              essential campus services through one convenient portal.
            </p>
            <HelpSupport variant="login" />
          </section>

          <section className="login-card" aria-labelledby="login-card-title">
            <div className="login-card-heading">
              <span className="login-card-eyebrow">Welcome to MyAU</span>
              <h2 id="login-card-title">Sign in to continue</h2>
              <p>Sign in with your AUF account.</p>
            </div>
            <form className="login-form" onSubmit={signIn}>
              <label htmlFor="login-username">Username</label>
              <input id="login-username" name="username" type="text" autoComplete="username" aria-describedby="login-feedback" />
              <label htmlFor="login-password">Password</label>
              <div className="login-password-wrap">
                <input id="login-password" name="password" type={passwordVisible ? "text" : "password"} autoComplete="current-password" aria-describedby="login-feedback" />
                <button className="login-password-toggle" type="button" onClick={() => setPasswordVisible((value) => !value)} aria-label={passwordVisible ? "Hide password" : "Show password"}>{passwordVisible ? "Hide" : "Show"}</button>
              </div>
              <button className="login-submit" type="submit">Login</button>
            </form>

            <div className="login-actions">
              <button type="button" onClick={() => setDemoNotice("forgot-password")}>Forgot password?</button>
              <p>New student? <button type="button" onClick={() => setDemoNotice("sign-up")}>Sign up</button></p>
            </div>
            <p className={`login-message${messageTone ? ` ${messageTone}` : ""}`} id="login-feedback" role="status" aria-live="polite">{message}</p>
          </section>
        </div>
      </main>
      {!acknowledged && <AcknowledgmentModal onAccept={() => setAcknowledged(true)} />}
      {demoNotice && <DemoActionDialog notice={demoNotice} onClose={() => setDemoNotice(null)} />}
    </>
  );
}

function DemoActionDialog({ notice, onClose }) {
  const dialogRef = useRef(null);
  const isSignUp = notice === "sign-up";

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="demo-action-dialog"
      aria-labelledby="demo-action-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <button className="demo-action-close" type="button" aria-label="Close notice" onClick={onClose}>X</button>
      <span className="login-card-eyebrow">Presentation demo</span>
      <h2 id="demo-action-title">{isSignUp ? "Student sign-up" : "Password recovery"}</h2>
      <p>{isSignUp ? "This MyAU website is only a demo for presentation. Student registration is not connected." : "This MyAU website is only a demo for presentation. Password recovery is not connected."}</p>
      <button className="login-submit" type="button" onClick={onClose}>Got it</button>
    </dialog>
  );
}

function AcknowledgmentModal({ onAccept }) {
  return (
    <div className="acknowledgment-backdrop">
      <section
        className="acknowledgment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="acknowledgment-title"
        aria-describedby="acknowledgment-description"
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            const buttons = [...event.currentTarget.querySelectorAll("button:not([disabled])")]
              .filter((button) => !button.closest("dialog"));
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <header className="acknowledgment-header">
          <img className="acknowledgment-brand-logo" src="/img/MYAU_logo.png" alt="" aria-hidden="true" />
          <span>
            <strong>AUF MyAU</strong>
            <small>Angeles University Foundation</small>
          </span>
        </header>
        <div className="acknowledgment-content">
          <span className="acknowledgment-shield"><Icon name="shield" /></span>
          <h1 id="acknowledgment-title">Welcome to AUF MyAU</h1>
          <p className="acknowledgment-subtitle">Prototype Access &amp; User Acknowledgment</p>
          <section className="acknowledgment-notice" id="acknowledgment-description">
            <h2>Important Notice</h2>
            <p>This website is an academic capstone project developed as a prototype redesign of the AUF MyAU Student Portal. It is intended for demonstration and educational purposes only.</p>
          </section>
          <h2 className="acknowledgment-list-title">Please be aware that:</h2>
          <ul className="acknowledgment-list">
            <li><Icon name="account" /><span>All student information and records displayed are fictional or sample data.</span></li>
            <li><Icon name="wallet" /><span>No actual payments, enrollment, or official transactions are processed.</span></li>
            <li><Icon name="shield" /><span>This prototype is not connected to the official AUF database or university systems.</span></li>
          </ul>
          <p className="acknowledgment-footer-copy">By proceeding, you acknowledge that you understand the prototype&apos;s purpose and limitations.</p>
          <button className="acknowledgment-accept" type="button" autoFocus onClick={onAccept}>I Understand and Agree</button>
        </div>
      </section>
    </div>
  );
}
