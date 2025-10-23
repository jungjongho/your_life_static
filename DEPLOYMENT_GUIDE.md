# 🚀 AllDataBox 멀티 서비스 배포 가이드

## 📌 배포 개요

3개의 독립적인 서비스를 서브도메인으로 배포:
- **yourlife.alldatabox.com**: 인생 통계 서비스
- **lottery.alldatabox.com**: 로또 번호 생성기
- **index.alldatabox.com**: 인덱스 서비스

## ✅ 사전 준비 완료 항목

- [x] Docker 설치 (v28.4.0)
- [x] 포트 충돌 해결 (DB: 5432, 5433, 5434)
- [x] .env 파일 생성

## 🎯 배포 단계

### 1단계: DNS 설정 (필수)

**DNS_SETUP_GUIDE.md** 파일을 참고하여 DNS 레코드 추가

### 2단계: 로컬 테스트 (선택)

DNS 반영 전 로컬 테스트:
```bash
sudo nano /etc/hosts

# 다음 추가:
172.30.1.85 yourlife.alldatabox.com
172.30.1.85 lottery.alldatabox.com
172.30.1.85 index.alldatabox.com
172.30.1.85 alldatabox.com
```

### 3단계: 배포 스크립트 실행

```bash
cd /Users/jonghojung/Desktop/home_server/your_life_static

# 실행 권한 부여
chmod +x deploy-all.sh
chmod +x stop-all.sh

# 배포 시작
./deploy-all.sh
```

### 4단계: 서비스 확인

```bash
# 실행 중인 컨테이너 확인
docker ps

# 로그 확인
docker logs your_life_backend
docker logs lottery-backend
docker logs index_static_backend
```

## 🔧 포트 구성

| 서비스 | Frontend | Backend | Database |
|--------|----------|---------|----------|
| YourLife | 3050 | 8050 | 5432 |
| Lottery | 4050 | 9050 | 5433 |
| Index | 5000 | 7000 | 5434 |

## 🌐 접속 주소

DNS 반영 후:
- YourLife: https://yourlife.alldatabox.com
- Lottery: https://lottery.alldatabox.com
- Index: https://index.alldatabox.com
- Main: https://alldatabox.com

로컬 접속 (개발용):
- YourLife: http://localhost:3050
- Lottery: http://localhost:4050
- Index: http://localhost:5000

## 🛠️ 트러블슈팅

### 포트 충돌 발생 시
```bash
# 사용 중인 포트 확인
sudo lsof -iTCP -sTCP:LISTEN -n -P | grep -E ":(3050|4050|5000|5432|5433|5434|7000|8050|9050)"

# 특정 포트 사용 중인 프로세스 종료
kill -9 <PID>
```

### 컨테이너가 시작되지 않을 때
```bash
# 로그 확인
docker logs <container_name>

# 컨테이너 재시작
docker restart <container_name>

# 전체 재배포
./stop-all.sh
./deploy-all.sh
```

### DNS가 반영되지 않을 때
```bash
# DNS 캐시 삭제 (macOS)
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# DNS 확인
nslookup yourlife.alldatabox.com
```

## 📊 모니터링

### 리소스 사용량 확인
```bash
docker stats
```

### 디스크 사용량
```bash
docker system df
```

### 로그 실시간 확인
```bash
docker logs -f <container_name>
```

## 🔄 업데이트 방법

```bash
# 1. 서비스 중지
./stop-all.sh

# 2. 코드 업데이트 (git pull 등)
cd /Users/jonghojung/Desktop/home_server/your_life_static
git pull

# 3. 이미지 재빌드
docker-compose build --no-cache

# 4. 재배포
./deploy-all.sh
```

## 📝 주의사항

1. **데이터 백업**: PostgreSQL 데이터는 Docker volume에 저장되므로 정기적으로 백업하세요
   ```bash
   docker exec your_life_db pg_dump -U postgres your_life_stats > backup.sql
   ```

2. **방화벽**: macOS 방화벽에서 Docker 허용 확인

3. **재부팅**: 맥미니 재부팅 시 Docker Desktop이 자동 시작되는지 확인

4. **리소스**: 3개 서비스 동시 실행 시 메모리 사용량 모니터링

## 📞 문제 발생 시

1. 로그 확인: `docker logs <container_name>`
2. 네트워크 확인: `docker network ls`
3. 컨테이너 상태: `docker ps -a`
4. 재시작: `./stop-all.sh && ./deploy-all.sh`

---

**배포 성공을 기원합니다! 🎉**
