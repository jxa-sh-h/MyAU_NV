import { useState } from "react";
import { Link } from "react-router-dom";
import { ledgerEntries, pages } from "../data/mockData.js";
import { useStudentProfile } from "../contexts/StudentProfileContext.jsx";
import Icon from "../components/Icon.jsx";
import { Badge, DataTable, Feedback, Panel } from "../components/UI.jsx";
import { Overview, PageIntro, usePortalData } from "./PortalPageShared.jsx";

export function AdmissionPage() {
  const { profile, submittedRequirements: accountSubmittedRequirements } = usePortalData();
  const [uploads, setUploads] = useState(() => profile.id === "24-1661-908" ? [
    { id: "picture-name", name: "2x2.png", type: "image/png", url: "/submitted-requirements/2x2.png", uploadedAt: "06/22/2024", isObjectUrl: false },
    { id: "birth-certificate", name: "PSA.jpg", type: "image/jpeg", url: "/submitted-requirements/PSA.jpg", uploadedAt: "06/22/2024", isObjectUrl: false },
    { id: "official-receipt", name: "official_receipt.jpg", type: "image/jpeg", url: "/submitted-requirements/official_receipt.jpg", uploadedAt: "06/22/2024", isObjectUrl: false },
    { id: "report-card", name: "report_card.jpg", type: "image/jpeg", url: "/submitted-requirements/report_card.jpg", uploadedAt: "06/22/2024", isObjectUrl: false },
    { id: "good-moral", name: "good_moral.jpg", type: "image/jpeg", url: "/submitted-requirements/good_moral.jpg", uploadedAt: "06/22/2024", isObjectUrl: false },
    { id: "picture", name: "2x2.png", type: "image/png", url: "/submitted-requirements/2x2.png", uploadedAt: "06/22/2024", isObjectUrl: false },
  ] : []);
  const [previewId, setPreviewId] = useState(null);
  const pendingRequirements = [
    { id: "passport", label: "For Filipinos born abroad — valid Philippine passport data pages and latest arrival stamp page" },
    { id: "dual-citizenship", label: "For dual citizens — documentation for acquisition, reacquisition, or retention of Filipino citizenship" },
  ];
  const submittedRequirements = accountSubmittedRequirements ?? [
    { id: "picture-name", label: "2×2 picture with name (clear, well-defined, white background)", date: "06/22/2024" },
    { id: "birth-certificate", label: "PSA Birth Certificate (or issued by the country of origin)", date: "06/22/2024" },
    { id: "official-receipt", label: "Official Receipt (for payment of application fee)", date: "06/22/2024" },
    { id: "report-card", label: "Report Card (1st and 2nd Semester)", date: "06/22/2024" },
    { id: "good-moral", label: "Good Moral Certificate", date: "06/22/2024" },
    { id: "picture", label: "2×2 picture", date: "06/22/2024" },
  ];

  function uploadDocument(event, requirement) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploads((items) => {
      const existing = items.find((item) => item.id === requirement.id);
      if (existing?.isObjectUrl) URL.revokeObjectURL(existing.url);
      return [...items.filter((item) => item.id !== requirement.id), { ...requirement, name: file.name, type: file.type, url, uploadedAt: new Date().toLocaleString(), isObjectUrl: true }];
    });
    setPreviewId(requirement.id);
    event.target.value = "";
  }

  function removeUpload(id) {
    setUploads((items) => {
      const existing = items.find((item) => item.id === id);
      if (existing?.isObjectUrl) URL.revokeObjectURL(existing.url);
      return items.filter((item) => item.id !== id);
    });
    if (previewId === id) setPreviewId(null);
  }

  function RequirementRow({ requirement, pending = false }) {
    const upload = uploads.find((item) => item.id === requirement.id);
    const previewOpen = previewId === requirement.id && upload;
    const isImage = upload?.type.startsWith("image/");
    const isPdf = upload?.type === "application/pdf";
    return <article className="admission-requirement">
      <div className="admission-requirement-copy"><h3>{requirement.label}</h3><p>{pending ? "Upload when this requirement applies to you." : `Record date: ${requirement.date}`}</p>{upload && <p className="admission-file-name">{upload.name}</p>}</div>
      <div className="admission-requirement-actions"><label className="button button-secondary" htmlFor={`admission-${requirement.id}`}>{upload ? "Replace file" : "Upload file"}<input id={`admission-${requirement.id}`} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => uploadDocument(event, requirement)} /></label>{upload && <><button className="text-button" type="button" onClick={() => setPreviewId(previewOpen ? null : requirement.id)}>{previewOpen ? "Hide preview" : "Preview"}</button><button className="text-button admission-remove" type="button" onClick={() => removeUpload(requirement.id)}>Remove</button></>}</div>
      {previewOpen && <div className="admission-preview">{isImage ? <img src={upload.url} alt={`Preview of ${upload.name}`} /> : isPdf ? <iframe src={`${upload.url}#view=FitH`} title={`Preview of ${upload.name}`} /> : <a className="button button-secondary" href={upload.url} target="_blank" rel="noreferrer">Open selected file <Icon name="external" /></a>}</div>}
    </article>;
  }

  return (
    <>
      <PageIntro page={pages["submit-admission-requirement"]} />
      <section className="admission-page" aria-label="Admission requirements">
        <div className="admission-intro"><h2>Admission requirements</h2><p>Select a requirement to upload a PDF or image and preview it before leaving this page.</p></div>
        <section className="admission-group" aria-labelledby="pending-requirements-title"><h2 id="pending-requirements-title">Additional requirements, if applicable</h2>{pendingRequirements.map((requirement) => <RequirementRow requirement={requirement} pending key={requirement.id} />)}</section>
        <section className="admission-group" aria-labelledby="submitted-requirements-title"><h2 id="submitted-requirements-title">Submitted requirements</h2>{submittedRequirements.length > 0 ? submittedRequirements.map((requirement) => <RequirementRow requirement={requirement} key={requirement.id} />) : <p className="empty-state">No admission requirements have been submitted for this demo account.</p>}</section>
      </section>
    </>
  );
}

export function PersonalContent({ pageId }) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const { profile, setProfile } = useStudentProfile();
  const isDemoAccount = profile.id === "00-0000-00";
  if (pageId === "personal-information") {
    return <Overview page={pages[pageId]} ids={["view-personal-info", "edit-personal-info", "print-personal-info", "change-password"]} />;
  }
  if (pageId === "view-personal-info") {
    const profileRows = [
      ["Student ID", profile.id],
      ["Student name", profile.name],
      ["Email address", profile.email || "Not provided"],
      ["Program", profile.program],
      ["Year level", profile.yearLevel],
      ["Academic year", profile.academicYear],
      ["Address", [profile.addressLine, profile.barangay, profile.city, profile.province].filter(Boolean).join(", ") || "Not provided"],
      ["Contact mobile", profile.contactMobile || "Not provided"],
      ["Alternate contact number", profile.alternateContact || "Not provided"],
      ["Emergency contact", profile.emergencyContactName || "Not provided"],
      ["Emergency contact number", profile.emergencyContactNumber || "Not provided"],
      ["Relationship to emergency contact", profile.emergencyRelationship || "Not provided"],
    ];
    return (
      <>
        <PageIntro page={pages[pageId]} />
        <Panel title="Personal information">
          {!isDemoAccount && <div className="profile-view-heading">
            <img className="profile-photo" src="/submitted-requirements/2x2.png" alt="Student profile" />
            <p>Student profile photo</p>
          </div>}
          <DataTable headers={["Information", "Details"]} rows={profileRows} label="Personal information" />
          <Link className="button button-primary personal-edit-button" to="/index.html#edit-personal-info">Edit personal information</Link>
        </Panel>
      </>
    );
  }
  if (pageId === "edit-personal-info") {
    function savePersonalInfo(event) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      setProfile((currentProfile) => ({
        ...currentProfile,
        addressLine: formData.get("address-line").trim(),
        barangay: formData.get("barangay").trim(),
        city: formData.get("city").trim(),
        province: formData.get("province").trim(),
        contactMobile: formData.get("contact-mobile").trim(),
        alternateContact: formData.get("alternate-contact").trim(),
        emergencyContactName: formData.get("emergency-contact-name").trim(),
        emergencyContactNumber: formData.get("emergency-contact-number").trim(),
        emergencyRelationship: formData.get("emergency-relationship").trim(),
      }));
      setFeedback("Personal information updated.");
    }

    return (
      <>
        <PageIntro page={pages[pageId]} />
        <section className="panel form-panel">
          <div className="panel-header"><div><h2>Student profile and contact information</h2><p>Student identity details are fixed. Update your address and contact information below.</p></div></div>
          <form className="demo-form profile-form" onSubmit={savePersonalInfo}>
            <section className={`profile-overview${isDemoAccount ? " profile-overview-no-photo" : ""}`} aria-label="Student profile">
              {!isDemoAccount && <div className="profile-photo-wrap">
                <img className="profile-photo" src="/submitted-requirements/2x2.png" alt="Student profile" />
                <span>2 × 2 profile photo</span>
              </div>}
              <div className="profile-overview-details">
                <h3>Fixed student information</h3>
                <div className="profile-fixed-grid">
                  <label htmlFor="personal-name">Student name<input id="personal-name" type="text" value={profile.name} disabled /></label>
                  <label className="profile-field-wide" htmlFor="personal-email">Email address<input id="personal-email" type="email" value={profile.email ?? ""} title={profile.email ?? ""} disabled /></label>
                  <label htmlFor="personal-id">Student ID<input id="personal-id" type="text" value={profile.id} disabled /></label>
                  <label htmlFor="personal-program">Program<input id="personal-program" type="text" value={profile.program} disabled /></label>
                  <label htmlFor="personal-year">Year level<input id="personal-year" type="text" value={profile.yearLevel} disabled /></label>
                  <label htmlFor="personal-academic-year">Academic year<input id="personal-academic-year" type="text" value={profile.academicYear} disabled /></label>
                </div>
              </div>
            </section>
            <div className="profile-section-heading"><h3>Address and contact information</h3><p>Keep these details current so the university can reach you.</p></div>
            <div className="profile-field-grid">
              <label className="profile-field-wide" htmlFor="personal-address-line">House number and street<input id="personal-address-line" name="address-line" type="text" maxLength="150" defaultValue={profile.addressLine ?? ""} autoComplete="street-address" /></label>
              <label htmlFor="personal-barangay">Barangay<input id="personal-barangay" name="barangay" type="text" maxLength="100" defaultValue={profile.barangay ?? ""} /></label>
              <label htmlFor="personal-city">City / Municipality<input id="personal-city" name="city" type="text" maxLength="100" defaultValue={profile.city ?? ""} autoComplete="address-level2" /></label>
              <label htmlFor="personal-province">Province<input id="personal-province" name="province" type="text" maxLength="100" defaultValue={profile.province ?? ""} autoComplete="address-level1" /></label>
              <label htmlFor="personal-mobile">Contact mobile<input id="personal-mobile" name="contact-mobile" type="tel" maxLength="30" defaultValue={profile.contactMobile ?? ""} autoComplete="tel" /></label>
              <label htmlFor="personal-alternate-contact">Alternate contact number<input id="personal-alternate-contact" name="alternate-contact" type="tel" maxLength="30" defaultValue={profile.alternateContact ?? ""} /></label>
            </div>
            <div className="profile-section-heading"><h3>Emergency contact</h3><p>Provide someone the university may contact if needed.</p></div>
            <div className="profile-field-grid">
              <label htmlFor="personal-emergency-name">Contact person<input id="personal-emergency-name" name="emergency-contact-name" type="text" maxLength="100" defaultValue={profile.emergencyContactName ?? ""} autoComplete="name" /></label>
              <label htmlFor="personal-emergency-number">Contact number<input id="personal-emergency-number" name="emergency-contact-number" type="tel" maxLength="30" defaultValue={profile.emergencyContactNumber ?? ""} /></label>
              <label htmlFor="personal-emergency-relationship">Relationship<input id="personal-emergency-relationship" name="emergency-relationship" type="text" maxLength="50" defaultValue={profile.emergencyRelationship ?? ""} /></label>
            </div>
            <button className="button button-primary" type="submit">Save personal information</button>
            <Feedback>{feedback}</Feedback>
          </form>
        </section>
      </>
    );
  }
  if (pageId === "print-personal-info") {
    return <><PageIntro page={pages[pageId]} /><Panel title="Print Personal Info"><p className="panel-copy">Print the current personal information view.</p><button className="button button-secondary" type="button" onClick={() => window.print()}>Print this page <Icon name="file" /></button></Panel></>;
  }
  function validatePassword(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("new-password") !== data.get("confirm-password")) {
      setFeedback("The passwords do not match. Please check both entries.");
      return;
    }
    setLoading(true);
    setFeedback("");
    window.setTimeout(() => {
      setFeedback("Your passwords match.");
      form.reset();
      setLoading(false);
    }, 300);
  }
  return (
    <>
      <PageIntro page={pages[pageId]} />
      <section className="panel form-panel">
        <div className="panel-header"><div><h2>Change Password</h2><p>Enter and confirm your new password.</p></div></div>
        <form className="demo-form" id="password-form" onSubmit={validatePassword}>
          <label htmlFor="new-password">New password</label><input id="new-password" name="new-password" type="password" minLength="8" autoComplete="new-password" required />
          <label htmlFor="confirm-password">Confirm new password</label><input id="confirm-password" name="confirm-password" type="password" minLength="8" autoComplete="new-password" required />
          <button className="button button-primary" type="submit" disabled={loading}>{loading ? <><span className="loading-spinner" />Checking…</> : "Confirm new password"}</button>
          <Feedback tone={feedback.startsWith("The passwords") ? "error" : "success"}>{feedback}</Feedback>
        </form>
      </section>
    </>
  );
}

export const feePaymentSubjects = [
  ["CEDDES", "COMPUTER ENGINEERING DRAFTING AND DESIGN", "TH 1:00PM–4:00PM", "BSCPE 3-A/EA-512", "1.0"],
  ["CISCO2", "CISCO 2", "M 9:00AM–12:00PM", "BSCPE 3-A/EA-612", "3.0"],
  ["DADICO", "DATA AND DIGITAL COMMUNICATIONS", "M 1:00PM–4:00PM", "BSCPE 3-A/EA-303", "3.0"],
  ["ELECT1", "COGNATE/ELECTIVE COURSE 1", "W 4:30PM–7:30PM", "BSCPE 3-A/EA-512", "3.0"],
  ["FECOSY", "FEEDBACK AND CONTROL SYSTEM", "W 9:00AM–12:00PM", "BSCPE 3-A/EA-506 / EA-512", "4.0"],
  ["INTHDL", "INTRODUCTION TO HDL", "W 1:00PM–4:00PM", "BSCPE 3-A/EA-512", "1.0"],
  ["LOCIDE", "LOGIC CIRCUIT AND DESIGN", "T 1:00PM–4:00PM", "BSCPE 3-A/EA-504", "4.0"],
  ["OPESYS", "OPERATING SYSTEM", "F 1:00PM–4:00PM", "BSCPE 3-A/EA-603", "3.0"],
];

export const otherCharges = [
  ["ACCIDENT INSURANCE", "100.00"], ["AUF HEALTH PROGRAM", "224.00"], ["CPA FEE", "200.00"], ["ICPE MEMBERSHIP FEE", "1,000.00"],
  ["INTERNET (LMS FEE)", "605.00"], ["PIONEER", "100.00"], ["RECOLLECTION FEE", "947.00"], ["SAF", "1,500.00"],
  ["USC", "100.00"], ["CISCO FEE", "764.00"], ["CEDDES LAB", "2,297.00"], ["CISCO 2 LAB", "2,297.00"],
  ["ELECT1 LAB FEE", "1,919.00"], ["FECOSY LAB", "1,919.00"], ["INTHDL LAB", "1,919.00"], ["LOCIDE LAB", "1,919.00"],
];

export function FeePaymentDocument() {
  const { profile, subjects: activeSubjects, fee } = usePortalData();
  const documentSubjects = profile.program === "BSCE"
    ? activeSubjects.map(([code, title, , units], index) => [code, title.toUpperCase(), ["M 8:00AM–11:00AM", "T 1:00PM–4:00PM", "W 8:00AM–11:00AM", "TH 1:00PM–4:00PM"][index % 4], `BSCE 2-A/CE-${201 + index}`, units])
    : feePaymentSubjects;
  const totalUnits = documentSubjects.reduce((sum, [, , , , units]) => sum + Number(units), 0).toFixed(1);
  const feeData = fee ?? { tuition: "48,056.00", miscellaneous: "6,848.00", otherCharges: "17,810.00", assessment: "72,714.00", grant: "12,014.00", paid: "5,000.00", balance: "55,700.00" };
  const chargeRows = feeData.otherChargesDetails ?? otherCharges;
  const installmentRows = feeData.installments ?? [["PRELIM DUE", "18,500.00"], ["MIDTERM DUE", "18,500.00"], ["FINAL DUE", "18,700.00"]];
  const printedAt = new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short" }).format(new Date());
  return (
    <>
      <div className="document-page-actions">
        <button className="button button-primary" type="button" onClick={() => window.print()}><Icon name="file" /> Print or save as PDF</button>
      </div>
      <article className="fee-payment-document" aria-labelledby="fee-payment-title">
        <header className="fee-document-header">
          <div><h1 id="fee-payment-title">FEE PAYMENT DETAILS</h1><p>1st Semester AY 2026 - 2027</p></div>
          <time>Date and time printed: {printedAt}</time>
        </header>

        <section className="fee-student-details" aria-label="Student details">
          <dl><div><dt>Student ID</dt><dd>{profile.id}</dd></div><div><dt>Student Name</dt><dd>{profile.name}</dd></div><div><dt>Student type</dt><dd>{feeData.studentType ?? "Old / Regular"}</dd></div></dl>
          <dl><div><dt>Course/Major</dt><dd>{profile.program === "BSCE" ? "Bachelor of Science in Civil Engineering" : profile.program.includes("(Demo)") ? "Bachelor of Science in Computer Engineering (Demo)" : "Bachelor of Science in Computer Engineering"}</dd></div><div><dt>Year Level</dt><dd>{profile.yearLevel}</dd></div></dl>
          <dl><div><dt>Gender</dt><dd>{feeData.gender ?? "Male"}</dd></div></dl>
        </section>

        <section className="fee-subjects" aria-labelledby="fee-subjects-title">
          <h2 id="fee-subjects-title" className="visually-hidden">Enrolled subjects</h2>
          <table>
            <thead><tr><th>Subject code</th><th>Subject title</th><th>Schedule</th><th>Section/Room #</th><th>Units taken</th></tr></thead>
            <tbody>{documentSubjects.map(([code, title, schedule, room, units]) => <tr key={code}><td data-label="Subject code">{code}</td><td data-label="Subject title">{title}</td><td data-label="Schedule">{schedule}</td><td data-label="Section/Room #">{room}</td><td data-label="Units taken">{units}</td></tr>)}</tbody>
          </table>
          <p className="fee-total-units">TOTAL LOAD UNITS: <strong>{totalUnits}</strong></p>
        </section>

        <section className="fee-financial-details">
          <div className="fee-charge-summary">
            <dl><div><dt>TUITION FEE</dt><dd>{feeData.tuition}</dd></div><div><dt>MISCELLANEOUS FEES</dt><dd>{feeData.miscellaneous}</dd></div></dl>
            <h2>OTHER CHARGES</h2>
            <dl>{chargeRows.map(([label, amount]) => <div key={label}><dt>{label}</dt><dd>{amount}</dd></div>)}<div className="fee-subtotal"><dt>TOTAL OTHER CHARGE</dt><dd>{feeData.otherCharges}</dd></div></dl>
            <dl className="fee-grand-totals"><div><dt>TOTAL ASSESSMENT</dt><dd>Php {feeData.assessment}</dd></div><div><dt>OLD ACCOUNT</dt><dd>Php {feeData.oldAccount ?? "0.00"}</dd></div><div><dt>SCHOLARSHIP/GRANT APPLIED</dt><dd>Php {feeData.grant}</dd></div><div><dt>BALANCE AFTER GRANT AND DOWNPAYMENT</dt><dd>Php {feeData.balance}</dd></div></dl>
          </div>
          <div className="fee-payment-summary">
            <dl><div><dt>PAYMENT MODE</dt><dd>{feeData.paymentMode ?? "Installment"}</dd></div><div><dt>AMOUNT PAID</dt><dd>{feeData.paid}</dd></div><div><dt>DATE PAID</dt><dd>{feeData.datePaid ?? "07/18/2026"}</dd></div><div><dt>PAYMENT TYPE</dt><dd>{feeData.paymentType ?? "Cash"}</dd></div><div><dt>REFERENCE NUMBER</dt><dd>{feeData.referenceNumber ?? "0007900"}</dd></div></dl>
            <p className="fee-receipt">(Business Office) Receipt printed by: <u>{profile.name}</u></p>
            <dl className="fee-installments">{installmentRows.map(([period, amount]) => <div key={period}><dt>{period.toUpperCase()} DUE</dt><dd>{amount}</dd></div>)}</dl>
            <p className="fee-note">(NOTE: Above installment schedule may change based on actual payment and after enrolment adjustments.)</p>
          </div>
        </section>
      </article>
    </>
  );
}

export const ledgerTerms = [
  {
    schoolYear: "2024–2025", semester: "First Semester", balance: "0.00", entries: [
      ["07/18/2024", "Tuition and school fees", "—", "54,400.00", "—", "54,400.00"],
      ["07/18/2024", "Enrollment/downpayment - Cash", "Business Office", "—", "10,000.00", "44,400.00"],
      ["09/12/2024", "Tuition - Cash", "Business Office", "—", "22,200.00", "22,200.00"],
      ["11/15/2024", "Tuition - Cash", "Business Office", "—", "22,200.00", "0.00"],
    ],
  },
  {
    schoolYear: "2024–2025", semester: "Second Semester", balance: "0.00", entries: [
      ["01/16/2025", "Tuition and school fees", "—", "53,850.00", "—", "53,850.00"],
      ["01/16/2025", "Enrollment/downpayment - Cash", "Business Office", "—", "10,000.00", "43,850.00"],
      ["03/11/2025", "Tuition - Cash", "Business Office", "—", "21,925.00", "21,925.00"],
      ["05/15/2025", "Tuition - Cash", "Business Office", "—", "21,925.00", "0.00"],
    ],
  },
  {
    schoolYear: "2025–2026", semester: "First Semester", balance: "0.00", entries: [
      ["07/17/2025", "Tuition and school fees", "—", "59,600.00", "—", "59,600.00"],
      ["07/17/2025", "Enrollment/downpayment - Cash", "Business Office", "—", "12,000.00", "47,600.00"],
      ["09/18/2025", "Academic grant", "—", "—", "8,000.00", "39,600.00"],
      ["11/14/2025", "Tuition - Cash", "Business Office", "—", "39,600.00", "0.00"],
    ],
  },
  {
    schoolYear: "2025–2026", semester: "Second Semester", balance: "0.00", entries: [
      ["01/15/2026", "Tuition and school fees", "—", "61,150.00", "—", "61,150.00"],
      ["01/15/2026", "Enrollment/downpayment - Cash", "Business Office", "—", "12,000.00", "49,150.00"],
      ["03/13/2026", "Tuition - Cash", "Business Office", "—", "24,575.00", "24,575.00"],
      ["05/16/2026", "Tuition - Cash", "Business Office", "—", "24,575.00", "0.00"],
    ],
  },
  { schoolYear: "2026–2027", semester: "First Semester", balance: "35,700.00", entries: ledgerEntries },
];

export function LedgerPage() {
  const { ledgerEntries: activeLedgerEntries, ledgerTerms: activeLedgerTerms, currentBalance: activeBalance } = usePortalData();
  const [schoolYear, setSchoolYear] = useState("2026–2027");
  const [semester, setSemester] = useState("First Semester");
  const ledgerTermSource = activeLedgerTerms ?? ledgerTerms;
  const latestLedgerTerm = ledgerTermSource.at(-1);
  const accountLedgerTerms = [...ledgerTermSource.slice(0, -1), { ...latestLedgerTerm, balance: activeBalance.amount.replace("₱", ""), entries: activeLedgerEntries }];
  const schoolYears = [...new Set(accountLedgerTerms.map(({ schoolYear: value }) => value))];
  const semesters = [...new Set(accountLedgerTerms.map(({ semester: value }) => value))];
  const visibleTerms = accountLedgerTerms.filter((term) => (schoolYear === "all" || term.schoolYear === schoolYear) && (semester === "all" || term.semester === semester));
  const latestBalance = visibleTerms.at(-1)?.balance ?? "0.00";

  return (
    <>
      <PageIntro page={pages.ledger} />
      <section className="ledger-filter-panel" aria-labelledby="ledger-filter-title">
        <div><h2 id="ledger-filter-title">Ledger history</h2><p>View one term or every recorded term from your first semester through the current semester.</p></div>
        <div className="ledger-filters">
          <label>School year<select value={schoolYear} onChange={(event) => setSchoolYear(event.target.value)}><option value="all">All school years</option>{schoolYears.map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
          <label>Semester<select value={semester} onChange={(event) => setSemester(event.target.value)}><option value="all">All semesters</option>{semesters.map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
        </div>
      </section>
      <div className="ledger-history-summary"><span>{visibleTerms.length === accountLedgerTerms.length ? "Showing all recorded terms" : `Showing ${visibleTerms.length} filtered ${visibleTerms.length === 1 ? "term" : "terms"}`}</span><strong>Latest balance: ₱{latestBalance}</strong></div>
      <div className="ledger-term-list">
        {visibleTerms.map((term) => (
          <section className="ledger-term" key={`${term.schoolYear}-${term.semester}`}>
            <header className="ledger-term-header"><div><p>School year {term.schoolYear}</p><h2>{term.semester}</h2></div><span className={term.balance === "0.00" ? "ledger-balance cleared" : "ledger-balance"}>{term.balance === "0.00" ? "Cleared" : `Balance ₱${term.balance}`}</span></header>
            <DataTable headers={["Date", "Particulars", "Collected by", "Debit", "Credit", "Balance"]} rows={term.entries} label={`${term.schoolYear} ${term.semester} ledger`} />
          </section>
        ))}
      </div>
      {visibleTerms.length === 0 && <p className="empty-state">No ledger entries match this filter.</p>}
    </>
  );
}

export function EnrollmentPage({ pageId }) {
  const { subjects: activeSubjects, gradingRecords: activeGrades, enrolledTerm: activeTerm, periodicDues: activeDues } = usePortalData();
  if (pageId === "enrollment") return <Overview page={pages[pageId]} ids={["subjects-enrolled", "fees-paid-during-enrollment", "submit-admission-requirement"]} />;
  if (pageId === "student-account") return <Overview page={pages[pageId]} ids={["ledger", "periodic-dues"]} />;
  if (pageId === "subjects-enrolled") {
    const rows = activeSubjects.map(([code, title, lecLabUnits, totalUnits]) => [code, title, lecLabUnits, totalUnits, activeGrades.find((record) => record.code === code)?.instructor ?? "To be announced"]);
    const totalUnits = activeSubjects.reduce((sum, [, , , units]) => sum + Number(units), 0).toFixed(1);
    return (
      <>
        <PageIntro page={pages[pageId]}><button className="button button-primary print-action" type="button" onClick={() => window.print()}><Icon name="file" /> Print or save as PDF</button></PageIntro>
        <Panel className="subjects-enrolled-paper" title={`Enrolled ${activeTerm.label}`} subtitle={`Enrollment date: ${activeTerm.officialDate}`}>
          <div className="term-summary">
            <span>Maximum units this semester <strong>{activeTerm.maximumUnits}</strong></span>
            <span>Total units load taken <strong>{totalUnits}</strong></span>
          </div>
          <DataTable headers={["Subject code", "Subject title", "LEC/LAB units", "Total units", "Faculty assigned"]} rows={rows} label="Subjects enrolled" />
        </Panel>
      </>
    );
  }
  if (pageId === "fees-paid-during-enrollment") return <FeePaymentDocument />;
  if (pageId === "submit-admission-requirement") return <AdmissionPage />;
  if (pageId === "ledger") return <LedgerPage />;
  const duesRows = activeDues.map(([period, required, cumulative]) => [period, required, cumulative]);
  return (
    <>
      <PageIntro page={pages[pageId]} />
      <div className="account-term-summary">
        <span>Term <strong>First Semester, 2026–2027</strong></span>
        <span>Enrollment status <Badge>Enrolled</Badge></span>
      </div>
      <Panel title="Payment schedule" subtitle="Original installment amounts in PHP; payments and grants are reflected in the current ledger balance.">
        <DataTable headers={["Payment period", "Required amount", "Cumulative balance"]} rows={duesRows} label="Periodic dues schedule" />
      </Panel>
    </>
  );
}
