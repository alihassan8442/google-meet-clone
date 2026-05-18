"use client";

import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";

const fontLink = `https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@400;500&display=swap`;

const GOOGLE_COLORS = {
  blue: "#1a73e8",
  blueHover: "#1765cc",
  red: "#ea4335",
  green: "#34a853",
  yellow: "#fbbc04",
  textPrimary: "#202124",
  textSecondary: "#5f6368",
  border: "#dadce0",
  surface: "#f8f9fa",
  white: "#ffffff",
};

// --- GOOGLE MEET TOP BAR ICONS ---

const IconGrid = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#5f6368">
    <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
  </svg>
);

const IconHelp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
  </svg>
);

const IconFeedback = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#5f6368">
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
  </svg>
);

const IconSettings = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#5f6368">
    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.47-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
  </svg>
);

const IconNewMeetingFlag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" fill="white" />
    <path d="M11.5 12h-5v-1.5h5V12z" fill="#1a73e8" />
  </svg>
);

const IconKeyboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368" style={{ marginRight: 12 }}>
    <path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-3 0h2v2H5v-2zm0-3h2v2H5V8zm3 6h8v2H8v-2zm8-3h2v2h-2v-2zm0-3h2v2h-2V8zm3 3h2v2h-2v-2zm0-3h2v2h-2V8z" />
  </svg>
);

// --- SIDEBAR MENU ICONS ---

const IconSidebarMeetings = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 7l-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const IconSidebarCalls = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#5f6368">
    <path d="M20.01 15.38c-1.23-.11-2.42-.4-3.53-.87-.34-.15-.75-.07-1.01.18l-1.64 1.64c-2.69-1.43-4.9-3.64-6.33-6.33l1.64-1.64c.27-.26.35-.66.19-1.01-.46-1.12-.76-2.32-.87-3.53-.08-.55-.54-.97-1.1-.97H4.02c-.59 0-1.07.49-1.02 1.08.34 4.09 2 7.84 4.66 10.5c2.65 2.66 6.4 4.32 10.5 4.66.58.05 1.08-.43 1.08-1.02v-3.32c0-.56-.42-1.02-.97-1.1z" />
  </svg>
);

function LiveClock() {
  const format = () => {
    const now = new Date();
    return {
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }),
    };
  };

  const [display, setDisplay] = useState(format);

  useEffect(() => {
    const interval = setInterval(() => { setDisplay(format()); }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span style={{ fontSize: 14, color: GOOGLE_COLORS.textSecondary, margin: "0 8px", whiteSpace: "nowrap" }}>
      {display.time} · {display.date}
    </span>
  );
}

function Avatar({ session, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        overflow: "hidden",
        border: "none",
        cursor: "pointer",
        background: GOOGLE_COLORS.blue,
        color: "white",
        fontWeight: 500,
        marginLeft: 8,
      }}
    >
      {session?.user?.image ? (
        <img src={session.user.image} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        session?.user?.name?.[0] || "U"
      )}
    </button>
  );
}

function IconBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}

export default function MeetHome() {
  const { data: session } = useSession();

  const [code, setCode] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const sidebarRef = useRef(null);
  const profileRef = useRef(null);

  const handleJoin = () => {
    if (!code) return;
    alert("Joining: " + code);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fontLink;
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target) && !e.target.closest("[data-menu]")) {
        setSidebarOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Google Sans', Roboto, Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* TOP BAR */}
      <header
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          width: "100%",
        }}
      >
        {/* LEFT BRAND SECTION */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <IconBtn onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg data-menu="true" width="24" height="24" viewBox="0 0 24 24" fill="#5f6368">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </IconBtn>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* OFFICIAL GOOGLE HOSTED BRAND LOGO IMAGE SCHEME */}
            <img 
              src="https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v1/web-96dp/logo_meet_2020q4_color_2x_web_96dp.png" 
              alt="Google Meet Logo"
              style={{ 
                width: 24, 
                height: 24, 
                display: "block",
                objectFit: "contain" 
              }} 
            />
            
            {/* BRAND TEXT */}
            <span style={{ 
              fontSize: 22, 
              color: GOOGLE_COLORS.textSecondary, 
              fontFamily: "'Google Sans', Arial, sans-serif", 
              fontWeight: 400,
              letterSpacing: "-0.5px",
              paddingLeft: 2,
              userSelect: "none"
            }}>
              Google Meet
            </span>
          </div>
        </div>

        {/* RIGHT UTILITY ICONS SECTION */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <LiveClock />
          
          <IconBtn><IconHelp /></IconBtn>
          <IconBtn><IconFeedback /></IconBtn>
          <IconBtn><IconSettings /></IconBtn>
          <IconBtn><IconGrid /></IconBtn>

          {/* PROFILE CONTROL */}
          <div style={{ position: "relative" }} ref={profileRef}>
            <Avatar session={session} onClick={() => setProfileOpen(!profileOpen)} />

            {profileOpen && (
              <div
                style={{
                  position: "absolute",
                  top: 45,
                  right: 0,
                  width: 220,
                  background: "#fff",
                  border: `1px solid ${GOOGLE_COLORS.border}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  zIndex: 110,
                }}
              >
                <div style={{ padding: 14, borderBottom: `1px solid ${GOOGLE_COLORS.border}` }}>
                  <div style={{ fontWeight: 500 }}>{session?.user?.name || "User"}</div>
                  <div style={{ fontSize: 13, color: GOOGLE_COLORS.textSecondary, marginTop: 4 }}>{session?.user?.email}</div>
                </div>
                <button style={menuButtonStyle}>Settings</button>
                <button onClick={handleLogout} style={{ ...menuButtonStyle, color: GOOGLE_COLORS.red }}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SIDEBAR NAVIGATION */}
      <div
        ref={sidebarRef}
        style={{
          position: "fixed",
          top: 64,
          left: sidebarOpen ? 0 : -260,
          width: 250,
          height: "100%",
          background: "#fff",
          borderRight: `1px solid ${GOOGLE_COLORS.border}`,
          transition: "0.25s",
          paddingTop: 12,
          zIndex: 100,
         }}
      >
        <SidebarItem label="Meetings" icon={<IconSidebarMeetings />} />
        <SidebarItem label="Calls" icon={<IconSidebarCalls />} />
      </div>

      {/* HERO MAIN CONTENT */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 40,
          textAlign: "center",
          flex: 1,
          width: "100%",
        }}
      >
        <h1 style={{ fontSize: 44, fontWeight: 400, lineHeight: 1.2, marginBottom: 20, color: GOOGLE_COLORS.textPrimary }}>
          Video calls and meetings
          <br />
          for everyone
        </h1>

        <p style={{ fontSize: 16, color: GOOGLE_COLORS.textSecondary, marginBottom: 32 }}>
          Connect, collaborate and celebrate from anywhere
        </p>

        {/* CONTROLS WRAPPER - RE-CENTERED DIRECTLY UNDER THE HERO TEXT */}
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 24, 
            flexWrap: "wrap", 
            justifyContent: "center"
          }}
        >
          
          {/* NEW MEETING BUTTON */}
          <button
            style={{
              height: 48,
              padding: "0 24px",
              borderRadius: 24,
              border: "none",
              background: GOOGLE_COLORS.blue,
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
              letterSpacing: "0.25px"
            }}
            onClick={() => alert("New Meeting Created")}
          >
            <IconNewMeetingFlag />
            New meeting
          </button>

          {/* INPUT CONTAINER */}
          <div 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              height: 48, 
              border: `1px solid #747775`, 
              borderRadius: 8, 
              paddingLeft: 16,
              paddingRight: 16,
              background: "#ffffff"
            }}
          >
            <IconKeyboard />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter a code or link"
              style={{ 
                width: 210, 
                border: "none", 
                outline: "none", 
                fontSize: 16, 
                fontFamily: "Roboto, sans-serif",
                color: GOOGLE_COLORS.textPrimary
              }}
            />
          </div>

          {/* INDEPENDENT JOIN BUTTON - DYNAMIC TEXT-ONLY TRANSITION */}
          <button
            onClick={handleJoin}
            disabled={!code}
            style={{
              height: 48,
              padding: "0 12px",
              border: "none",
              borderRadius: 24, 
              background: "transparent", /* Kept completely flat and transparent */
              color: code ? GOOGLE_COLORS.blue : "#aaaeb3", /* Text color changes to blue when code is present */
              fontWeight: 500,
              fontSize: 15,
              fontFamily: "'Google Sans', Roboto, sans-serif",
              cursor: code ? "pointer" : "default",
              transition: "color 0.2s",
              userSelect: "none"
            }}
          >
            Join
          </button>

        </div>

        {/* SLIGHTLY LARGER EXPANDED VISUAL DIVIDER */}
        <div
          style={{
            width: 580, /* Updated: Expanded from 450px to stretch wider */
            height: 1,
            background: GOOGLE_COLORS.border,
            opacity: 0.8,
            marginTop: 64,
            marginBottom: 48,
          }}
        />
      </main>
    </div>
  );
}

function SidebarItem({ label, icon }) {
  return (
    <div
      style={{
        padding: "12px 24px",
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 500,
        color: GOOGLE_COLORS.textPrimary,
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontFamily: "'Google Sans', Roboto, sans-serif"
      }}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

const menuButtonStyle = {
  width: "100%",
  border: "none",
  background: "transparent",
  textAlign: "left",
  padding: "12px 16px",
  fontSize: 14,
  cursor: "pointer",
};