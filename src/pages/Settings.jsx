import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { DemoNote, Modal, PageHeader, Panel } from "../components/UI.jsx";

const preferenceDefaults = { announcements: true, reminders: true, compactTables: false };

export default function Settings() {
  const { theme, setTheme, preferences, setPreferences } = useOutletContext();
  const [resetOpen, setResetOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  function updatePreference(key, value) {
    setPreferences((current) => ({ ...current, [key]: value }));
    setFeedback("Preference saved in this browser.");
  }

  function resetDemoData() {
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith("myau.") && key !== "myau.theme") window.localStorage.removeItem(key);
    }
    setPreferences(preferenceDefaults);
    setResetOpen(false);
    setFeedback("Demo data was cleared. Sample records return when you revisit a module.");
  }

  return (
    <>
      <PageHeader section="Preferences" title="Settings" description="Personalize your portal appearance and demo preferences." />
      {feedback ? <p className="feedback-message success" role="status" aria-live="polite">{feedback}</p> : null}
      <Panel title="Appearance" subtitle="Choose how the portal is displayed on this device.">
        <div className="settings-row">
          <div><strong>Color theme</strong><p>Switch between the light and dark interface.</p></div>
          <label className="select-control">Theme
            <select value={theme} onChange={(event) => { setTheme(event.target.value); setFeedback("Theme preference saved."); }}>
              <option value="light">Light</option><option value="dark">Dark</option>
            </select>
          </label>
        </div>
        <div className="settings-row">
          <div><strong>Compact tables</strong><p>Reduce row spacing in data tables.</p></div>
          <input type="checkbox" className="toggle-control" checked={preferences.compactTables} onChange={(event) => updatePreference("compactTables", event.target.checked)} aria-label="Use compact tables" />
        </div>
      </Panel>
      <Panel title="Notification preferences" subtitle="These switches control demonstration preferences only.">
        <Preference label="Campus announcements" description="Show announcement indicators in the portal." checked={preferences.announcements} onChange={(value) => updatePreference("announcements", value)} />
        <Preference label="Academic reminders" description="Include academic reminders in the dashboard." checked={preferences.reminders} onChange={(value) => updatePreference("reminders", value)} />
      </Panel>
      <Panel title="Demo data" subtitle="Manage information stored in this browser.">
        <div className="settings-row">
          <div><strong>Clear saved demo data</strong><p>Remove local enrollment, profile, evaluation, payment, and preference changes.</p></div>
          <button type="button" className="button button-danger" onClick={() => setResetOpen(true)}>Clear demo data</button>
        </div>
      </Panel>
      <DemoNote>Settings are stored locally in this browser and do not update a university account.</DemoNote>
      {resetOpen ? (
        <Modal title="Clear saved demo data?" description="This removes locally saved portal changes. The sample data will return when the page is reloaded." onClose={() => setResetOpen(false)}>
          <div className="dialog-actions">
            <button type="button" className="button button-secondary" onClick={() => setResetOpen(false)}>Cancel</button>
            <button type="button" className="button button-danger" onClick={resetDemoData}>Clear local data</button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}

function Preference({ label, description, checked, onChange }) {
  return (
    <label className="settings-row preference-row">
      <span><strong>{label}</strong><p>{description}</p></span>
      <input type="checkbox" className="toggle-control" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
