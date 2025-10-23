#!/bin/bash

# AllDataBox 멀티 서비스 배포 스크립트

echo "======================================"
echo "AllDataBox Multi-Service Deployment"
echo "======================================"
echo ""

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 프로젝트 경로
BASE_DIR="/Users/jonghojung/Desktop/home_server"
YOURLIFE_DIR="$BASE_DIR/your_life_static"
LOTTERY_DIR="$BASE_DIR/generate_lottery_number"
INDEX_DIR="$BASE_DIR/index_static"

# 1. 기존 컨테이너 중지 (선택사항)
echo -e "${YELLOW}[1/7] 기존 컨테이너 확인...${NC}"
docker ps -a

read -p "기존 컨테이너를 모두 중지하시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${YELLOW}기존 컨테이너 중지 중...${NC}"
    docker stop $(docker ps -aq) 2>/dev/null || true
    docker rm $(docker ps -aq) 2>/dev/null || true
    echo -e "${GREEN}✓ 기존 컨테이너 정리 완료${NC}"
fi

# 1-1. 포트 사용 확인
echo ""
echo -e "${YELLOW}[1-1/7] 포트 사용 상태 확인...${NC}"
sudo lsof -iTCP -sTCP:LISTEN -n -P | grep -E ":(80|443|3000|3050|4050|5432|5433|5434|8000|8050|9050)" || echo "✓ 모든 포트 사용 가능"

# 2. Docker 이미지 빌드 (처음 배포 시)
echo ""
echo -e "${YELLOW}[2/7] Docker 이미지 빌드 확인...${NC}"
read -p "Docker 이미지를 새로 빌드하시겠습니까? (처음 배포 또는 코드 변경 시 y) (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${YELLOW}이미지 빌드 중... (시간이 걸릴 수 있습니다)${NC}"
    
    cd "$YOURLIFE_DIR"
    docker-compose build --no-cache
    
    cd "$LOTTERY_DIR"
    docker-compose build --no-cache
    
    cd "$INDEX_DIR"
    docker-compose build --no-cache
    
    echo -e "${GREEN}✓ 이미지 빌드 완료${NC}"
fi

# 3. YourLife 서비스 시작
echo ""
echo -e "${GREEN}[3/7] YourLife 서비스 시작...${NC}"
cd "$YOURLIFE_DIR"
docker-compose up -d
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ YourLife 서비스 시작 완료${NC}"
else
    echo -e "${RED}✗ YourLife 서비스 시작 실패${NC}"
    exit 1
fi

# 4. Lottery 서비스 시작
echo ""
echo -e "${GREEN}[4/7] Lottery 서비스 시작...${NC}"
cd "$LOTTERY_DIR"
docker-compose up -d
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Lottery 서비스 시작 완료${NC}"
else
    echo -e "${RED}✗ Lottery 서비스 시작 실패${NC}"
    exit 1
fi

# 5. Index 서비스 시작
echo ""
echo -e "${GREEN}[5/7] Index 서비스 시작...${NC}"
cd "$INDEX_DIR"
docker-compose up -d
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Index 서비스 시작 완료${NC}"
else
    echo -e "${RED}✗ Index 서비스 시작 실패${NC}"
    exit 1
fi

# 6. 통합 Nginx 시작
echo ""
echo -e "${GREEN}[6/7] 통합 Nginx 시작...${NC}"
cd "$YOURLIFE_DIR"

# 기존 nginx 컨테이너 중지
docker stop alldatabox_nginx 2>/dev/null || true
docker rm alldatabox_nginx 2>/dev/null || true

docker-compose -f docker-compose-nginx.yml up -d
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 통합 Nginx 시작 완료${NC}"
else
    echo -e "${RED}✗ 통합 Nginx 시작 실패${NC}"
    exit 1
fi

# 7. 서비스 상태 확인
echo ""
echo -e "${GREEN}[7/7] 서비스 상태 확인...${NC}"
sleep 3
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "======================================"
echo -e "${GREEN}배포 완료!${NC}"
echo "======================================"
echo ""
echo "서비스 접속 주소:"
echo "  - YourLife: http://yourlife.alldatabox.com"
echo "  - Lottery:  http://lottery.alldatabox.com"
echo "  - Index:    http://index.alldatabox.com"
echo "  - Main:     http://alldatabox.com"
echo ""
echo "주의: DNS 설정이 완료되어야 외부에서 접속 가능합니다."
echo "로컬 테스트: /etc/hosts 파일에 다음 추가"
echo "  172.30.1.85 yourlife.alldatabox.com"
echo "  172.30.1.85 lottery.alldatabox.com"
echo "  172.30.1.85 index.alldatabox.com"
echo "  172.30.1.85 alldatabox.com"
