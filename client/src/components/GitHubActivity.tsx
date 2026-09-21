/**
 * Obsidian Terminal Atlas — public GitHub activity module.
 * It intentionally shows no fabricated statistics: add a real public username to activate live data.
 */
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

// Add your public GitHub username here to activate live profile statistics and recent activity.
const GITHUB_USERNAME = "nirupamdutta746-web";

type GitHubProfile = { login: string; html_url: string; avatar_url: string; public_repos: number; followers: number };
type GitHubRepo = { stargazers_count: number };

function MotionPanel({ children, className }: { children: React.ReactNode; className: string }) {
  const shouldReduceMotion = useReducedMotion();
  return <motion.div className={className} initial={shouldReduceMotion ? false : { opacity: 0, y: 22, scale: 0.99 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.62, ease: [0.23, 1, 0.32, 1] }}>{children}</motion.div>;
}

export default function GitHubActivity() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [starCount, setStarCount] = useState<number | null>(null);
  const [status, setStatus] = useState<"configure" | "loading" | "ready" | "error">(GITHUB_USERNAME ? "loading" : "configure");

  useEffect(() => {
    if (!GITHUB_USERNAME) return;
    const controller = new AbortController();
    const loadGitHubData = async () => {
      try {
        setStatus("loading");
        const [profileResponse, reposResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { signal: controller.signal }),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, { signal: controller.signal }),
        ]);
        if (!profileResponse.ok || !reposResponse.ok) throw new Error("GitHub data unavailable");
        const [profileData, reposData] = await Promise.all([
          profileResponse.json() as Promise<GitHubProfile>,
          reposResponse.json() as Promise<GitHubRepo[]>,
        ]);
        setProfile(profileData);
        setStarCount(reposData.reduce((total, repo) => total + repo.stargazers_count, 0));
        setStatus("ready");
      } catch (error) {
        if ((error as Error).name !== "AbortError") setStatus("error");
      }
    };
    loadGitHubData();
    return () => controller.abort();
  }, []);

  const configured = status === "ready" && profile;

  return (
    <section id="github" className="github-section section-shell" data-index="02">
      <div className="section-mark" aria-hidden="true"><span>[02.1]</span><i /><span>github activity</span><b><em /><em /><em /></b></div>
      <MotionPanel className="github-heading">
        <div><p className="eyebrow">public developer footprint</p><h2>Open-source<br /><em>trace.</em></h2></div>
        <p>A live public snapshot of repositories, followers, and stars from my GitHub profile.</p>
      </MotionPanel>
      {configured ? (
        <MotionPanel className="github-console">
          <div className="github-profile"><img src={profile.avatar_url} alt={`${profile.login}'s GitHub avatar`} /><div><span>github.com/{profile.login}</span><h3>@{profile.login}</h3><a href={profile.html_url} target="_blank" rel="noreferrer">open profile <ArrowUpRight size={15} /></a></div></div>
          <div className="github-stat-grid"><div><b>{profile.public_repos}</b><span>public repos</span></div><div><b>{profile.followers}</b><span>followers</span></div><div><b>{starCount ?? "—"}</b><span>total stars</span></div></div>
        </MotionPanel>
      ) : (
        <MotionPanel className="github-config-card">
          <div className="github-config-icon">&lt;/&gt;</div>
          <div><p className="eyebrow">status / {status === "error" ? "unavailable" : status}</p><h3>{status === "loading" ? "Reading GitHub signals…" : "Awaiting GitHub identity."}</h3><p>Set <code>GITHUB_USERNAME</code> near the top of <code>client/src/components/GitHubActivity.tsx</code> to your public GitHub handle. This module will then resolve your real repositories, follower count, and stars.</p></div>
        </MotionPanel>
      )}
    </section>
  );
}
