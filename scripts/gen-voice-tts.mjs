/**
 * Generate WAV files from audio scripts.json using Windows System.Speech.
 * Jobs are passed via UTF-8 JSON so special characters stay safe.
 * Run: node scripts/gen-voice-tts.mjs [filter]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const audioRoot = path.join(root, "audio");
const only = process.argv[2] || "";
const BATCH = 30;

function collectJobs() {
  const jobs = [];
  if (!fs.existsSync(audioRoot)) return jobs;
  for (const gameId of fs.readdirSync(audioRoot)) {
    if (only && gameId !== only && !gameId.includes(only)) continue;
    const gameDir = path.join(audioRoot, gameId);
    if (!fs.statSync(gameDir).isDirectory()) continue;
    for (const loc of fs.readdirSync(gameDir)) {
      const scriptsPath = path.join(gameDir, loc, "scripts.json");
      if (!fs.existsSync(scriptsPath)) continue;
      const scripts = JSON.parse(fs.readFileSync(scriptsPath, "utf8"));
      const culture = loc === "bn" ? "bn-BD" : "en-US";
      for (const [key, text] of Object.entries(scripts)) {
        if (!text || !String(text).trim()) continue;
        const out = path.join(gameDir, loc, `${key}.wav`);
        if (fs.existsSync(out) && fs.statSync(out).size > 1000) continue;
        jobs.push({
          out,
          text: String(text)
            .trim()
            .replace(/[→←↔⇒⇐]/g, " to ")
            .replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\u024F\u0980-\u09FF]/g, " "),
          culture,
          key: `${gameId}/${loc}/${key}`,
        });
      }
    }
  }
  return jobs;
}

function runBatch(batch) {
  const jsonPath = path.join(root, "scripts", `_tts-jobs-${process.pid}-${Date.now()}.json`);
  const psPath = path.join(root, "scripts", `_tts-run-${process.pid}-${Date.now()}.ps1`);
  fs.writeFileSync(jsonPath, JSON.stringify(batch), "utf8");
  const ps = `
param([Parameter(Mandatory=$true)][string]$JobsPath)
Add-Type -AssemblyName System.Speech
$raw = Get-Content -LiteralPath $JobsPath -Raw -Encoding UTF8
$jobs = $raw | ConvertFrom-Json
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = -1
$ok = 0
try {
  foreach ($j in $jobs) {
    $dir = Split-Path -Parent $j.out
    if (-not (Test-Path -LiteralPath $dir)) {
      New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    $voices = $synth.GetInstalledVoices() | Where-Object { $_.Enabled }
    $pick = $voices | Where-Object { $_.VoiceInfo.Culture.Name -like ($j.culture + '*') } | Select-Object -First 1
    if (-not $pick -and $j.culture.StartsWith('bn')) {
      $pick = $voices | Where-Object { $_.VoiceInfo.Culture.Name -like 'en*' } | Select-Object -First 1
    }
    if ($pick) { $null = $synth.SelectVoice($pick.VoiceInfo.Name) }
    $synth.SetOutputToWaveFile($j.out)
    $synth.Speak([string]$j.text)
    $synth.SetOutputToNull()
    $ok++
  }
} finally {
  $synth.Dispose()
}
Write-Output ("DONE " + $ok)
`;
  fs.writeFileSync(psPath, ps, "utf8");
  try {
    const r = spawnSync(
      "powershell",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", psPath, "-JobsPath", jsonPath],
      { encoding: "utf8", windowsHide: true, maxBuffer: 10 * 1024 * 1024 },
    );
    if (r.status !== 0) {
      throw new Error((r.stderr || r.stdout || `exit ${r.status}`).slice(0, 600));
    }
    const m = String(r.stdout || "").match(/DONE\s+(\d+)/);
    return m ? Number(m[1]) : 0;
  } finally {
    try {
      fs.unlinkSync(jsonPath);
    } catch {
      /* ignore */
    }
    try {
      fs.unlinkSync(psPath);
    } catch {
      /* ignore */
    }
  }
}

function main() {
  const jobs = collectJobs();
  console.log(`Generating ${jobs.length} missing wav files…`);
  let ok = 0;
  let fail = 0;
  for (let i = 0; i < jobs.length; i += BATCH) {
    const batch = jobs.slice(i, i + BATCH);
    try {
      const n = runBatch(batch);
      ok += n;
      console.log(`  ${Math.min(i + BATCH, jobs.length)}/${jobs.length} (ok ${ok}, fail ${fail})`);
    } catch (e) {
      console.warn("batch fail", e.message);
      for (const j of batch) {
        try {
          const n = runBatch([j]);
          ok += n;
        } catch (e2) {
          fail += 1;
          console.warn("fail", j.key, e2.message.slice(0, 200));
        }
      }
      console.log(`  ${Math.min(i + BATCH, jobs.length)}/${jobs.length} (ok ${ok}, fail ${fail})`);
    }
  }
  console.log(`done: ok=${ok} fail=${fail}`);
}

main();
