import React, { useState } from "react";
import "./profile.css";

// Data types are omitted since this is JS. We'll keep structures identical.

// Get user data from localStorage or use default
const getUserData = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      return {
        id: user.id || "1",
        name: user.name || user.username || "User",
        avatar: user.avatar || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2",
        memberSince: user.memberSince || "Jan 2024",
        totalEntries: user.totalEntries || 89,
        currentStreak: user.currentStreak || 12,
        longestStreak: user.longestStreak || 28,
      };
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  // Default fallback data
  return {
    id: "1",
    name: "User",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2",
    memberSince: "Jan 2024",
    totalEntries: 89,
    currentStreak: 12,
    longestStreak: 28,
  };
};

const generateMockMoodData = () => {
  const weeks = [];
  const today = new Date();
  for (let weekOffset = 3; weekOffset >= 0; weekOffset--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - weekOffset * 7);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const moods = [];
    const moodTypes = ["happy", "sad", "anxious", "calm", "confused"];
    const moodEmojis = { 1: "😢", 2: "😔", 3: "😐", 4: "😊", 5: "😄" };
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + dayOffset);
      if (Math.random() > 0.15) {
        const level = Math.floor(Math.random() * 5) + 1;
        const moodType = moodTypes[Math.floor(Math.random() * moodTypes.length)];
        moods.push({
          id: `${weekOffset}-${dayOffset}`,
          date: date.toISOString().split("T")[0],
          emoji: moodEmojis[level],
          level,
          note: `Feeling ${moodType} today`,
        });
      } else {
        moods.push(null);
      }
    }
    const validMoods = moods.filter((m) => m !== null);
    const averageMood =
      validMoods.length > 0
        ? validMoods.reduce((acc, mood) => acc + (mood?.level || 0), 0) /
          validMoods.length
        : 0;
    weeks.push({
      weekStart: weekStart.toISOString().split("T")[0],
      moods,
      averageMood,
    });
  }
  return weeks.reverse();
};

const generateStreakData = () => {
  const streakData = [];
  for (let i = 0; i < 100; i++) {
    if (Math.random() > 0.2) {
      streakData.push(Math.floor(Math.random() * 5) + 1);
    } else {
      streakData.push(0);
    }
  }
  return streakData;
};

const mockMoodData = generateMockMoodData();
const mockStreakData = generateStreakData();

const ProfileCard = ({ user }) => {
  return (
    <div className="card profile-card slide-fade-in">
      <img src={user.avatar} alt={user.name} className="profile-avatar" />
      <h2 className="profile-name">{user.name}</h2>
      <p className="profile-details">Taking care of myself since {user.memberSince} 🌱</p>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{user.totalEntries}</span>
          <span className="stat-label">Check-ins</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{user.currentStreak}</span>
          <span className="stat-label">Days Strong</span>
        </div>
      </div>
    </div>
  );
};

const MoodGraph = ({ weekData, onWeekClick }) => {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const currentWeek = weekData[currentWeekIndex];
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getMoodPosition = (level) => `${10 + (level - 1) * 20}%`;
  const getMoodColor = (level) => ({
    1: "#FF6B6B",
    2: "#FF8E53",
    3: "#4ECDC4",
    4: "#45B7D1",
    5: "#96CEB4",
  })[level];
  const getMoodDescription = (level) => ({
    1: "Very Sad",
    2: "Sad",
    3: "Neutral",
    4: "Happy",
    5: "Very Happy",
  })[level];

  const formatWeekRange = (weekStart) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  };

  const navigateWeek = (direction) => {
    if (direction === "prev" && currentWeekIndex > 0) setCurrentWeekIndex(currentWeekIndex - 1);
    else if (direction === "next" && currentWeekIndex < weekData.length - 1)
      setCurrentWeekIndex(currentWeekIndex + 1);
  };

  return (
    <div className="mood-graph slide-fade-in">
      <div className="section-title">
        <span>🌙</span>
        Your week at a glance
      </div>
      <div className="week-selector">
        <button className="week-nav-btn" onClick={() => navigateWeek("prev")} disabled={currentWeekIndex === 0}>
          <span>← </span>
          Earlier
        </button>
        <div className="week-display">{formatWeekRange(currentWeek.weekStart)}</div>
        <button className="week-nav-btn" onClick={() => navigateWeek("next")} disabled={currentWeekIndex === weekData.length - 1}>
          Recent<span> →</span>
        </button>
      </div>
      <div className="mood-chart-container">
        {dayLabels.map((day, index) => {
          const mood = currentWeek.moods[index];
          return (
            <div key={day} className="day-chart-column">
              <div className="day-label">{day}</div>
              <div className="mood-chart-track">
                {mood ? (
                  <div
                    className="mood-point-positioned bounce-in"
                    style={{ bottom: getMoodPosition(mood.level), backgroundColor: getMoodColor(mood.level) }}
                    title={`${mood.emoji} ${mood.note} - feeling ${getMoodDescription(mood.level).toLowerCase()}`}
                  >
                    {mood.emoji}
                  </div>
                ) : (
                  <div className="mood-point-empty" title="Add how you felt this day">
                    💭
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mood-scale">
        <div className="scale-label scale-top">Feeling great 😊</div>
        <div className="scale-markers">
          <div className="scale-marker">😄 Amazing day</div>
          <div className="scale-marker">😊 Pretty good</div>
          <div className="scale-marker">😐 Just okay</div>
          <div className="scale-marker">😔 Not so great</div>
          <div className="scale-marker">😢 Tough day</div>
        </div>
        <div className="scale-label scale-bottom">Having a hard time 💙</div>
      </div>
      <div className="trend-line"></div>
      <button className="edit-btn" onClick={() => onWeekClick(currentWeek)} style={{ width: "100%", marginTop: "1rem" }}>
        <span>📝</span>
        Tell me more about this week
      </button>
    </div>
  );
};

const MoodStreaks = ({ currentStreak, longestStreak, streakData }) => {
  const getStreakLevel = (value) => {
    if (value === 0) return "empty";
    if (value === 1) return "level-1";
    if (value === 2) return "level-2";
    if (value === 3) return "level-3";
    if (value === 4) return "level-4";
    return "level-5";
  };
  return (
    <div className="streaks-section slide-fade-in">
      <div className="section-title">
        <span>🌟</span>
        Your beautiful journey
      </div>
      <div className="streak-container">
        <div className="streak-item">
          <div className="streak-info">
            <h4>You're on a roll!</h4>
            <p>Days you've been here for yourself</p>
          </div>
          <div className="streak-value pulse">
            {currentStreak}
            <span style={{ fontSize: "1.5rem", marginLeft: "8px" }}>🔥</span>
          </div>
        </div>
        <div className="streak-item">
          <div className="streak-info">
            <h4>Your personal record</h4>
            <p>Longest self-care streak</p>
          </div>
          <div className="streak-value">
            {longestStreak}
            <span style={{ fontSize: "1.5rem", marginLeft: "8px" }}>👑</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "1.5rem" }}>
        <h4
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "var(--sage-green)",
          }}
        >
          Your wellness garden 🌱
        </h4>
        <div className="streak-grid">
          {streakData.map((value, index) => (
            <div key={index} className={`streak-day ${getStreakLevel(value)}`} title={`Day ${index + 1}: ${value > 0 ? `Feeling level ${value}` : "Rest day"}`} />
          ))}
        </div>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--soft-brown)",
            marginTop: "0.75rem",
            fontStyle: "italic",
            fontFamily: "'Caveat', cursive",
          }}
        >
          Each little square is a day you chose to care for yourself 💙
        </p>
      </div>
    </div>
  );
};

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    weeklyReports: true,
    darkMode: false,
    privateProfile: false,
  });
  const toggleSetting = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  return (
    <div className="card slide-fade-in">
      <div className="section-title">
        <span>🏠</span>
        Make yourself comfortable
      </div>
      <div className="settings-section">
        <div className="setting-item">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem" }}>🔔</span>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: "1.1rem" }}>Gentle daily reminders</span>
          </div>
          <div className={`toggle-switch ${settings.notifications ? "active" : ""}`} onClick={() => toggleSetting("notifications")} />
        </div>
        <div className="setting-item">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem" }}>📊</span>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: "1.1rem" }}>Weekly reflection notes</span>
          </div>
          <div className={`toggle-switch ${settings.weeklyReports ? "active" : ""}`} onClick={() => toggleSetting("weeklyReports")} />
        </div>
        <div className="setting-item">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem" }}>🔒</span>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: "1.1rem" }}>Keep my space private</span>
          </div>
          <div className={`toggle-switch ${settings.privateProfile ? "active" : ""}`} onClick={() => toggleSetting("privateProfile")} />
        </div>
      </div>
      <button className="edit-btn" style={{ width: "100%", marginTop: "1rem" }}>
        <span style={{ marginRight: "0.75rem", fontSize: "1.3rem" }}>✏️</span>
        Update my info
      </button>
    </div>
  );
};

const DetailedMoodView = ({ weekData, onClose }) => {
  const dayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const getMoodDescription = (level) => ({
    1: "Very Sad",
    2: "Sad",
    3: "Neutral",
    4: "Happy",
    5: "Very Happy",
  })[level];
  const moodCounts = weekData.moods.reduce((acc, mood) => {
    if (mood) {
      const desc = getMoodDescription(mood.level);
      acc[desc] = (acc[desc] || 0) + 1;
    }
    return acc;
  }, {});
  return (
    <div className="detailed-view">
      <div className="detailed-content">
        <button className="close-btn" onClick={onClose} title="Close">
          ×
        </button>
        <div className="section-title">
          <span>📖</span>
          Your week of {formatDate(weekData.weekStart)}
        </div>
        <div style={{ marginBottom: "2rem" }}>
          <h4
            style={{
              fontSize: "1.4rem",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "var(--sage-green)",
              fontFamily: "'Caveat', cursive",
            }}
          >
            How each day felt
          </h4>
          {weekData.moods.map((mood, index) => {
            const date = new Date(weekData.weekStart);
            date.setDate(date.getDate() + index);
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem",
                  marginBottom: "0.5rem",
                  background: mood ? "var(--warm-cream)" : "var(--cream)",
                  borderRadius: "8px",
                  border: mood ? "none" : "2px dashed var(--dusty-rose)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>{mood ? mood.emoji : "💭"}</span>
                  <div>
                    <div style={{ fontWeight: "600", fontFamily: "'Caveat', cursive", fontSize: "1.2rem" }}>{dayLabels[index]}</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--soft-brown)", fontStyle: "italic" }}>
                      {formatDate(date.toISOString().split("T")[0])}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {mood ? (
                    <>
                      <div style={{ fontWeight: "600", color: "var(--sage-green)", fontFamily: "'Caveat', cursive", fontSize: "1.1rem" }}>
                        {getMoodDescription(mood.level)}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "var(--soft-brown)", fontStyle: "italic" }}>{mood.level}/5 ⭐</div>
                    </>
                  ) : (
                    <div style={{ fontSize: "1rem", color: "var(--warm-gray)", fontStyle: "italic", fontFamily: "'Caveat', cursive" }}>Rest day</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <h4
            style={{
              fontSize: "1.4rem",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "var(--sage-green)",
              fontFamily: "'Caveat', cursive",
            }}
          >
            This week's story
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "1rem" }}>
            <div className="stat-item" style={{ background: "var(--warm-cream)", borderRadius: "15px", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.2rem" }}>💖</span>
                <span style={{ fontSize: "1rem", fontWeight: "600", fontFamily: "'Caveat', cursive" }}>Average feeling</span>
              </div>
              <span style={{ fontSize: "2rem", fontWeight: "700", color: "var(--sage-green)", fontFamily: "'Caveat', cursive" }}>
                {weekData.averageMood.toFixed(1)}
              </span>
            </div>
            <div className="stat-item" style={{ background: "var(--warm-cream)", borderRadius: "15px", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.2rem" }}>📅</span>
                <span style={{ fontSize: "1rem", fontWeight: "600", fontFamily: "'Caveat', cursive" }}>Days tracked</span>
              </div>
              <span style={{ fontSize: "2rem", fontWeight: "700", color: "var(--sage-green)", fontFamily: "'Caveat', cursive" }}>
                {weekData.moods.filter((m) => m !== null).length}/7
              </span>
            </div>
          </div>
          {Object.keys(moodCounts).length > 0 && (
            <div style={{ marginTop: "1.5rem" }}>
              <h5
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  marginBottom: "0.75rem",
                  color: "var(--sage-green)",
                  fontFamily: "'Caveat', cursive",
                }}
              >
                How you felt this week
              </h5>
              {Object.entries(moodCounts).map(([mood, count]) => (
                <div
                  key={mood}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid var(--dusty-rose)",
                    fontFamily: "'Caveat', cursive",
                    fontSize: "1.1rem",
                  }}
                >
                  <span>{mood}</span>
                  <span style={{ fontWeight: "600", color: "var(--sage-green)" }}>
                    {count} day{count > 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileDashboard = () => {
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [userData, setUserData] = useState(getUserData());
  
  const handleWeekClick = (week) => setSelectedWeek(week);
  const handleCloseDetailedView = () => setSelectedWeek(null);
  
  return (
    <div className="dashboard">
      <header className="header">
        <h1 className="logo">MoodSpace</h1>
        <p className="tagline">Your personal wellness sanctuary</p>
      </header>
      <div className="main-content">
        <aside className="sidebar">
          <ProfileCard user={userData} />
          <SettingsPanel />
        </aside>
        <main className="content-area">
          <MoodGraph weekData={mockMoodData} onWeekClick={handleWeekClick} />
          <MoodStreaks currentStreak={userData.currentStreak} longestStreak={userData.longestStreak} streakData={mockStreakData} />
          <div className="wellness-tip">
            <p>
              "Taking time to check in with yourself is one of the most loving things you can do. Every moment of self-awareness is a step toward inner peace." 🌸
            </p>
          </div>
        </main>
      </div>
      {selectedWeek && <DetailedMoodView weekData={selectedWeek} onClose={handleCloseDetailedView} />}
    </div>
  );
};

export default function Profile() {
  return <ProfileDashboard />;
}


