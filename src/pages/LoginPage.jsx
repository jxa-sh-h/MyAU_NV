import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { findDemoAccount } from "../data/demoAccounts.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [, setSession] = useLocalStorage("myau-demo-session", null);

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
    <main className="login-page">
      <div className="login-layout">
        <section className="login-branding" aria-labelledby="login-title">
          <div className="login-title-lockup">
            <img className="login-university-logo" src="/img/auf_logo.png" alt="Angeles University Foundation crest" />
            <h1 id="login-title">MyAU</h1>
          </div>
          <h2 className="login-brand-tagline">Your university, all in one place.</h2>
          <p>
            Access academic information, enrollment, student accounts, and
            essential campus services through one convenient portal.
          </p>
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

          <p className={`login-message${messageTone ? ` ${messageTone}` : ""}`} id="login-feedback" role="status" aria-live="polite">{message}</p>
        </section>
      </div>
    </main>
  );
}
