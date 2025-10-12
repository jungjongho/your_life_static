# 로컬 테스트 가이드

프로젝트가 완성되었습니다! 이제 로컬에서 테스트할 수 있습니다.

## 빠른 시작 (Docker 사용 - 권장)

### 1. 환경 변수 설정
```bash
cp .env.example .env
```

### 2. Frontend 의존성 설치
```bash
cd frontend
npm install
cd ..
```

### 3. Docker로 모든 서비스 실행
```bash
docker-compose up
```

또는 Makefile 사용:
```bash
make dev
```

### 4. 브라우저에서 접속
- Frontend: http://localhost:3050
- Backend API: http://localhost:8050
- API 문서: http://localhost:8050/docs

## 수동 실행 (Docker 없이)

### Backend 실행

```bash
cd backend

# 가상환경 생성 (선택사항)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# PostgreSQL 실행 필요 (Docker 또는 로컬)
# DATABASE_URL을 .env에 설정

# 서버 실행
uvicorn app.main:app --reload --port 8050
```

### Frontend 실행

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 기능 테스트

### 1. 생년월일 입력
- http://localhost:3050 접속
- 년, 월, 일 선택
- "내 통계 보기" 버튼 클릭

### 2. 통계 결과 확인
- 11개의 통계 카드가 애니메이션과 함께 표시됨
- 살아온 날, 시간, 분, 초
- 심장 박동, 숨 쉰 횟수, 잠잔 시간, 먹은 밥
- 다음 생일까지, 다음 만일까지

### 3. 이미지 다운로드
- "이미지로 저장" 버튼 클릭
- 통계 결과가 PNG 이미지로 다운로드됨

### 4. URL 공유
- "URL 복사" 버튼 클릭
- 클립보드에 URL이 복사됨
- 복사된 URL을 새 브라우저 탭에서 열면 자동으로 통계 계산됨

### 5. 다시 계산
- "다시 계산하기" 버튼 클릭
- 입력 화면으로 돌아감

## API 테스트

### Swagger UI로 테스트
http://localhost:8050/docs 접속

### curl로 테스트
```bash
# Health check
curl http://localhost:8050/health

# 통계 계산
curl -X POST http://localhost:8050/api/v1/stats/calculate \
  -H "Content-Type: application/json" \
  -d '{"year": 1990, "month": 1, "day": 1}'
```

## 구현된 기능 목록

### Backend (FastAPI)
- ✅ 생년월일 기반 통계 계산 서비스
- ✅ Pydantic 스키마로 입력 검증
- ✅ CORS 설정
- ✅ Health check 엔드포인트
- ✅ RESTful API 구조

### Frontend (Next.js)
- ✅ 생년월일 입력 컴포넌트 (드롭다운)
- ✅ 통계 카드 컴포넌트 (11개)
- ✅ 숫자 카운팅 애니메이션
- ✅ 이미지 다운로드 (html2canvas)
- ✅ URL 공유 기능 (쿼리 파라미터)
- ✅ Toast 알림
- ✅ 반응형 디자인
- ✅ 에러 처리

### 계산되는 통계
1. 현재 나이 (세)
2. 살아온 날 (일)
3. 살아온 시간 (시간)
4. 살아온 분 (분)
5. 살아온 초 (초)
6. 심장 박동 수 (회) - 72회/분 기준
7. 숨 쉰 횟수 (회) - 15회/분 기준
8. 잠잔 시간 (시간) - 8시간/일 기준
9. 먹은 밥 (끼) - 3끼/일 기준
10. 다음 생일까지 (일)
11. 다음 만일 기념일까지 (일)

## 프로젝트 구조

```
your_life_static/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── main.py            # FastAPI 앱 진입점
│   │   ├── routers/           # API 엔드포인트
│   │   │   └── stats.py       # 통계 계산 API
│   │   ├── services/          # 비즈니스 로직
│   │   │   └── stats_service.py
│   │   ├── schemas/           # Pydantic 스키마
│   │   │   └── stats.py
│   │   └── core/              # 설정, DB
│   └── requirements.txt
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # 메인 페이지
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── atoms/         # 기본 컴포넌트
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   └── StatCard.tsx
│   │   │   ├── molecules/     # 조합 컴포넌트
│   │   │   │   └── BirthdateInput.tsx
│   │   │   └── organisms/     # 복잡한 컴포넌트
│   │   │       └── StatsResult.tsx
│   │   ├── hooks/
│   │   │   └── useLifeStats.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── utils/
│   │   │   ├── imageDownload.ts
│   │   │   └── urlShare.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── constants/
│   │       └── index.ts
│   └── package.json
│
├── docker-compose.yml          # Docker 서비스 정의
├── Makefile                    # 개발 편의 명령어
├── CLAUDE.md                   # AI 컨텍스트
└── DEPLOYMENT.md               # 배포 가이드
```

## 문제 해결

### 포트가 이미 사용 중
```bash
# 포트 사용 확인
lsof -i :3050
lsof -i :8050

# 프로세스 종료
kill -9 <PID>

# 또는 docker-compose.yml에서 포트 변경 (예: 3050 → 3051)
```

### Docker 컨테이너가 시작되지 않음
```bash
# 로그 확인
make logs-backend
make logs-frontend

# 컨테이너 재빌드
docker-compose build --no-cache
docker-compose up
```

### Frontend에서 Backend 연결 안됨
- `.env` 파일에서 `NEXT_PUBLIC_API_URL`이 `http://localhost:8050`로 설정되어 있는지 확인
- Backend가 실행 중인지 확인: `curl http://localhost:8050/health`

### npm install 오류
```bash
# package-lock.json 삭제 후 재설치
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 다음 단계

현재 기본 기능이 모두 구현되어 있습니다. 추가로 구현할 수 있는 기능:

1. **별자리/띠 정보 추가**
2. **유명인과 나이 비교 기능**
3. **다크 모드**
4. **공유 카운터 (로컬 스토리지)**
5. **다국어 지원**
6. **소셜 미디어 공유 버튼**

즐거운 테스트 되세요! 🚀
