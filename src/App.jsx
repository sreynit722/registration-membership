import React, { useRef, useState } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";

const totalSteps = 6;

function BrandHeader({ appMode }) {
  return (
    <header className="site-header">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          FP
        </div>
        <div>
          <p className="brand-name">
            {appMode ? "FairPrice App" : "FairPrice Membership"}
          </p>
          <p className="brand-caption">
            {appMode
              ? "Rewards, member prices &amp; deals"
              : "A simpler way to shop for less"}
          </p>
        </div>
      </div>
      <div className="member-badge">
        <span className="badge-dot" aria-hidden="true" />
        Free membership
      </div>
    </header>
  );
}

function QrCode({ value, size, label, className = "", downloadId }) {
  return (
    <div className={`qr ${className}`} role="img" aria-label={label}>
      {downloadId ? (
        <QRCodeCanvas
          id={downloadId}
          value={value || " "}
          size={size}
          bgColor="#ffffff"
          fgColor="#122039"
          level="M"
        />
      ) : (
        <QRCodeSVG
          value={value || " "}
          size={size}
          bgColor="#ffffff"
          fgColor="#122039"
          level="M"
        />
      )}
    </div>
  );
}

function Progress({ step }) {
  return (
    <>
      <p className="step-count" aria-live="polite">
        STEP {step + 1} OF {totalSteps}
      </p>
      <div className="progress" aria-hidden="true">
        {Array.from({ length: totalSteps }, (_, index) => (
          <span className={index <= step ? "done" : ""} key={index} />
        ))}
      </div>
    </>
  );
}

function InviteStep({ joinUrl, onContinue }) {
  return (
    <section className="step-panel invite" aria-label="Membership invitation">
      <div className="poster">
        <div className="poster-top">
          <span className="poster-tag">
            <span className="brand-mark poster-mark" aria-hidden="true">
              FP
            </span>{" "}
            FairPrice Quick Membership
          </span>
          <h2>Join FairPrice Membership</h2>
          <p>Unlock Member Prices in less than a minute.</p>
        </div>
        <div className="prices">
          <div className="price">
            <small>Normal Price</small>
            <strong>$5.00</strong>
          </div>
          <div className="price member">
            <small>Member Price</small>
            <strong>$4.20</strong>
          </div>
        </div>
        <div className="qr-panel">
          <QrCode
            value={joinUrl}
            size={92}
            label="QR code to open membership sign-up"
          />
          <div className="qr-copy">
            <strong>Scan to Join</strong>
            <span>
              Phone number only.
              <br />
              Tap to start your sign-up.
            </span>
          </div>
        </div>
        <div className="poster-foot">
          No app download needed to become a member
        </div>
      </div>
      <button className="primary" type="button" onClick={onContinue}>
        Join now <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}

function PhoneStep({
  countryCode,
  phone,
  error,
  onCountryChange,
  onPhoneChange,
  onContinue,
  onBack,
}) {
  return (
    <section className="step-panel" aria-label="Enter your phone number">
      <div className="panel-content">
        <p className="eyebrow">JOIN FAIRPRICE MEMBERSHIP</p>
        <h2>Become a Member</h2>
        <p className="copy">
          Just your phone number. No email or password needed.
        </p>
        <label className="form-label" htmlFor="phoneNumber">
          Phone number
        </label>
        <div className="phone-field">
          <select
            aria-label="Country code"
            value={countryCode}
            onChange={onCountryChange}
          >
            <option value="+855">+855</option>
            <option value="+65">+65</option>
            <option value="+66">+66</option>
            <option value="+84">+84</option>
          </select>
          <input
            id="phoneNumber"
            inputMode="tel"
            autoComplete="tel-national"
            value={phone}
            onChange={onPhoneChange}
            aria-describedby="phoneError"
          />
        </div>
        <p className="error" id="phoneError" aria-live="polite">
          {error}
        </p>
        <div className="helper">
          <span className="helper-check" aria-hidden="true">
            ✓
          </span>{" "}
          We use your number to verify your membership.
        </div>
        <div className="spacer" />
        <button className="primary" type="button" onClick={onContinue}>
          Continue
        </button>
        <button className="secondary" type="button" onClick={onBack}>
          Back
        </button>
      </div>
    </section>
  );
}

function VerifyPhoneStep({
  phone,
  digits,
  error,
  inputRefs,
  onDigitChange,
  onVerify,
  onResend,
  onChangePhone,
  resendLabel,
}) {
  return (
    <section className="step-panel" aria-label="Verify your phone">
      <div className="panel-content">
        <p className="eyebrow">JOIN FAIRPRICE MEMBERSHIP</p>
        <h2>Verify Your Phone</h2>
        <p className="copy">
          We sent a 6-digit code to <strong>{phone}</strong>.
        </p>
        <label className="form-label" htmlFor="otp-0">
          Enter 6-digit code
        </label>
        <div className="otp-row" aria-label="One-time verification code">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              id={`otp-${index}`}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              aria-label={`Digit ${index + 1}`}
              onChange={(event) => onDigitChange(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !digit && index > 0)
                  inputRefs.current[index - 1]?.focus();
              }}
            />
          ))}
        </div>
        <p className="fine-print">Demo code: any 6 digits</p>
        <div className="otp-actions">
          <button className="link-button" type="button" onClick={onResend}>
            {resendLabel}
          </button>
          <button className="link-button" type="button" onClick={onChangePhone}>
            Change phone number
          </button>
        </div>
        <p className="error" aria-live="polite">
          {error}
        </p>
        <div className="spacer" />
        <button className="primary" type="button" onClick={onVerify}>
          Verify
        </button>
      </div>
    </section>
  );
}

function ProfileStep({ name, onNameChange, onCreate, onBack }) {
  return (
    <section className="step-panel" aria-label="Add your name">
      <div className="panel-content">
        <p className="eyebrow">JOIN FAIRPRICE MEMBERSHIP</p>
        <h2>Almost Done</h2>
        <p className="copy">
          Your name is optional. You can complete your profile later.
        </p>
        <label className="form-label" htmlFor="memberName">
          Name · Optional
        </label>
        <input
          className="text-field"
          id="memberName"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={onNameChange}
        />
        <div className="spacer" />
        <button className="primary" type="button" onClick={onCreate}>
          Create Membership
        </button>
        <button className="secondary" type="button" onClick={onCreate}>
          Skip for Now
        </button>
        <button className="secondary" type="button" onClick={onBack}>
          Back
        </button>
      </div>
    </section>
  );
}

function MemberCardStep({ name, phone, onContinue, onSaveQr }) {
  return (
    <section className="step-panel" aria-label="Membership created">
      <div className="panel-content">
        <div className="success-mark" aria-hidden="true">
          ✓
        </div>
        <h2 className="success-title">You’re now a FairPrice Member!</h2>
        <div className="member-ticket">
          <div className="ticket-head">
            <span>Member</span>
            <span>Member ID &nbsp; FP-0234</span>
          </div>
          <div className="ticket-name">{name || "Member"}</div>
          <QrCode
            className="ticket-qr"
            value={phone}
            size={132}
            label="Membership QR code generated from your phone number"
            downloadId="member-qr-canvas"
          />
          <div className="ticket-foot">
            Contains your phone number. Show this QR at checkout.
          </div>
        </div>
        <div className="member-prices">
          <div>
            <span>Normal price</span>
            <strong>$5.00</strong>
          </div>
          <div className="member-price">
            <span>Member price</span>
            <strong>$4.20</strong>
          </div>
        </div>
        <div className="spacer" />
        <button className="primary" type="button" onClick={onContinue}>
          Continue
        </button>
        <button className="secondary" type="button" onClick={onSaveQr}>
          Save QR code image
        </button>
      </div>
    </section>
  );
}

function RewardStep({ onBack, onOpenApp }) {
  return (
    <section className="step-panel" aria-label="Extra app reward">
      <div className="panel-content">
        <div className="reward-hero">
          <span className="reward-tag">
            ✓ You’re already a member · FP-0234
          </span>
          <h2>Unlock an Extra $2 Reward</h2>
          <p>
            Download the FairPrice app and sign in with your membership account
            to unlock your $2 App Welcome Reward.
          </p>
          <div className="reward-amount">$2</div>
        </div>
        <div className="reward-member">
          <strong>FairPrice App Welcome Reward</strong>
          <span>Member deals</span>
        </div>
        <div className="reward-grid">
          <div className="reward-tile">
            <b>✳</b>Personalized promotions
          </div>
          <div className="reward-tile">
            <b>♡</b>Reward wallet
          </div>
          <div className="reward-tile">
            <b>▤</b>Digital receipts
          </div>
          <div className="reward-tile">
            <b>⌕</b>Purchase history
          </div>
        </div>
        <p className="reward-note">
          Same phone number · no second registration
        </p>
        <div className="spacer" />
        <button className="primary" type="button" onClick={onOpenApp}>
          Get the FairPrice app · Unlock $2
        </button>
        <button className="secondary" type="button" onClick={onBack}>
          Back
        </button>
      </div>
    </section>
  );
}

function AppStoreStep({ onContinue, onBack }) {
  return (
    <section
      className="step-panel app-store-step"
      aria-label="FairPrice app introduction"
    >
      <div className="store-topbar">
        <button
          className="store-back"
          type="button"
          onClick={onBack}
          aria-label="Back to membership"
        >
          ‹
        </button>{" "}
        App Store
      </div>
      <div className="panel-content app-store-content">
        <div className="store-app-row">
          <div className="store-icon">FP</div>
          <div className="store-app-info">
            <strong>FairPrice Rewards</strong>
            <span>Member prices, rewards &amp; deals</span>
          </div>
          <button className="store-install" type="button" onClick={onContinue}>
            Install
          </button>
        </div>
        <div className="store-meta">
          <span>
            <strong>4.8 ★</strong>
            <small>12K ratings</small>
          </span>
          <span>
            <strong>Free</strong>
            <small>In-app rewards</small>
          </span>
          <span>
            <strong>38 MB</strong>
            <small>Size</small>
          </span>
        </div>
        <div className="store-preview-title">Rewards picked for you</div>
        <div className="store-preview-grid">
          <div className="store-preview reward-preview">
            <strong>Your $2 reward</strong>
            <span>Welcome to the app</span>
          </div>
          <div className="store-preview deals-preview">
            <strong>Midweek Deals</strong>
            <span>Fresh savings, every week</span>
          </div>
          <div className="store-preview member-preview">
            <strong>Member prices</strong>
            <span>More value every day</span>
          </div>
        </div>
        <div className="spacer" />
        <button className="primary" type="button" onClick={onContinue}>
          Open FairPrice App
        </button>
      </div>
    </section>
  );
}

function AppWelcomeStep({
  countryCode,
  phone,
  error,
  onCountryChange,
  onPhoneChange,
  onContinue,
}) {
  return (
    <section
      className="step-panel app-step-panel"
      aria-label="Sign in to FairPrice App"
    >
      <div className="panel-content">
        <p className="eyebrow">FAIRPRICE APP</p>
        <h2>Welcome Back</h2>
        <p className="copy">
          Sign in with the phone number linked to your membership.
        </p>
        <label className="form-label" htmlFor="phoneNumber">
          Phone Number
        </label>
        <div className="phone-field">
          <select
            aria-label="Country code"
            value={countryCode}
            onChange={onCountryChange}
          >
            <option value="+855">+855</option>
            <option value="+65">+65</option>
            <option value="+66">+66</option>
            <option value="+84">+84</option>
          </select>
          <input
            id="phoneNumber"
            inputMode="tel"
            autoComplete="tel-national"
            value={phone}
            onChange={onPhoneChange}
            aria-describedby="phoneError"
          />
        </div>
        <p className="error" id="phoneError" aria-live="polite">
          {error}
        </p>
        <div className="helper">
          <span className="helper-check" aria-hidden="true">
            ✓
          </span>{" "}
          No need to register again. We’ll find your membership.
        </div>
        <div className="spacer" />
        <button className="primary" type="button" onClick={onContinue}>
          Continue
        </button>
      </div>
    </section>
  );
}

function AppVerifyStep({
  phone,
  digits,
  error,
  inputRefs,
  resendLabel,
  onDigitChange,
  onVerify,
  onResend,
  onChangePhone,
}) {
  return (
    <section
      className="step-panel app-step-panel"
      aria-label="Verify your membership"
    >
      <div className="panel-content">
        <button
          className="step-back"
          type="button"
          onClick={onChangePhone}
          aria-label="Back to phone number"
        >
          ‹
        </button>
        <p className="eyebrow">FAIRPRICE REWARDS APP</p>
        <h2>Verify Your Membership</h2>
        <p className="copy">
          We sent a 6-digit code to <strong>{phone}</strong>.
        </p>
        <label className="form-label" htmlFor="otp-0">
          Enter code
        </label>
        <div className="otp-row" aria-label="One-time verification code">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              id={`otp-${index}`}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              aria-label={`Digit ${index + 1}`}
              onChange={(event) => onDigitChange(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !digit && index > 0)
                  inputRefs.current[index - 1]?.focus();
              }}
            />
          ))}
        </div>
        <p className="fine-print">Demo code: any 6 digits</p>
        <div className="otp-actions">
          <button className="link-button" type="button" onClick={onResend}>
            {resendLabel}
          </button>
          <button className="link-button" type="button" onClick={onChangePhone}>
            Change Phone Number
          </button>
        </div>
        <p className="error" aria-live="polite">
          {error}
        </p>
        <div className="spacer" />
        <button className="primary" type="button" onClick={onVerify}>
          Verify
        </button>
      </div>
    </section>
  );
}

function MembershipFoundStep({ name, memberId, onContinue }) {
  return (
    <section
      className="step-panel app-step-panel"
      aria-label="Membership found"
    >
      <div className="panel-content found-content">
        <div className="success-mark" aria-hidden="true">
          ✓
        </div>
        <h2 className="success-title">Membership Found</h2>
        <div className="linked-member">
          <span className="member-avatar">
            {name.slice(0, 1).toUpperCase()}
          </span>
          <span className="linked-name">
            <strong>{name}</strong>
            <small>FP-{memberId}</small>
          </span>
          <span className="linked-badge">Linked</span>
        </div>
        <p className="reward-note">
          Your Member Prices now follow you into the app.
        </p>
        <div className="spacer" />
        <button className="primary" type="button" onClick={onContinue}>
          Continue
        </button>
      </div>
    </section>
  );
}

function RewardUnlockedStep({ onContinue }) {
  return (
    <section
      className="step-panel reward-unlocked"
      aria-label="Welcome reward unlocked"
    >
      <div className="unlocked-content">
        <span className="unlocked-pill">
          <span aria-hidden="true">✓</span> $2 APP REWARD
        </span>
        <h2>You unlocked your $2 App Welcome Reward!</h2>
        <div className="unlocked-ticket">
          <div className="unlocked-amount">$2</div>
          <div>
            <strong>App Welcome Reward</strong>
            <span>
              One-time reward for activating your membership in the FairPrice
              App.
            </span>
          </div>
          <span className="available-pill">Available</span>
        </div>
        <div className="spacer" />
        <button
          className="reward-view-button"
          type="button"
          onClick={onContinue}
        >
          View My Rewards
        </button>
      </div>
    </section>
  );
}

function DashboardNavigation({ activeTab, onSelect }) {
  const items = [
    ["home", "⌂", "Home"],
    ["rewards", "♧", "Rewards"],
    ["member", "▦", "Member QR"],
    ["offers", "◇", "Offers"],
    ["profile", "○", "Profile"],
  ];

  return (
    <nav className="app-bottom-nav" aria-label="FairPrice App navigation">
      {items.map(([id, icon, label]) => (
        <button
          className={activeTab === id ? "active" : ""}
          type="button"
          key={id}
          onClick={() => onSelect(id)}
        >
          <span aria-hidden="true">{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  );
}

function AppDashboardStep({ name, phone, memberId, activeTab, onTabChange }) {
  return (
    <section
      className="step-panel app-dashboard"
      aria-label="FairPrice App home"
    >
      <div className="dashboard-top">
        <div className="dashboard-appbar">
          <span className="dashboard-app-icon">FP</span>
          <span>FairPrice Rewards</span>
          <span className="notification-dot" aria-label="Notifications" />
        </div>
        <p className="dashboard-member-label">
          FAIRPRICE MEMBER · FP-{memberId}
        </p>
        <h2>
          Hi, {name} <span aria-hidden="true">👋</span>
        </h2>
        <div className="dashboard-stats">
          <div>
            <strong>1,250</strong>
            <span>points</span>
          </div>
          <div>
            <strong>3</strong>
            <span>vouchers</span>
          </div>
          <div>
            <strong>$6.50</strong>
            <span>saved this month</span>
          </div>
        </div>
      </div>
      <div className="dashboard-content">
        {activeTab === "member" ? (
          <div className="dashboard-member-card">
            <div>
              <strong>Member QR</strong>
              <span>Tap to show at checkout</span>
            </div>
            <QrCode
              value={phone}
              size={118}
              label="Member QR code for checkout"
            />
          </div>
        ) : activeTab === "profile" ? (
          <div className="dashboard-profile">
            <span className="member-avatar">
              {name.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{name}</strong>
              <span>{phone}</span>
              <small>FairPrice Member · FP-{memberId}</small>
            </div>
          </div>
        ) : (
          <>
            <div className="dashboard-section-title">
              <strong>
                {activeTab === "offers"
                  ? "Offers for you"
                  : activeTab === "rewards"
                    ? "Your Rewards"
                    : "Member QR"}
              </strong>
              <button
                type="button"
                onClick={() =>
                  onTabChange(activeTab === "offers" ? "home" : "rewards")
                }
              >
                See all
              </button>
            </div>
            {activeTab !== "offers" && (
              <div className="dashboard-member-card">
                <div>
                  <strong>Member QR</strong>
                  <span>Tap to show at checkout</span>
                </div>
                <QrCode
                  value={phone}
                  size={68}
                  label="Member QR code for checkout"
                />
              </div>
            )}
            <button
              className="dashboard-reward-card"
              type="button"
              onClick={() => onTabChange("rewards")}
            >
              <span className="reward-icon">$2</span>
              <span>
                <strong>$2 App Welcome Reward</strong>
                <small>Use on your next visit</small>
              </span>
              <span className="available-pill">Available</span>
            </button>
            <div className="dashboard-section-title">
              <strong>Midweek Deals</strong>
              <button type="button" onClick={() => onTabChange("offers")}>
                See all
              </button>
            </div>
            <button
              className="midweek-banner"
              type="button"
              onClick={() => onTabChange("offers")}
            >
              <span>Tuesday - Thursday specials</span>
              <strong>Save on everyday favourites</strong>
              <span className="banner-arrow">›</span>
            </button>
            <div className="dashboard-products">
              <article>
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=280&q=75"
                  alt="Freshly brewed coffee"
                  loading="lazy"
                />
                <strong>Coffee</strong>
                <span>
                  <b>$3.99</b> &nbsp; $5.00
                </span>
              </article>
              <article>
                <img
                  src="https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=280&q=75"
                  alt="Fresh milk"
                  loading="lazy"
                />
                <strong>Fresh milk</strong>
                <span>
                  <b>$2.70</b> &nbsp; $3.50
                </span>
              </article>
              <article>
                <img
                  src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=280&q=75"
                  alt="Fresh fruit"
                  loading="lazy"
                />
                <strong>Fruit</strong>
                <span>
                  <b>$4.20</b> &nbsp; $5.10
                </span>
              </article>
            </div>
          </>
        )}
      </div>
      <DashboardNavigation activeTab={activeTab} onSelect={onTabChange} />
    </section>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [appMode, setAppMode] = useState(false);
  const [countryCode, setCountryCode] = useState("+855");
  const [phoneInput, setPhoneInput] = useState("010 123 456");
  const [memberPhone, setMemberPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [digits, setDigits] = useState(["1", "2", "3", "4", "5", "6"]);
  const [otpError, setOtpError] = useState("");
  const [memberName, setMemberName] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [resendLabel, setResendLabel] = useState("Resend code");
  const inputRefs = useRef([]);
  const memberId = "10234";
  const joinUrl = `${window.location.origin}${window.location.pathname}`;

  function navigateTo(nextStep) {
    setStep(nextStep);
    if (window.matchMedia("(max-width: 520px)").matches) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function continueWithPhone() {
    if (phoneInput.replace(/\D/g, "").length < 7) {
      setPhoneError("Enter a valid phone number to continue.");
      return;
    }
    const fullPhone = `${countryCode} ${phoneInput.trim()}`;
    setPhoneError("");
    setMemberPhone(fullPhone);
    navigateTo(2);
  }

  function updateDigit(index, value) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? digit : item)),
    );
    if (digit && index < inputRefs.current.length - 1)
      inputRefs.current[index + 1]?.focus();
  }

  function verifyCode() {
    if (digits.some((digit) => !/^\d$/.test(digit))) {
      setOtpError("Enter all 6 digits to continue.");
      inputRefs.current[0]?.focus();
      return;
    }
    setOtpError("");
    navigateTo(3);
  }

  function completeMembership() {
    navigateTo(4);
  }

  function saveMemberQr() {
    const canvas = document.getElementById("member-qr-canvas");
    if (!(canvas instanceof HTMLCanvasElement)) return;

    const link = document.createElement("a");
    link.download = "fairprice-member-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function openAppFlow() {
    setAppMode(true);
    setStep(0);
    setPhoneError("");
    setOtpError("");
    setActiveTab("home");
  }

  function returnToMembership() {
    setAppMode(false);
    setStep(5);
  }

  let currentStep;
  if (appMode) {
    switch (step) {
      case 0:
        currentStep = (
          <AppStoreStep
            onContinue={() => navigateTo(1)}
            onBack={returnToMembership}
          />
        );
        break;
      case 1:
        currentStep = (
          <AppWelcomeStep
            countryCode={countryCode}
            phone={phoneInput}
            error={phoneError}
            onCountryChange={(event) => setCountryCode(event.target.value)}
            onPhoneChange={(event) => setPhoneInput(event.target.value)}
            onContinue={continueWithPhone}
          />
        );
        break;
      case 2:
        currentStep = (
          <AppVerifyStep
            phone={memberPhone}
            digits={digits}
            error={otpError}
            inputRefs={inputRefs}
            onDigitChange={updateDigit}
            onVerify={verifyCode}
            onResend={() => setResendLabel("Code sent again")}
            onChangePhone={() => navigateTo(1)}
            resendLabel={resendLabel}
          />
        );
        break;
      case 3:
        currentStep = (
          <MembershipFoundStep
            name={memberName.trim() || "Dara"}
            memberId={memberId}
            onContinue={() => navigateTo(4)}
          />
        );
        break;
      case 4:
        currentStep = <RewardUnlockedStep onContinue={() => navigateTo(5)} />;
        break;
      default:
        currentStep = (
          <AppDashboardStep
            name={memberName.trim() || "Dara"}
            phone={memberPhone}
            memberId={memberId}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        );
    }
  } else {
    switch (step) {
      case 0:
        currentStep = (
          <InviteStep joinUrl={joinUrl} onContinue={() => navigateTo(1)} />
        );
        break;
      case 1:
        currentStep = (
          <PhoneStep
            countryCode={countryCode}
            phone={phoneInput}
            error={phoneError}
            onCountryChange={(event) => setCountryCode(event.target.value)}
            onPhoneChange={(event) => setPhoneInput(event.target.value)}
            onContinue={continueWithPhone}
            onBack={() => navigateTo(0)}
          />
        );
        break;
      case 2:
        currentStep = (
          <VerifyPhoneStep
            phone={memberPhone}
            digits={digits}
            error={otpError}
            inputRefs={inputRefs}
            onDigitChange={updateDigit}
            onVerify={verifyCode}
            onResend={() => setResendLabel("Code sent again")}
            onChangePhone={() => navigateTo(1)}
            resendLabel={resendLabel}
          />
        );
        break;
      case 3:
        currentStep = (
          <ProfileStep
            name={memberName}
            onNameChange={(event) => setMemberName(event.target.value)}
            onCreate={completeMembership}
            onBack={() => navigateTo(2)}
          />
        );
        break;
      case 4:
        currentStep = (
          <MemberCardStep
            name={memberName}
            phone={memberPhone}
            onContinue={() => navigateTo(5)}
            onSaveQr={saveMemberQr}
          />
        );
        break;
      default:
        currentStep = (
          <RewardStep onBack={() => navigateTo(4)} onOpenApp={openAppFlow} />
        );
    }
  }

  return (
    <>
      {!appMode && <BrandHeader />}
      <main className={appMode ? "app-flow-main" : ""}>
        {!appMode && (
          <>
            <div className="intro">
              <h1>
                {step === 5
                  ? "Join FairPrice App"
                  : "Join FairPrice Membership"}
              </h1>
              <p>Member prices. One simple sign-up.</p>
            </div>
            <Progress step={step} />
          </>
        )}
        {currentStep}
        {!appMode && (
          <footer className="site-footer">
            {step === 5
              ? "Your membership is ready. The app reward can be unlocked when you sign in."
              : "By continuing, you agree to the FairPrice membership terms."}
          </footer>
        )}
      </main>
    </>
  );
}
