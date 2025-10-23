# 배포 가이드 (Deployment Guide)

맥미니 홈서버에 Docker를 활용한 배포 가이드입니다.

## 사전 요구사항

- Docker 설치됨
- Docker Compose 설치됨
- Git 설치됨
- 포트 3050, 8050, 5432가 사용 가능해야 함 (변경 가능)

## 초기 설정

### 1. 저장소 클론

```bash
git clone <repository-url>
cd your_life_static
```

### 2. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집 (중요!)
nano .env
```

**반드시 변경해야 할 항목:**
```env
# 강력한 비밀번호로 변경
DB_PASSWORD=your_secure_password_here

# 운영환경 시크릿 키 생성 (Python으로 생성 권장)
# python -c "import secrets; print(secrets.token_urlsafe(32))"
SECRET_KEY=your_secret_key_here

# 운영 환경 설정
ENVIRONMENT=production

# 실제 도메인으로 변경 (도메인이 있는 경우)
NEXT_PUBLIC_API_URL=http://your-domain.com:8050
```

### 3. Frontend 의존성 설치 (선택사항)

개발 모드에서 로컬 실행 시:
```bash
cd frontend
npm install
cd ..
```

## 배포 방법

### 개발 모드로 실행

```bash
# Makefile 사용
make dev

# 또는 docker-compose 직접 사용
docker-compose up
```

서비스 접근:
- Frontend: http://localhost:3050
- Backend API: http://localhost:8050
- API 문서: http://localhost:8050/docs

**참고**: 포트는 `docker-compose.yml`에서 변경 가능합니다.

### 프로덕션 모드로 실행

```bash
# 백그라운드에서 실행
make up

# 또는
docker-compose up -d
```

## 유용한 명령어

### 서비스 관리

```bash
# 모든 서비스 상태 확인
make ps

# 로그 확인
make logs                # 모든 서비스
make logs-backend        # 백엔드만
make logs-frontend       # 프론트엔드만
make logs-db            # 데이터베이스만

# 서비스 재시작
make restart            # 모든 서비스
make restart-backend    # 백엔드만
make restart-frontend   # 프론트엔드만

# 서비스 중지
make down

# 서비스 완전 제거 (볼륨 포함 - 주의: DB 데이터 삭제됨)
make clean
```

### 데이터베이스 관리

```bash
# DB 백업
make db-backup

# DB 복원
make db-restore FILE=backup_20240112_120000.sql

# DB 직접 접속
docker-compose exec db psql -U postgres -d your_life_stats
```

### 빌드 및 업데이트

```bash
# 코드 변경 후 재빌드
make build

# 재빌드 후 실행
docker-compose up --build
```

### 헬스 체크

```bash
# 서비스 헬스 체크
make health

# 또는 수동으로
curl http://localhost:8050/health
curl http://localhost:3050
```

## 맥미니 특화 설정

### 자동 시작 설정

맥미니 재부팅 시 자동으로 서비스 시작:

1. `~/Library/LaunchAgents/com.yourlife.docker.plist` 생성:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.yourlife.docker</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/docker-compose</string>
        <string>-f</string>
        <string>/Users/jonghojung/Desktop/home_server/your_life_static/docker-compose.yml</string>
        <string>up</string>
        <string>-d</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>WorkingDirectory</key>
    <string>/Users/jonghojung/Desktop/home_server/your_life_static</string>
</dict>
</plist>
```

2. Launch Agent 로드:
```bash
launchctl load ~/Library/LaunchAgents/com.yourlife.docker.plist
```

### 로컬 네트워크 접근

같은 네트워크의 다른 기기에서 접근:
```
http://<맥미니-IP>:3050
```

맥미니 IP 확인:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

## 문제 해결

### 포트 충돌

```bash
# 포트 사용 확인
lsof -i :3050
lsof -i :8050
lsof -i :5432

# docker-compose.yml에서 포트 변경
# 예: 다른 프로젝트와 충돌 시
# ports:
#   - "3051:3050"  # 호스트:컨테이너
#   - "8051:8050"  # 호스트:컨테이너
```

### DB 연결 실패

```bash
# DB 컨테이너 로그 확인
make logs-db

# DB 헬스 체크 대기
docker-compose up db
# 다른 터미널에서
docker-compose up backend frontend
```

### 디스크 공간 부족

```bash
# 사용하지 않는 Docker 이미지/컨테이너 정리
docker system prune -a

# 특정 이미지 삭제
docker images
docker rmi <image-id>
```

### 백엔드 실행 안됨

```bash
# 로그 확인
make logs-backend

# 의존성 문제인 경우
docker-compose build --no-cache backend
docker-compose up backend
```

## 모니터링

### 리소스 사용량 확인

```bash
# 실시간 모니터링
docker stats

# 특정 컨테이너만
docker stats your_life_backend your_life_frontend your_life_db
```

### 로그 관리

```bash
# 로그 크기 제한 (docker-compose.yml에 추가)
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## 업데이트

```bash
# 코드 업데이트
git pull origin main

# 환경변수 변경사항 확인
diff .env .env.example

# 재빌드 및 재시작
make build
make restart
```

## 백업 전략

### 정기 백업 (crontab)

```bash
# crontab 편집
crontab -e

# 매일 새벽 3시에 DB 백업
0 3 * * * cd /Users/jonghojung/Desktop/home_server/your_life_static && make db-backup
```

### 전체 데이터 백업

```bash
# DB 데이터 볼륨 백업
docker run --rm -v your_life_static_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/db_backup.tar.gz /data
```

## 보안 권장사항

1. `.env` 파일 권한 제한:
   ```bash
   chmod 600 .env
   ```

2. 방화벽 설정 (필요한 포트만 열기)

3. 정기적인 보안 업데이트:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

4. SSL/TLS 인증서 설정 (Cloudflare Tunnel 권장)

## 성능 최적화

### Docker 리소스 제한

`docker-compose.yml`에 추가:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
```

### PostgreSQL 튜닝

맥미니 사양에 맞게 설정 조정 필요 시 `docker-compose.yml`에서 환경변수 추가 가능.
