import { useState } from "react";
import { student } from "../data/mockData.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { DemoNote, Feedback, Modal, PageHeader, Panel } from "../components/UI.jsx";

const initialProfile = {
  fullName: student.fullName,
  email: student.email,
  phone: student.phone,
  address: student.address,
};

export default function StudentProfile() {
  const [profile, setProfile] = useLocalStorage("myau.profile", initialProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [feedback, setFeedback] = useState("");

  function startEditing() {
    setDraft(profile);
    setFeedback("");
    setEditing(true);
  }

  function saveProfile(event) {
    event.preventDefault();
    setProfile(draft);
    setEditing(false);
    setFeedback("Profile changes saved in this browser's demo data.");
  }

  function restoreProfile() {
    setProfile(initialProfile);
    setDraft(initialProfile);
    setFeedback("Fictional demo profile restored.");
  }

  return (
    <>
      <PageHeader section="My Account" title="Student Profile" description="Manage your fictional student contact information." actions={
        <button className="button button-primary" type="button" onClick={startEditing}>Edit profile</button>
      } />
      <Feedback>{feedback}</Feedback>
      <Panel title="Student information" subtitle="Identity information is sample data and cannot be changed here.">
        <div className="profile-overview">
          <div className="avatar profile-avatar">JA</div>
          <div><h2>{profile.fullName}</h2><p>{student.program} · {student.yearLevel}</p><span className="badge badge-neutral">Student ID · {student.id}</span></div>
        </div>
        <div className="profile-details">
          <Info label="Student email" value={profile.email} />
          <Info label="Phone number" value={profile.phone} />
          <Info label="Address" value={profile.address} />
          <Info label="Academic year" value={student.academicYear} />
          <Info label="Program" value={student.program} />
          <Info label="Year level" value={student.yearLevel} />
        </div>
        <div className="panel-actions"><button className="text-button" type="button" onClick={restoreProfile}>Restore fictional demo details</button></div>
      </Panel>
      <DemoNote>Profile changes are saved in local browser storage only. Never enter real personal or account information.</DemoNote>
      {editing ? (
        <Modal title="Edit contact information" description="Changes are saved only in this browser." onClose={() => setEditing(false)}>
          <form className="demo-form dialog-form" onSubmit={saveProfile}>
            <label htmlFor="profile-name">Display name</label>
            <input id="profile-name" required maxLength="80" value={draft.fullName} onChange={(event) => setDraft({ ...draft, fullName: event.target.value })} />
            <label htmlFor="profile-email">Student email</label>
            <input id="profile-email" type="email" required value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
            <label htmlFor="profile-phone">Phone number</label>
            <input id="profile-phone" type="tel" required minLength="7" maxLength="20" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} />
            <label htmlFor="profile-address">Address</label>
            <input id="profile-address" required maxLength="120" value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} />
            <div className="dialog-actions">
              <button type="button" className="button button-secondary" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="button button-primary">Save demo profile</button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}

function Info({ label, value }) {
  return <div className="profile-detail"><small>{label}</small><strong>{value}</strong></div>;
}
