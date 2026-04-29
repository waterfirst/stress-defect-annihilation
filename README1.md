# 📊 데일리 증시 뉴스 텔레그램 봇

매일 아침 8시, 9시, 오후 3시, 4시에 한국 증시 뉴스와 주요 지수 현황을 텔레그램으로 자동 발송하는 봇입니다.

---

## 🎯 주요 기능

| 시간 | 발송 내용 |
|------|----------|
| **08:00** | ☀️ 아침 개장 전 브리핑 (코스피/코스닥 현황 + 주요 뉴스) |
| **09:00** | 🚀 개장 직후 증시 현황 (주요 종목 동향) |
| **15:00** | ⏰ 장 마감 전 브리핑 (실시간 지수 + 뉴스) |
| **16:00** | 🌆 장 마감 후 데일리 리포트 (종합 정리) |

---

## 🚀 설치 및 실행 방법

### 1. 필요 패키지 설치

```bash
pip install -r requirements.txt
```

### 2. 텔레그램 봇 설정

#### 2-1. 봇 생성 및 토큰 발급
1. 텔레그램에서 **@BotFather** 검색
2. `/newbot` 명령어 입력
3. 봇 이름 설정 (예: `MyMarketNewsBot`)
4. 봇 사용자명 설정 (예: `mymarketnews_bot`)
5. **HTTP API Token** 복사 (예: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

#### 2-2. Chat ID 확인
1. 텔레그램에서 **@userinfobot** 검색
2. 아무 메시지나 본인의 Chat ID 확인 (예: `123456789`)

### 3. 환경변수 설정

```bash
# .env.example 파일을 .env로 복사
cp .env.example .env

# .env 파일 편집
nano .env
```

`.env` 파일 내용:
```
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

### 4. 봇 실행

```bash
python market_news_bot.py
```

---

## 🖥️ 백그라운드 실행 (컴퓨터 계속 켜놓기)

### 방법 1: nohup 사용 (간단)

```bash
nohup python market_news_bot.py > bot.log 2>&1 &
```

- 로그 확인: `tail -f bot.log`
- 프로세스 확인: `ps aux | grep market_news_bot`
- 종료: `kill [PID]`

### 방법 2: screen 사용 (권장)

```bash
# screen 설치 (Ubuntu/Debian)
sudo apt-get install screen

# 새 세션 생성
screen -S market_bot

# 봇 실행
python market_news_bot.py

# 세션 분리 (Ctrl+A, D)

# 세션 재접속
screen -r market_bot
```

### 방법 3: systemd 서비스 등록 (Ubuntu/Linux)

```bash
# 서비스 파일 생성
sudo nano /etc/systemd/system/market-news-bot.service
```

내용 입력:
```ini
[Unit]
Description=Daily Market News Telegram Bot
After=network.target

[Service]
Type=simple
User=your_username
WorkingDirectory=/path/to/bot/directory
Environment=PYTHONPATH=/path/to/bot/directory
ExecStart=/usr/bin/python3 /path/to/bot/directory/market_news_bot.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# 서비스 등록 및 시작
sudo systemctl daemon-reload
sudo systemctl enable market-news-bot
sudo systemctl start market-news-bot

# 상태 확인
sudo systemctl status market-news-bot

# 로그 확인
sudo journalctl -u market-news-bot -f
```

---

## 📝 메시지 예시

```
📊 아침 증시 브리핑 (개장 전)
🕐 2026년 02월 07일 08:00
==============================

📈 주요 지수
코스피: 5,163.84 (-207.73, -3.86%)
코스닥: 1,077.32 (-39.84, -3.57%)

📰 주요 뉴스
1. [코스피, 3.86% 급락…5,000선 붕괴]
2. [외국인, 역대 최대 5조원 순매도]
3. [반도체주 폭락…삼성·하이닉스 동반 하락]

💡 본 정보는 참고용이며, 투자 결정은 본인의 판단에 따라 신중하게 결정하시기 바랍니다.
```

---

## ⚙️ 커스터마이징

### 발송 시간 변경

`market_news_bot.py` 파일에서 스케줄 시간 수정:

```python
schedule.every().day.at("08:00").do(send_morning_news_8am)  # 원하는 시간으로 변경
schedule.every().day.at("09:00").do(send_morning_news_9am)
schedule.every().day.at("15:00").do(send_afternoon_news_3pm)
schedule.every().day.at("16:00").do(send_closing_news_4pm)
```

### 뉴스 소스 추가

`get_market_news()` 함수에서 원하는 뉴스 소스 추가 가능

---

## 🔧 문제 해결

### "Telegram Bot Token or Chat ID not set" 오류
- `.env` 파일이 올바른 위치에 있는지 확인
- 토큰과 Chat ID가 올바르게 입력되었는지 확인

### 메시지가 전송되지 않음
- 인터넷 연결 확인
- 텔레그램 봇이 차단되지 않았는지 확인 (@BotFather에서 확인)
- 봇과의 대화창에서 `/start` 명령어 입력

### 한글 깨짐
- 터미널 인코딩 UTF-8로 설정: `export LANG=ko_KR.UTF-8`

---

## 📄 파일 구조

```
.
├── market_news_bot.py    # 메인 스크립트
├── .env                  # 환경변수 (직접 생성)
├── .env.example          # 환경변수 템플릿
├── requirements.txt      # 필요 패키지 목록
└── README.md            # 이 파일
```

---

## ⚠️ 면책 조항

본 봇에서 제공하는 정보는 투자 참고용이며, 투자 결정에 대한 책임은 사용자 본인에게 있습니다. 시장 상황에 따라 정보가 지연되거나 불완전할 수 있습니다.

---

## 📞 문의

문제가 있으시면 텔레그램 봇 설정부터 다시 확인해 주세요!
