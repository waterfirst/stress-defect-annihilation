# StressLab 3D

레이저 가공 유리의 **phonon-assisted topological stress-defect annihilation** 논문을 사용 가능한 React + Three.js 3D 디지털 트윈으로 확장한 프로젝트입니다.

[▶ Live Simulator](https://waterfirst.github.io/stress-defect-annihilation/) · [논문 HTML](https://waterfirst.github.io/stress-defect-annihilation/paper.html) · [기존 2D 시뮬레이션](https://waterfirst.github.io/stress-defect-annihilation/annihilation_2d.html)

## 구현 기능

- 투명 유리 slab, TGV, 압축/인장 응력 볼륨, 주응력 방향장, phonon particle을 결합한 실시간 3D 장면
- 반대 부호 결함 쌍, 동일 부호 대조군, 3 × 3 교대 TGV 배열 비교
- D263 borosilicate, fused silica, aluminosilicate UTG 재료 preset
- via 반경/pitch/두께, 초기 응력, T/Tg, CO₂ laser power/spot, Ea, Debye prefactor, 열확산, 탄성 결합, 점도, 비선형 질서항 제어
- 응력 소멸률, 특성 시간, 99% 공정시간, 파손위험 proxy, 복굴절 retardation, Brillouin 및 Raman observable 실시간 계산
- 시나리오 저장/불러오기, CSV 이력 및 PNG 3D snapshot 내보내기
- 저온·Tg 초과·고활성화에너지·좁은 ligament·동일부호 조건 자동 경고
- 데스크톱/태블릿/모바일 반응형 UI

## 지배 모델

논문의 지배식을 브라우저에서 실시간 계산 가능한 3D reduced-order field로 투영합니다.

```text
∂Sσ/∂t = Dth∇²Sσ − Γph(T,Sσ)Sσ + Fel/(ℓ²η(T))

Γph(T,Sσ) = νD exp(−Ea/kBT) · [1 − Sσ²(T/Tg)]
```

응력 질서변수 `Sσ`는 stress-optical law로 retardation에 연결하고, BLS velocity shift와 Raman peak shift는 논문의 검증 실험에 대응하는 proxy로 표시합니다. 3D 장면의 움직이는 core는 위상 결함의 attraction/annihilation을 나타내며 물리적 via 위치는 고정됩니다.

> 중요: 본 시뮬레이터는 논문 가설을 탐색하는 reduced-order model입니다. 구조 안전 판정이나 양산 recipe 확정에는 Mueller polarimetry/BLS/Raman 실측 계수 보정과 viscoelastic FEA 교차 검증이 필요합니다.

## 실행

Node.js 20 이상을 권장합니다.

```bash
npm install
npm run dev
```

프로덕션 빌드와 수치 테스트:

```bash
npm test
npm run build
npm run preview
```

GitHub Pages용 정적 번들을 루트 `index.html`과 `assets/`에 반영하려면 `npm run publish:pages`를 실행합니다.

## 구조

```text
src/
  App.tsx                    # 공정 UI, playback, export, scenario 관리
  components/ThreeScene.tsx # Three.js 3D field renderer
  components/HistoryChart.tsx
  physics/model.ts           # 재료, kinetics, field 및 observable 계산
  types.ts
tests/model.test.ts          # 온도·시간·위상·수치 안정성 검증
```

## 논문 기준과 해석

- 기본 D263 조건은 `T = 0.95 Tg`, pitch `100 μm`, `Ea = 2.0 eV`로 논문의 약 0.5 s 특성시간에 맞는 탐색 범위를 제공합니다.
- 논문의 `Ea = 2–4 eV` 범위는 Arrhenius 민감도가 매우 큽니다. 특히 2.8 eV 이상에서는 0.5 s 주장과 큰 차이가 날 수 있어 UI가 실험 보정 경고를 표시합니다.
- `Dth`의 3D 열확산을 측정된 응력 질서변수로 투영할 때 0.02 projection factor를 사용합니다. 실측 시계열이 확보되면 이 계수와 `Fel/η`를 회귀 보정해야 합니다.
- 동일 부호 결함은 완전 소멸하지 않는 잔류 바닥값을 포함하여 반대 부호 쌍의 대조군으로 사용합니다.

## 저자 및 원 논문

**Nakcho Choi** — *Phonon-Assisted Topological Stress-Defect Annihilation in Laser-Drilled Glass*  
Target: SID Display Week 2027 / Journal of Display Technology
