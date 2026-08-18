import { useEffect, useMemo, useRef, useState } from "react";
import ThreeScene from "./components/ThreeScene";
import HistoryChart from "./components/HistoryChart";
import {
  DEFAULT_PARAMETERS,
  MATERIALS,
  SCENARIOS,
  computeMetrics,
  materialFor,
  modelWarnings,
  topologyLabel,
} from "./physics/model";
import type { HistoryPoint, SimulationParameters } from "./types";

type NumericKey = {
  [K in keyof SimulationParameters]: SimulationParameters[K] extends number ? K : never
}[keyof SimulationParameters];

interface RangeProps {
  label: string;
  value: number;
  unit?: string;
  min: number;
  max: number;
  step: number;
  hint?: string;
  onChange: (value: number) => void;
}

function RangeControl({ label, value, unit = "", min, max, step, hint, onChange }: RangeProps) {
  const digits = step < 0.01 ? 3 : step < 0.1 ? 2 : step < 1 ? 1 : 0;
  return (
    <label className="range-control">
      <span className="range-heading"><span>{label}</span><output>{value.toFixed(digits)} {unit}</output></span>
      <input type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    play: "M8 5v14l11-7z",
    pause: "M7 5h4v14H7zm6 0h4v14h-4z",
    reset: "M4 4v6h6M5.6 15A8 8 0 1 0 7 6.1L4 10",
    download: "M12 3v12m0 0 5-5m-5 5-5-5M5 20h14",
    save: "M5 4h12l2 2v14H5zM8 4v6h8V4M8 20v-7h8v7",
    cube: "m12 3 8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9",
  };
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={paths[name]} /></svg>;
}

function formatTime(value: number) {
  if (value >= 1000) return `${(value / 3600).toFixed(1)} h`;
  if (value >= 10) return `${value.toFixed(1)} s`;
  if (value >= 0.01) return `${value.toFixed(3)} s`;
  return `${(value * 1000).toFixed(2)} ms`;
}

export default function App() {
  const [params, setParams] = useState<SimulationParameters>(DEFAULT_PARAMETERS);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [scenarioKey, setScenarioKey] = useState("baseline");
  const [activePanel, setActivePanel] = useState<"geometry" | "physics" | "view">("geometry");
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [toast, setToast] = useState("");
  const lastHistory = useRef(-1);

  const metrics = useMemo(() => computeMetrics(params, time), [params, time]);
  const warnings = useMemo(() => modelWarnings(params), [params]);
  const material = materialFor(params);
  const timelineMax = Math.min(Math.max(metrics.processTime99 * 1.1, 2), 60);
  const isTruncated = metrics.processTime99 > timelineMax;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setTime((current) => {
        const next = current + 0.033 * params.playbackSpeed;
        if (next >= timelineMax) {
          setPlaying(false);
          return timelineMax;
        }
        return next;
      });
    }, 33);
    return () => window.clearInterval(timer);
  }, [playing, params.playbackSpeed, timelineMax]);

  useEffect(() => {
    const sampleGap = Math.max(0.035, timelineMax / 180);
    if (time === 0) {
      const initial = computeMetrics(params, 0);
      setHistory([{ time: 0, stress: initial.peakStressMPa, order: initial.meanOrder, risk: initial.crackRiskPct }]);
      lastHistory.current = 0;
      return;
    }
    if (time - lastHistory.current >= sampleGap || time >= timelineMax) {
      setHistory((current) => [...current.slice(-179), { time, stress: metrics.peakStressMPa, order: metrics.meanOrder, risk: metrics.crackRiskPct }]);
      lastHistory.current = time;
    }
  }, [time, metrics.peakStressMPa, metrics.meanOrder, metrics.crackRiskPct, params, timelineMax]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const reset = (nextParams = params) => {
    setPlaying(false);
    setTime(0);
    setHistory([]);
    lastHistory.current = -1;
    setParams(nextParams);
  };

  const setNumeric = (key: NumericKey, value: number) => {
    if (key === "playbackSpeed" || key === "sliceZ") {
      setParams((current) => ({ ...current, [key]: value }));
      return;
    }
    setScenarioKey("custom");
    reset({ ...params, [key]: value });
  };

  const applyScenario = (key: string) => {
    const scenario = SCENARIOS[key];
    setScenarioKey(key);
    reset({ ...DEFAULT_PARAMETERS, ...scenario.params });
    setToast(`${scenario.label} 시나리오를 불러왔습니다.`);
  };

  const saveScenario = () => {
    localStorage.setItem("stresslab3d:scenario", JSON.stringify(params));
    setToast("현재 파라미터를 브라우저에 저장했습니다.");
  };

  const loadScenario = () => {
    const saved = localStorage.getItem("stresslab3d:scenario");
    if (!saved) return setToast("저장된 사용자 시나리오가 없습니다.");
    reset({ ...DEFAULT_PARAMETERS, ...JSON.parse(saved) });
    setScenarioKey("custom");
    setToast("저장된 사용자 시나리오를 불러왔습니다.");
  };

  const download = (content: string, type: string, name: string) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const parameterRows = Object.entries(params).map(([key, value]) => `# ${key},${value}`);
    const rows = history.map((point) => [point.time, point.stress, point.order, point.risk].map((value) => Number(value).toFixed(6)).join(","));
    download([...parameterRows, "time_s,peak_stress_mpa,mean_order,crack_risk_pct", ...rows].join("\n"), "text/csv", "stresslab3d-result.csv");
    setToast("공정 이력 CSV를 내보냈습니다.");
  };

  const exportSnapshot = () => {
    const canvas = document.querySelector<HTMLCanvasElement>("canvas[data-simulation-canvas]");
    if (!canvas) return;
    const anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = `stresslab3d-${time.toFixed(2)}s.png`;
    anchor.click();
    setToast("3D 뷰를 PNG로 저장했습니다.");
  };

  const status = metrics.annihilationPct >= 90 && metrics.crackRiskPct < 20
    ? { label: "공정 완료", tone: "good" }
    : metrics.crackRiskPct >= 50
      ? { label: "파손 위험", tone: "danger" }
      : { label: playing ? "시뮬레이션 중" : "분석 준비", tone: "active" };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark"><Icon name="cube" /></span>
          <span><strong>StressLab</strong><b>3D</b></span>
          <em>PHONON DIGITAL TWIN</em>
        </div>
        <nav>
          <a href="paper.html">논문</a>
          <a href="annihilation_2d.html">기존 2D</a>
          <a href="solution_dashboard.html">공정 솔루션</a>
          <a href="https://github.com/waterfirst/stress-defect-annihilation" target="_blank" rel="noreferrer">GitHub ↗</a>
        </nav>
        <div className={`run-status ${status.tone}`}><i />{status.label}</div>
      </header>

      <main className="workspace">
        <aside className="control-rail">
          <div className="rail-heading">
            <div><span className="eyebrow">PROCESS RECIPE</span><h1>시뮬레이션 조건</h1></div>
            <button className="icon-button" onClick={() => reset(DEFAULT_PARAMETERS)} title="기본값으로 초기화"><Icon name="reset" /></button>
          </div>

          <label className="select-control featured">
            <span>검증 시나리오</span>
            <select value={scenarioKey} onChange={(event) => applyScenario(event.target.value)}>
              {Object.entries(SCENARIOS).map(([key, scenario]) => <option key={key} value={key}>{scenario.label}</option>)}
              {scenarioKey === "custom" && <option value="custom">사용자 저장값</option>}
            </select>
            <small>{SCENARIOS[scenarioKey]?.description ?? "저장된 사용자 조건"}</small>
          </label>

          <div className="tab-list">
            <button className={activePanel === "geometry" ? "active" : ""} onClick={() => setActivePanel("geometry")}>기하</button>
            <button className={activePanel === "physics" ? "active" : ""} onClick={() => setActivePanel("physics")}>물리</button>
            <button className={activePanel === "view" ? "active" : ""} onClick={() => setActivePanel("view")}>표시</button>
          </div>

          <div className="control-stack">
            {activePanel === "geometry" && <>
              <label className="select-control"><span>유리 재료</span><select value={params.material} onChange={(event) => { setScenarioKey("custom"); reset({ ...params, material: event.target.value as SimulationParameters["material"] }); }}>{Object.values(MATERIALS).map((item) => <option key={item.key} value={item.key}>{item.name}</option>)}</select></label>
              <label className="select-control"><span>결함 위상</span><select value={params.topology} onChange={(event) => { setScenarioKey("custom"); reset({ ...params, topology: event.target.value as SimulationParameters["topology"] }); }}><option value="opposite">반대 부호 쌍 (+/−)</option><option value="same">동일 부호 쌍 (+/+)</option><option value="alternatingArray">3 × 3 교대 배열</option></select></label>
              <RangeControl label="Via 반경" value={params.viaRadiusUm} unit="μm" min={8} max={40} step={1} onChange={(value) => setNumeric("viaRadiusUm", value)} />
              <RangeControl label="Via pitch" value={params.viaPitchUm} unit="μm" min={50} max={220} step={2} onChange={(value) => setNumeric("viaPitchUm", value)} />
              <RangeControl label="유리 두께" value={params.thicknessUm} unit="μm" min={30} max={300} step={5} onChange={(value) => setNumeric("thicknessUm", value)} />
              <RangeControl label="초기 주응력차" value={params.initialStressMPa} unit="MPa" min={20} max={260} step={5} onChange={(value) => setNumeric("initialStressMPa", value)} />
            </>}

            {activePanel === "physics" && <>
              <RangeControl label="어닐 온도" value={params.annealRatio} unit="Tg" min={0.72} max={1.06} step={0.01} hint={`${(params.annealRatio * material.glassTransitionK).toFixed(0)} K`} onChange={(value) => setNumeric("annealRatio", value)} />
              <RangeControl label="CO₂ 레이저 출력" value={params.laserPowerW} unit="W" min={1} max={12} step={0.2} onChange={(value) => setNumeric("laserPowerW", value)} />
              <RangeControl label="빔 반경" value={params.beamRadiusUm} unit="μm" min={45} max={220} step={5} onChange={(value) => setNumeric("beamRadiusUm", value)} />
              <RangeControl label="활성화 에너지 Ea" value={params.activationEnergyEv} unit="eV" min={1.6} max={4} step={0.05} onChange={(value) => setNumeric("activationEnergyEv", value)} />
              <RangeControl label="열확산 배율" value={params.diffusionScale} unit="×" min={0.1} max={3} step={0.1} onChange={(value) => setNumeric("diffusionScale", value)} />
              <RangeControl label="탄성 상호작용" value={params.elasticCoupling} min={0} max={1.5} step={0.05} onChange={(value) => setNumeric("elasticCoupling", value)} />
              <RangeControl label="log₁₀ 점도" value={params.logViscosity} unit="Pa·s" min={6.5} max={11} step={0.1} onChange={(value) => setNumeric("logViscosity", value)} />
              <RangeControl label="질서항 결합계수" value={params.nonlinearOrder} min={0} max={1.5} step={0.05} onChange={(value) => setNumeric("nonlinearOrder", value)} />
            </>}

            {activePanel === "view" && <>
              <label className="select-control"><span>3D 표현</span><select value={params.viewMode} onChange={(event) => setParams((current) => ({ ...current, viewMode: event.target.value as SimulationParameters["viewMode"] }))}><option value="hybrid">볼륨 + 단면</option><option value="volume">응력 볼륨</option><option value="slice">복굴절 단면</option></select></label>
              <RangeControl label="단면 깊이" value={params.sliceZ} min={-1} max={1} step={0.05} onChange={(value) => setNumeric("sliceZ", value)} />
              <RangeControl label="3D 격자 해상도" value={params.gridResolution} min={20} max={36} step={4} hint={`${params.gridResolution}² × depth`} onChange={(value) => setNumeric("gridResolution", value)} />
              <RangeControl label="재생 속도" value={params.playbackSpeed} unit="×" min={0.25} max={4} step={0.25} onChange={(value) => setNumeric("playbackSpeed", value)} />
              <label className="switch-control"><span><b>포논 입자</b><small>열적 산란의 시각적 proxy</small></span><input type="checkbox" checked={params.showPhonons} onChange={(event) => setParams((current) => ({ ...current, showPhonons: event.target.checked }))} /></label>
              <label className="switch-control"><span><b>주응력 방향</b><small>상부 면의 방향장</small></span><input type="checkbox" checked={params.showVectors} onChange={(event) => setParams((current) => ({ ...current, showVectors: event.target.checked }))} /></label>
            </>}
          </div>

          <div className="rail-actions">
            <button onClick={saveScenario}><Icon name="save" />조건 저장</button>
            <button onClick={loadScenario}>불러오기</button>
          </div>
        </aside>

        <section className="simulation-stage">
          <div className="stage-toolbar">
            <div>
              <span className="eyebrow">LIVE FIELD · {topologyLabel(params.topology).toUpperCase()}</span>
              <h2>포논 보조 응력 결함 소멸</h2>
            </div>
            <div className="toolbar-actions">
              <button onClick={exportSnapshot}><Icon name="download" />PNG</button>
              <button onClick={exportCsv}><Icon name="download" />CSV</button>
            </div>
          </div>

          <div className="viewport-shell">
            <ThreeScene params={params} time={time} />
            <div className="view-badge top-left"><span>t =</span><strong>{time.toFixed(3)} s</strong></div>
            <div className="view-badge top-right"><span>격자</span><strong>{params.gridResolution}² × z</strong></div>
            <div className="view-legend"><span><i className="compression" />압축 +</span><span><i className="tension" />인장 −</span><span><i className="phonon" />포논</span></div>
            <div className="viewport-note">드래그 회전 · 휠 확대 · 우클릭 이동</div>
          </div>

          <div className="transport">
            <button className="play-button" onClick={() => setPlaying((current) => !current)}><Icon name={playing ? "pause" : "play"} /></button>
            <button className="step-button" onClick={() => setTime((current) => Math.min(timelineMax, current + timelineMax / 50))}>+ STEP</button>
            <input aria-label="simulation time" type="range" min={0} max={timelineMax} step={timelineMax / 500} value={time} onChange={(event) => { setPlaying(false); setTime(Number(event.target.value)); }} />
            <span>{formatTime(timelineMax)}</span>
            <button className="icon-button" onClick={() => reset(params)} title="시간 초기화"><Icon name="reset" /></button>
          </div>
          {isTruncated && <div className="timeline-warning">예측 99% 공정시간은 {formatTime(metrics.processTime99)}입니다. 인터랙티브 재생은 60 s에서 제한됩니다.</div>}

          <HistoryChart points={history} />
        </section>

        <aside className="insight-rail">
          <div className="insight-heading"><span className="eyebrow">MODEL OUTPUT</span><h2>실시간 공정 지표</h2></div>
          <div className="metric-grid">
            <article className="metric-card primary"><span>소멸 진행률</span><strong>{metrics.annihilationPct.toFixed(1)}<small>%</small></strong><div className="progress"><i style={{ width: `${metrics.annihilationPct}%` }} /></div></article>
            <article className="metric-card"><span>잔류 피크 응력</span><strong>{metrics.peakStressMPa.toFixed(1)}<small>MPa</small></strong><em>초기 {params.initialStressMPa} MPa</em></article>
            <article className="metric-card"><span>특성 소멸시간 τ</span><strong>{formatTime(metrics.characteristicTime)}</strong><em>99%: {formatTime(metrics.processTime99)}</em></article>
            <article className={`metric-card ${metrics.crackRiskPct > 50 ? "risk" : ""}`}><span>파손 위험 proxy</span><strong>{metrics.crackRiskPct.toFixed(1)}<small>%</small></strong><em>ligament {Math.max(params.viaPitchUm - 2 * params.viaRadiusUm, 0).toFixed(0)} μm</em></article>
          </div>

          <div className="observable-panel">
            <div className="panel-title"><span>실험 관측량</span><em>예측 proxy</em></div>
            <dl>
              <div><dt>복굴절 retardation</dt><dd>{metrics.retardationNm.toFixed(3)} nm</dd></div>
              <div><dt>Brillouin Δv/v</dt><dd>{metrics.brillouinShiftPct.toFixed(3)} %</dd></div>
              <div><dt>Raman peak shift</dt><dd>{metrics.ramanShiftCm.toFixed(3)} cm⁻¹</dd></div>
              <div><dt>Γ<sub>ph</sub> @ center</dt><dd>{metrics.gammaPh < 0.001 ? metrics.gammaPh.toExponential(2) : metrics.gammaPh.toFixed(3)} s⁻¹</dd></div>
              <div><dt>열 예산</dt><dd>{metrics.thermalBudgetJ.toFixed(2)} J</dd></div>
            </dl>
          </div>

          <div className="equation-panel">
            <span className="panel-kicker">GOVERNING MODEL</span>
            <div className="equation">∂S<sub>σ</sub>/∂t = D<sub>th</sub>∇²S<sub>σ</sub> − Γ<sub>ph</sub>S<sub>σ</sub> + F<sub>el</sub>/(ℓ²η)</div>
            <div className="equation small">Γ<sub>ph</sub> = ν<sub>D</sub>e<sup>−Eₐ/kBT</sup>[1 − S<sub>σ</sub>²(T/T<sub>g</sub>)]</div>
            <p>논문 식을 실시간 3D reduced-order field로 투영했습니다. 정량 공정 확정 전 Mueller/BLS/Raman 데이터로 계수를 보정해야 합니다.</p>
          </div>

          <div className="validation-panel">
            <div className="panel-title"><span>모델 유효성 점검</span><em>{warnings.length ? `${warnings.length}개 주의` : "정상 범위"}</em></div>
            {warnings.length ? <ul>{warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul> : <p className="valid">현재 조건은 reduced-order 모델의 권장 탐색 범위입니다.</p>}
          </div>

          <div className="material-card">
            <span>{material.name}</span>
            <dl><div><dt>Tg</dt><dd>{material.glassTransitionK} K</dd></div><div><dt>Dth</dt><dd>{material.thermalDiffusivity.toExponential(1)} m²/s</dd></div><div><dt>C</dt><dd>{material.stressOpticalCoefficient} nm/cm/MPa</dd></div><div><dt>E</dt><dd>{material.elasticModulusGPa} GPa</dd></div></dl>
          </div>
        </aside>
      </main>

      <footer><span>StressLab 3D · research digital twin</span><span>논문의 위상 유사성은 가설적 모델이며, 구조 해석/양산 판정에는 실험 교정과 FEA 검증이 필요합니다.</span></footer>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
