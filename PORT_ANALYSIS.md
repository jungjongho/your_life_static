# 포트 사용 계획

## 📊 전체 포트 할당표

### YourLife (your_life_static)
| 컴포넌트 | 호스트 포트 | 컨테이너 포트 | 용도 |
|---------|------------|--------------|------|
| Frontend | 3050 | 3000 | Next.js |
| Backend | 8050 | 8000 | FastAPI |
| Database | 5432 | 5432 | PostgreSQL |
| Nginx | 8080 | 8080 | Reverse Proxy (기존) |

### Lottery (generate_lottery_number)
| 컴포넌트 | 호스트 포트 | 컨테이너 포트 | 용도 |
|---------|------------|--------------|------|
| Frontend | 4050 | 4050 | Next.js |
| Backend | 9050 | 9050 | FastAPI |
| Database | 5433 | 5432 | PostgreSQL |

### Index (index_static)
| 컴포넌트 | 호스트 포트 | 컨테이너 포트 | 용도 |
|---------|------------|--------------|------|
| Frontend | 3000 | 3000 | Next.js |
| Backend | 8000 | 8000 | FastAPI |
| Database | 5434 | 5432 | PostgreSQL |

### 통합 Nginx (alldatabox_nginx)
| 컴포넌트 | 호스트 포트 | 컨테이너 포트 | 용도 |
|---------|------------|--------------|------|
| HTTP | 80 | 80 | HTTP |
| HTTPS | 443 | 443 | HTTPS |

---

## ⚠️ 포트 충돌 분석

### 충돌 발견!

1. **포트 3000 충돌**
   - Index Frontend: 3000
   - YourLife Frontend 컨테이너 내부: 3000 (호스트는 3050)
   - ❌ **충돌**: Index가 호스트 3000을 사용 중

2. **포트 8000 충돌**
   - Index Backend: 8000
   - YourLife Backend 컨테이너 내부: 8000 (호스트는 8050)
   - ❌ **충돌**: Index가 호스트 8000을 사용 중

3. **포트 8080 충돌 가능성**
   - YourLife Nginx: 8080
   - 통합 Nginx를 사용하면 필요 없음

---

## ✅ 해결 방안

### 옵션 1: Index 포트 변경 (추천)
Index의 포트를 변경하여 충돌 해결:
- Frontend: 3000 → 5000
- Backend: 8000 → 7000

### 옵션 2: 모든 서비스 내부 통신만 사용
통합 Nginx를 사용하므로 개별 서비스의 호스트 포트 노출 불필요:
- 각 서비스는 Docker 네트워크 내부에서만 통신
- 외부는 80/443 포트로만 접근

---

## 🎯 최종 권장 포트 구성

### 변경 필요한 항목

**Index Static:**
```yaml
# docker-compose.yml
frontend:
  ports:
    - "5000:3000"  # 3000 → 5000

backend:
  ports:
    - "7000:8000"  # 8000 → 7000
```

**YourLife (기존 Nginx 제거):**
```yaml
# docker-compose.yml에서 nginx 서비스 제거 또는 주석 처리
```

---

## 📋 수정 후 최종 포트표

| 서비스 | Frontend | Backend | Database | 비고 |
|--------|----------|---------|----------|------|
| YourLife | 3050 | 8050 | 5432 | 변경 없음 |
| Lottery | 4050 | 9050 | 5433 | 변경 없음 |
| Index | **5000** | **7000** | 5434 | **변경됨** |
| Nginx | 80, 443 | - | - | 통합 |

---

## 🔍 현재 사용 중인 포트 확인 명령어

```bash
# 필요한 모든 포트 확인
sudo lsof -iTCP -sTCP:LISTEN -n -P | grep -E ":(80|443|3000|3050|4050|5000|5432|5433|5434|7000|8000|8050|9050)"
```
