import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  function signIn(event) {
    event.preventDefault();
    navigate("/index.html#dashboard");
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
            <p>For students and parents</p>
          </div>
          <form className="login-form" onSubmit={signIn}>
            <label htmlFor="login-username">Username</label>
            <input id="login-username" name="username" type="text" autoComplete="username" />
            <label htmlFor="login-password">Password</label>
            <input id="login-password" name="password" type="password" autoComplete="current-password" />
            <button className="login-submit" type="submit">Login</button>
          </form>

          <button className="login-text-link login-forgot-link" type="button" onClick={() => setMessage("Password recovery is not available in this demo.")}>
            Forgot password
          </button>
          <p className="login-message" role="status" aria-live="polite">{message}</p>
          <div className="login-register">
            <span>New to AUF?</span>
            <button className="login-text-link" type="button" onClick={() => setMessage("New student registration is not available in this demo.")}>
              Sign up here
            </button>
          </div>
          <p className="login-demo-note">Demo portal · Login does not require credentials</p>
        </section>
      </div>
    </main>
  );
}
