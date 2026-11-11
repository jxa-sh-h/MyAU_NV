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
          <div className="login-university-mark" aria-label="Angeles University Foundation">
            <span>AUF</span>
          </div>
          <h1 id="login-title">AUF MyAU</h1>
          <p>
            The all-in-one portal for administrative staff, integrated school,
            faculty members, parents, and students of Angeles University
            Foundation to access essential university services, information, and
            academic resources.
          </p>
        </section>

        <section className="login-card" aria-labelledby="login-card-title">
          <h2 id="login-card-title">Student/Parent/New Student Login</h2>
          <form className="login-form" onSubmit={signIn}>
            <label htmlFor="login-username">Username:</label>
            <input id="login-username" name="username" type="text" autoComplete="username" />
            <label htmlFor="login-password">Password:</label>
            <input id="login-password" name="password" type="password" autoComplete="current-password" />
            <button className="login-submit" type="submit">Login</button>
          </form>

          <button className="login-text-link" type="button" onClick={() => setMessage("Password recovery is not available in this demo.")}>
            Forgot password
          </button>
          <button className="login-text-link login-register-link" type="button" onClick={() => setMessage("New student registration is not available in this demo.")}>
            New student? Sign up here
          </button>
          <p className="login-message" role="status" aria-live="polite">{message}</p>
        </section>
      </div>
    </main>
  );
}
