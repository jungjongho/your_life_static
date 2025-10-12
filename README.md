# 프로젝트 구조 문서

> Claude Code가 프로젝트 구조와 아키텍처를 이해하기 위한 참조 문서

---

## 프로젝트 개요

프로젝트 개요
프로젝트명: 내 인생 통계 (My Life Stats)
설명: 사용자의 생년월일을 입력받아 지금까지 살아온 시간을 다양한 재미있는 통계로 보여주는 인터랙티브 웹 애플리케이션입니다. 결과를 이미지로 다운로드하거나 공유할 수 있어 SNS 바이럴에 최적화되어 있습니다.
핵심 가치:

로그인 불필요 (완전한 익명성)
개인화된 결과로 공유 욕구 자극
빠른 로딩과 직관적인 UX


##필요 기능
1. 생년월일 입력 페이지

연도, 월, 일 선택 드롭다운
입력 validation (미래 날짜 방지, 1900년 이후만 허용)
"내 통계 보기" 버튼

2. 통계 결과 페이지
기본 통계:

살아온 총 일수
살아온 총 시간
살아온 총 분
살아온 총 초
심장 박동 수 (평균 72회/분 기준)
숨 쉰 횟수 (평균 15회/분 기준)
잠잔 시간 (하루 8시간 기준)
먹은 밥그릇 수 (하루 3끼 기준)
다음 생일까지 D-day
다음 1만일까지 남은 일수 (ex: 1만일, 2만일)

시각화:

각 통계를 카드 형태로 디스플레이
숫자 카운팅 애니메이션 효과
그라데이션 배경
이모지 아이콘 활용

3. 공유 기능

"이미지로 저장" 버튼 (html2canvas 사용)
"다시 계산하기" 버튼
URL 복사 기능 (쿼리 파라미터로 생년월일 전달)

4. 추가 기능 (선택)

유명인과 비교 ("당신은 아인슈타인이 상대성이론을 발표한 나이입니다")
별자리, 띠 정보
통계 공유 카운터 (로컬 스토리지)


## 프로젝트 스팩
- **타입**: 풀스택 웹 애플리케이션
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.10+, SQLAlchemy
- **Database**: PostgreSQL
- **언어**: 한글

### 배포 방식
- docker를 활용해서 맥미니(홈서버) 활용
- 해당 서버에 여러가지 프로젝트들이 동시에떠있어서 각 프로젝트마다 유동적으로포트를 변경시킬수 있어야함

## 디렉토리 구조

```
project/
├── ARCHITECTURE.md              # 시스템 설계, ERD, API 명세
│
├── docs/                        # 기능별 설계 문서
│   ├── BACKEND_SERVICE_{기능}.md
│   ├── BACKEND_REPOSITORY_{기능}.md
│   ├── BACKEND_ROUTER_{기능}.md
│   ├── FRONTEND_ATOM_{기능}.md
│   ├── FRONTEND_MOLECULE_{기능}.md
│   ├── FRONTEND_ORGANISM_{기능}.md
│   └── FRONTEND_HOOK_{기능}.md
│
├── frontend/src/
│   ├── app/                     # Next.js 라우팅 (파일 기반)
│   ├── components/              # UI 컴포넌트 (Atomic Design)
│   │   ├── atoms/               # 10-30줄
│   │   ├── molecules/           # 30-80줄
│   │   ├── organisms/           # 80-150줄
│   │   └── templates/           # 레이아웃
│   ├── hooks/                   # 비즈니스 로직 (50-150줄)
│   ├── types/                   # TypeScript 타입
│   ├── services/                # API 호출
│   ├── utils/                   # 헬퍼 함수
│   └── constants/               # 상수
│
└── backend/app/
    ├── main.py                  # FastAPI 진입점
    ├── routers/                 # HTTP 계층
    ├── services/                # 비즈니스 로직
    ├── repositories/            # DB 접근
    ├── models/                  # SQLAlchemy 모델
    ├── schemas/                 # Pydantic 스키마
    └── core/                    # 설정, DB, 보안
```

---

## 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| Python 변수/함수 | snake_case | `user_name`, `get_user()` |
| Python 클래스 | PascalCase | `UserService` |
| Python 파일 | snake_case.py | `user_service.py` |
| TypeScript 변수/함수 | camelCase | `userName`, `getUser()` |
| TypeScript 컴포넌트 | PascalCase | `UserCard` |
| 컴포넌트 파일 | PascalCase.tsx | `UserCard.tsx` |
| 훅 파일 | camelCase.ts | `useAuth.ts` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY` |
| DB 테이블 | snake_case 복수형 | `users` |
| DB 컬럼 | snake_case | `created_at` |
| API 엔드포인트 | kebab-case | `/user-profiles` |

---

## 계층별 책임

### Frontend

| 계층 | 크기 | 역할 | 허용 | 금지 |
|------|------|------|------|------|
| **atoms** | 10-30줄 | 단일 UI 요소 | Props | API 호출, 복잡한 로직 |
| **molecules** | 30-80줄 | atoms 조합 | Props, 간단한 로직 | API 호출, 전역 상태 |
| **organisms** | 80-150줄 | 복잡한 UI 섹션 | Props, hooks | 직접 API 호출 |
| **hooks** | 50-150줄 | 비즈니스 로직, 상태 관리 | services 호출 | 직접 fetch/axios |
| **services** | - | API 호출 | fetch/axios | 비즈니스 로직 |

### Backend

| 계층 | 역할 | 허용 | 금지 |
|------|------|------|------|
| **Router** | HTTP 요청/응답 | Pydantic 검증, Service 호출 | 비즈니스 로직, DB 접근 |
| **Service** | 비즈니스 로직 | Repository 조합, 트랜잭션 | HTTP 코드, 직접 SQL |
| **Repository** | DB 접근 | SQLAlchemy 쿼리 | 비즈니스 로직 |

---

## 의존성 관계

```yaml
Frontend:
  organisms → hooks → services
  molecules → atoms
  hooks → services

Backend:
  router → service → repository
```

---

## 코드 생성 순서

**Backend 작성 순서**:
1. models (DB 스키마)
2. schemas (Pydantic DTO)
3. repositories (CRUD)
4. services (비즈니스 로직)
5. routers (API 엔드포인트)

**Frontend 작성 순서**:
1. types (인터페이스)
2. services (API 호출)
3. hooks (비즈니스 로직)
4. atoms → molecules → organisms

---

## 타입 힌팅

모든 함수에 타입 힌팅 필수.

### Python
```python
from typing import Optional, List

def get_user(user_id: int) -> Optional[User]:
    pass

async def create_users(users: List[User]) -> List[User]:
    pass
```

### TypeScript
```typescript
interface User {
  id: number;
  name: string;
}

function getUser(id: number): User | null {
  return null;
}
```

---

## 코드 작성 규칙

### 하드코딩

**허용**: 0, 1, -1, true, false  
**금지**: 반복되는 숫자, URL, 에러 메시지

```python
# 금지
if len(users) > 100:
    pass

# 허용
MAX_USERS = 100
if len(users) > MAX_USERS:
    pass
```

### 함수 크기

- 일반적으로 50줄 이하
- 초과 시 작은 함수로 분리 고려

### 계층 호출

```
Frontend: 컴포넌트 → hooks → services
Backend: router → service → repository
```

중간 계층 건너뛰기 금지.

---

## docs/ 파일 형식

**파일명**: `{영역}_{계층}_{기능}.md`

**내용**:
```markdown
# 기능명

## 데이터 플로우
입력 → 처리 → 출력

## 입력
- param: 타입 - 설명

## 출력
- return: 타입 - 설명

## 의존성
- 사용하는 모듈

## 관련 파일
- 경로
```

---

## 예시 코드

### Backend Service
```python
class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo
    
    async def get_user(self, user_id: int) -> Optional[User]:
        return await self.user_repo.get_by_id(user_id)
```

### Backend Router
```python
@router.get("/users/{user_id}")
async def get_user(
    user_id: int,
    service: UserService = Depends()
) -> UserResponse:
    user = await service.get_user(user_id)
    if not user:
        raise HTTPException(404)
    return UserResponse.from_orm(user)
```

### Frontend Hook
```typescript
export const useUser = (id: number) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    userService.getUser(id).then(setUser);
  }, [id]);
  
  return { user };
};
```

### Frontend Component
```typescript
interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold">{user.name}</h3>
    </div>
  );
};
```