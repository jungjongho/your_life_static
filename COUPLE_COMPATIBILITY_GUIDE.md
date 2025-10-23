# 커플 사주 궁합 기능 가이드

## 개요
yourlife 프로젝트에 커플 사주 궁합 분석 기능이 추가되었습니다.

## 기능 설명
- 두 사람의 생년월일시를 입력하여 AI 기반 사주 궁합 분석
- GPT-4o-mini 모델 사용
- 한국어/영어 지원
- 페이지 경로: `/[lang]/couple`

## 설정 방법

### 1. OpenAI API 키 설정
`yourlife/.env` 파일을 열어 다음 내용을 추가하세요:

```bash
OPENAI_API_KEY=sk-your-actual-openai-api-key
```

OpenAI API 키가 없다면:
1. https://platform.openai.com 방문
2. 계정 생성/로그인
3. API Keys 메뉴에서 새 키 생성

### 2. Docker 컨테이너 재빌드

```bash
cd ~/Desktop/home_server/yourlife

# 기존 컨테이너 중지
docker-compose down

# 의존성 포함하여 재빌드
docker-compose up --build -d

# 로그 확인
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 3. 접속 확인

- 로컬: http://localhost:3050/ko/couple 또는 http://localhost:3050/en/couple
- 프로덕션: https://yourlife.alldatabox.com/ko/couple

## API 엔드포인트

### POST /api/v1/compatibility/analyze
사주 궁합 분석 요청

**Request Body:**
```json
{
  "person1": {
    "birth_year": 1990,
    "birth_month": 5,
    "birth_day": 15,
    "birth_hour": 14,
    "gender": "male",
    "name": "철수"
  },
  "person2": {
    "birth_year": 1992,
    "birth_month": 8,
    "birth_day": 20,
    "birth_hour": 10,
    "gender": "female",
    "name": "영희"
  },
  "language": "ko"
}
```

**Response:**
```json
{
  "score": 85,
  "summary": "두 분은 서로를 보완하는 훌륭한 궁합입니다.",
  "strengths": ["강점 1", "강점 2", "강점 3"],
  "cautions": ["주의점 1", "주의점 2", "주의점 3"],
  "elements_analysis": "오행 분석...",
  "zodiac_compatibility": "띠 궁합...",
  "advice": "조언..."
}
```

### GET /api/v1/compatibility/health
서비스 상태 확인

## 파일 구조

```
yourlife/
├── backend/
│   ├── requirements.txt              # openai 추가
│   ├── app/
│   │   ├── core/
│   │   │   └── config.py             # OPENAI_API_KEY 추가
│   │   ├── schemas/
│   │   │   └── compatibility.py      # 새 파일
│   │   ├── services/
│   │   │   └── compatibility_service.py  # 새 파일
│   │   ├── routers/
│   │   │   └── compatibility.py      # 새 파일
│   │   └── main.py                   # 라우터 등록
│
└── frontend/
    ├── src/
    │   ├── types/
    │   │   └── index.ts              # 타입 추가
    │   ├── services/
    │   │   └── compatibility.ts      # 새 파일
    │   ├── dictionaries/
    │   │   ├── ko.json              # 번역 추가
    │   │   └── en.json              # 번역 추가
    │   └── app/
    │       └── [lang]/
    │           └── couple/
    │               └── page.tsx      # 새 페이지
```

## 테스트 방법

### 1. Backend API 테스트
```bash
# 헬스 체크
curl http://localhost:8050/api/v1/compatibility/health

# 궁합 분석 테스트
curl -X POST http://localhost:8050/api/v1/compatibility/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "person1": {
      "birth_year": 1990,
      "birth_month": 5,
      "birth_day": 15
    },
    "person2": {
      "birth_year": 1992,
      "birth_month": 8,
      "birth_day": 20
    },
    "language": "ko"
  }'
```

### 2. Frontend 테스트
1. 브라우저에서 http://localhost:3050/ko/couple 접속
2. 두 사람의 생년월일 입력
3. "궁합 보기" 버튼 클릭
4. 결과 확인 (3-5초 소요)

## 비용 예상

GPT-4o-mini 모델 기준:
- Input: $0.150 / 1M tokens
- Output: $0.600 / 1M tokens

평균 요청당:
- Input: ~500 tokens
- Output: ~1000 tokens
- 비용: 약 $0.001 (약 1.3원)

월 1,000건 사용 시: 약 $1 (약 1,300원)

## 문제 해결

### "OpenAI API key is not configured" 오류
- .env 파일에 OPENAI_API_KEY가 올바르게 설정되었는지 확인
- Docker 컨테이너 재시작

### "Failed to analyze compatibility" 오류
- Backend 로그 확인: `docker-compose logs backend`
- OpenAI API 키가 유효한지 확인
- API 사용량 제한 확인

### Frontend에서 Backend 연결 실패
- NEXT_PUBLIC_API_URL이 올바른지 확인
- Backend가 실행 중인지 확인: `docker-compose ps`

## 향후 개선 사항
- [ ] 결과 이미지 다운로드 기능
- [ ] URL 공유 기능
- [ ] 궁합 분석 히스토리 (DB 저장)
- [ ] 더 다양한 분석 항목 추가
- [ ] 캐싱으로 동일 요청 최적화

## 참고 자료
- OpenAI API 문서: https://platform.openai.com/docs
- GPT-4o-mini 모델: https://platform.openai.com/docs/models/gpt-4o-mini
