import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Server,
  Rocket,
  FileJson,
  Activity,
  Download,
  Play,
  RefreshCw,
  Database,
  Boxes,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-3xl border border-white/10 ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function Button({
  children,
  className = "",
  variant,
  ...props
}) {
  return (
    <button
      className={`rounded-xl px-4 py-2 transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

const profiles = [
  {
    id: "uk-finance",
    name: "UK Finance Sandbox",
    description: "Standard GB Business Central sandbox with finance-ready demo structure.",
    country: "GB",
    version: "Latest stable",
    icon: Database,
    tags: ["Finance", "Demo Data", "UK"],
  },
  {
    id: "integration-lab",
    name: "Integration Lab",
    description: "API, Power Platform, Power BI and external system readiness profile.",
    country: "GB",
    version: "Latest stable",
    icon: Boxes,
    tags: ["API", "Power Platform", "Testing"],
  },
  {
    id: "clean-dev",
    name: "Clean Developer Environment",
    description: "Barebone sandbox for AL development and extension testing.",
    country: "GB",
    version: "Latest stable",
    icon: TerminalSquare,
    tags: ["AL", "Clean", "Developer"],
  },
];

const checks = [
  { id: "admin", label: "Admin rights", status: "pass", detail: "Required to run Docker and container commands." },
  { id: "docker", label: "Docker Desktop", status: "warning", detail: "Detected check placeholder. Real check will run via PowerShell." },
  { id: "windows", label: "Windows containers", status: "warning", detail: "Must be enabled before BC container deployment." },
  { id: "hyperv", label: "Hyper-V", status: "pass", detail: "Required for local container support." },
  { id: "ports", label: "Ports 8080 / 7049", status: "pass", detail: "Default web and development ports appear available." },
  { id: "ram", label: "Memory threshold", status: "pass", detail: "Recommended minimum: 16GB RAM for smoother setup." },
];

const deploymentSteps = [
  "Reading deployment profile",
  "Checking machine readiness",
  "Preparing BC artifact request",
  "Creating container script",
  "Configuring ports and credentials",
  "Preparing demo data package",
  "Running health validation",
  "Generating setup report",
];

function StatusIcon({ status }) {
  if (status === "pass") return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
  if (status === "warning") return <AlertTriangle className="h-5 w-5 text-amber-300" />;
  return <XCircle className="h-5 w-5 text-red-400" />;
}

function Pill({ children }) {
  return <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">{children}</span>;
}

export default function BCLaunchPadMVP() {
  const [selectedProfile, setSelectedProfile] = useState(profiles[0]);
  const [running, setRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activeTab, setActiveTab] = useState("deploy");

  const readiness = useMemo(() => {
    const pass = checks.filter((c) => c.status === "pass").length;
    const warning = checks.filter((c) => c.status === "warning").length;
    return { pass, warning, total: checks.length };
  }, []);

  const startDeployment = () => {
    setRunning(true);
    setCompletedSteps([]);

    deploymentSteps.forEach((step, index) => {
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, step]);
        if (index === deploymentSteps.length - 1) setRunning(false);
      }, 550 * (index + 1));
    });
  };

  const resetDemo = () => {
    setRunning(false);
    setCompletedSteps([]);
  };

  const configJson = JSON.stringify(
    {
      name: selectedProfile.name,
      country: selectedProfile.country,
      bcVersion: selectedProfile.version,
      auth: "UserPassword",
      includeAL: selectedProfile.id === "clean-dev",
      includeTestToolkit: false,
      loadDemoData: selectedProfile.id !== "clean-dev",
      ports: {
        web: 8080,
        dev: 7049,
      },
    },
    null,
    2
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-10 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-10 top-40 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75"
            >
              <Rocket className="h-4 w-4" /> SimCoLabs Accelerator Prototype
            </motion.div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">BC LaunchPad</h1>
            <p className="mt-3 max-w-2xl text-base text-slate-300 md:text-lg">
              Rapid Business Central sandbox orchestration: validate the machine, select a deployment profile, run setup and export a clean readiness report.
            </p>
          </div>

          <Card className="border-white/10 bg-white/5 text-white backdrop-blur-xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-emerald-400/10 p-3">
                  <ShieldCheck className="h-7 w-7 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Readiness Score</p>
                  <p className="text-2xl font-semibold">{readiness.pass}/{readiness.total}</p>
                  <p className="text-xs text-amber-200">{readiness.warning} checks need confirmation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </header>

        <section className="mb-6 flex flex-wrap gap-3">
          {[
            ["deploy", "Deployment"],
            ["checks", "Pre-flight Checks"],
            ["config", "Profile JSON"],
            ["report", "Output Report"],
          ].map(([id, label]) => (
            <Button
              key={id}
              variant="ghost"
              onClick={() => setActiveTab(id)}
              className={`rounded-full border px-5 ${
                activeTab === id ? "border-cyan-300 bg-cyan-300/15 text-cyan-100" : "border-white/10 bg-white/5 text-slate-300"
              }`}
            >
              {label}
            </Button>
          ))}
        </section>

        {activeTab === "deploy" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Choose Environment Profile</h2>
              {profiles.map((profile) => {
                const Icon = profile.icon;
                const selected = selectedProfile.id === profile.id;
                return (
                  <motion.button
                    key={profile.id}
                    whileHover={{ y: -2 }}
                    onClick={() => setSelectedProfile(profile)}
                    className={`w-full rounded-3xl border p-5 text-left transition ${
                      selected ? "border-cyan-300 bg-cyan-300/10 shadow-2xl shadow-cyan-950" : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="rounded-2xl bg-white/10 p-3">
                        <Icon className="h-6 w-6 text-cyan-200" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{profile.name}</h3>
                        <p className="mt-1 text-sm text-slate-300">{profile.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {profile.tags.map((tag) => <Pill key={tag}>{tag}</Pill>)}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </section>

            <section>
              <Card className="h-full border-white/10 bg-slate-900/80 text-white backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold">Deployment Console</h2>
                      <p className="text-sm text-slate-300">Selected: {selectedProfile.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={resetDemo} variant="ghost" className="border border-white/10 bg-white/5 text-white">
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset
                      </Button>
                      <Button onClick={startDeployment} disabled={running} className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                        <Play className="mr-2 h-4 w-4" /> {running ? "Running" : "Run"}
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/40 p-4 font-mono text-sm">
                    {deploymentSteps.map((step, index) => {
                      const done = completedSteps.includes(step);
                      const active = running && completedSteps.length === index;
                      return (
                        <div key={step} className="flex items-center gap-3 border-b border-white/5 py-3 last:border-b-0">
                          {done ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : active ? <Activity className="h-4 w-4 animate-pulse text-cyan-300" /> : <span className="h-4 w-4 rounded-full border border-white/20" />}
                          <span className={done ? "text-emerald-100" : active ? "text-cyan-100" : "text-slate-500"}>{step}</span>
                        </div>
                      );
                    })}
                  </div>

                  {completedSteps.length === deploymentSteps.length && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-6 w-6 text-emerald-300" />
                        <div>
                          <h3 className="text-lg font-semibold text-emerald-100">Environment Ready</h3>
                          <p className="mt-1 text-sm text-slate-300">Prototype flow complete. Next step is wiring this console to the PowerShell deployment engine.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {activeTab === "checks" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {checks.map((check) => (
              <Card key={check.id} className="border-white/10 bg-white/5 text-white backdrop-blur-xl">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <Server className="h-5 w-5 text-cyan-200" />
                    <StatusIcon status={check.status} />
                  </div>
                  <h3 className="text-lg font-semibold">{check.label}</h3>
                  <p className="mt-2 text-sm text-slate-300">{check.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "config" && (
          <Card className="border-white/10 bg-slate-900/80 text-white backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <FileJson className="h-6 w-6 text-cyan-200" />
                <h2 className="text-2xl font-semibold">Deployment Profile JSON</h2>
              </div>
              <pre className="overflow-auto rounded-3xl border border-white/10 bg-black/50 p-5 text-sm text-cyan-50">{configJson}</pre>
            </CardContent>
          </Card>
        )}

        {activeTab === "report" && (
          <Card className="border-white/10 bg-white/5 text-white backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">Setup Report Preview</h2>
                  <p className="text-sm text-slate-300">This becomes the generated handover pack after deployment.</p>
                </div>
                <Button className="bg-white text-slate-950 hover:bg-slate-100">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-slate-400">Environment</p>
                  <p className="mt-2 text-lg font-semibold">{selectedProfile.name}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-slate-400">Status</p>
                  <p className="mt-2 text-lg font-semibold text-emerald-200">Ready / Simulated</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-slate-400">Warnings</p>
                  <p className="mt-2 text-lg font-semibold text-amber-200">2 confirmations</p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-black/30 p-5">
                <h3 className="mb-3 text-lg font-semibold">Next Engineering Step</h3>
                <p className="text-sm leading-6 text-slate-300">
                  Replace simulated checks with PowerShell scripts, expose them through Electron IPC, then stream logs back into this deployment console.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
