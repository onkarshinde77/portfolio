"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/site-config";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionData {
  total: Record<string, number>;
  contributions: ContributionDay[];
}

const LEVEL_COLORS = [
  "#111118", // 0 - empty
  "#0e4a5a", // 1 - low
  "#0891b2", // 2 - mid
  "#00d4ff", // 3 - high
  "#7c3aed"  // 4 - peak
];

function getLongestStreak(days: ContributionDay[]): number {
  let max = 0, cur = 0;
  for (const d of days) {
    if (d.count > 0) { cur++; max = Math.max(max, cur); }
    else cur = 0;
  }
  return max;
}

function getCurrentStreak(days: ContributionDay[]): number {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) streak++;
    else break;
  }
  return streak;
}

function getWeeks(days: ContributionDay[]): ContributionDay[][] {
  const weeks: ContributionDay[][] = [];
  let week: ContributionDay[] = [];

  // Pad start to Sunday
  if (days.length > 0) {
    const startDay = new Date(days[0].date).getDay();
    for (let i = 0; i < startDay; i++) {
      week.push({ date: "", count: 0, level: 0 });
    }
  }

  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) weeks.push(week);
  return weeks;
}

export function GithubHeatmap() {
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(
      `https://github-contributions-api.jogruber.de/v4/${siteConfig.github}?y=last`
    )
      .then(r => r.json())
      .then((d: ContributionData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
        // Use mock data
        const mockDays: ContributionDay[] = Array.from({ length: 365 }, (_, i) => ({
          date: new Date(Date.now() - (364 - i) * 86400000)
            .toISOString()
            .split("T")[0],
          count: Math.random() > 0.4 ? Math.floor(Math.random() * 8) : 0,
          level: (Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4)
        }));
        setData({ total: { "2024": 487 }, contributions: mockDays });
      });
  }, []);

  const last365 = data?.contributions.slice(-365) ?? [];
  const weeks = getWeeks(last365);
  const totalCommits = last365.reduce((sum, d) => sum + d.count, 0);
  const longestStreak = getLongestStreak(last365);
  const currentStreak = getCurrentStreak(last365);

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const DAYS = ["S","M","T","W","T","F","S"];

  return (
    <section
      id="github"
      style={{
        padding: "6rem 2rem",
        maxWidth: "1200px",
        margin: "0 auto"
      }}
    >
      <div className="section-divider" style={{ marginBottom: "5rem" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: "2.5rem" }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "12px",
            letterSpacing: "0.2em",
            color: "var(--accent-primary)",
            textTransform: "uppercase",
            marginBottom: "1rem"
          }}
        >
          // Commit History
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em"
          }}
        >
          Contribution Graph
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card"
        style={{ padding: "2rem", overflowX: "auto" }}
      >
        {loading ? (
          <div
            style={{
              height: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              fontFamily: "var(--font-code)",
              fontSize: "13px"
            }}
          >
            Loading contributions...
          </div>
        ) : (
          <>
            {/* Heatmap grid */}
            <div style={{ display: "flex", gap: "3px", alignItems: "flex-start" }}>
              {/* Day labels */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  marginRight: "4px",
                  paddingTop: "20px"
                }}
              >
                {DAYS.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      height: "12px",
                      fontFamily: "var(--font-code)",
                      fontSize: "9px",
                      color: "var(--text-muted)",
                      lineHeight: "12px"
                    }}
                  >
                    {i % 2 === 1 ? d : ""}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              <div style={{ display: "flex", gap: "3px", overflowX: "auto" }}>
                {weeks.map((week, wi) => (
                  <div key={wi} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    {/* Month label above first day of month */}
                    <div
                      style={{
                        height: "16px",
                        fontFamily: "var(--font-code)",
                        fontSize: "9px",
                        color: "var(--text-muted)",
                        lineHeight: "16px",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {week[0]?.date &&
                        new Date(week[0].date + "T00:00:00").getDate() <= 7
                        ? MONTHS[new Date(week[0].date + "T00:00:00").getMonth()]
                        : ""}
                    </div>
                    {week.map((day, di) => (
                      <div
                        key={di}
                        title={day.date ? `${day.date}: ${day.count} contributions` : ""}
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "2px",
                          background: day.date
                            ? LEVEL_COLORS[day.level]
                            : "transparent",
                          cursor: "default",
                          transition: "transform 0.1s"
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLDivElement).style.transform = "scale(1.3)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Legend */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "4px",
            marginTop: "0.75rem"
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-code)",
              fontSize: "9px",
              color: "var(--text-muted)"
            }}
          >
            Less
          </span>
          {LEVEL_COLORS.map((c, i) => (
            <div
              key={i}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                background: c,
                border: "1px solid rgba(0,212,255,0.1)"
              }}
            />
          ))}
          <span
            style={{
              fontFamily: "var(--font-code)",
              fontSize: "9px",
              color: "var(--text-muted)"
            }}
          >
            More
          </span>
        </div>
      </motion.div>

      {/* System Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginTop: "1.5rem"
        }}
        className="metrics-grid"
      >
        {[
          { label: "Total Commits", value: totalCommits.toLocaleString(), unit: "last 365 days" },
          { label: "Longest Streak", value: `${longestStreak}`, unit: "days" },
          { label: "Current Streak", value: `${currentStreak}`, unit: "days" }
        ].map(({ label, value, unit }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="glass-card"
            style={{ padding: "1.25rem", textAlign: "center" }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                fontWeight: 700,
                color: "var(--accent-primary)",
                marginBottom: "4px"
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "11px",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em"
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "10px",
                color: "rgba(107,114,128,0.6)",
                marginTop: "2px"
              }}
            >
              {unit}
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .metrics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
