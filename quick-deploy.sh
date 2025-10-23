#!/bin/bash

# 빠른 배포 스크립트 (문제 해결 후)

echo "======================================"
echo "AllDataBox 빠른 배포"
echo "======================================"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

BASE_DIR="/Users/jonghojung/Desktop/home_server"
YOURLIFE_DIR="$BASE_DIR/your_life_static"
LOTTERY_DIR="$BASE_DIR/generate_lottery_number"
INDEX_DIR="$BASE_DIR/index_static"

# 1. YourLife 서비스
echo -e "${GREEN}[1/4] YourLife 서비스 배포...${NC}"
cd "$YOURLIFE_DIR"
docker-compose down 2>/dev/null
docker-compose up -d
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ YourLife 완료${NC}"
else
    echo -e "${RED}✗ YourLife 실패${NC}"
    docker-compose logs
fi

# 2. Lottery 서비스
echo ""
echo -e "${GREEN}[2/4] Lottery 서비스 배포...${NC}"
cd "$LOTTERY_DIR"
docker-compose down 2>/dev/null
docker-compose up -d
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Lottery 완료${NC}"
else
    echo -e "${RED}✗ Lottery 실패${NC}"
    docker-compose logs backend
    docker-compose logs frontend
fi

# 3. Index 서비스
echo ""
echo -e "${GREEN}[3/4] Index 서비스 배포...${NC}"
cd "$INDEX_DIR"
docker-compose down 2>/dev/null
docker-compose up -d
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Index 완료${NC}"
else
    echo -e "${RED}✗ Index 실패${NC}"
    docker-compose logs
fi

# 4. 통합 Nginx
echo ""
echo -e "${GREEN}[4/4] 통합 Nginx 배포...${NC}"
cd "$YOURLIFE_DIR"
docker stop alldatabox_nginx 2>/dev/null
docker rm alldatabox_nginx 2>/dev/null
docker-compose -f docker-compose-nginx.yml up -d
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Nginx 완료${NC}"
else
    echo -e "${RED}✗ Nginx 실패${NC}"
    docker logs alldatabox_nginx
fi

# 결과
echo ""
echo "======================================"
echo -e "${GREEN}배포 완료!${NC}"
echo "======================================"
sleep 2
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "로컬 테스트 주소:"
echo "  http://172.30.1.85:3050  (YourLife)"
echo "  http://172.30.1.85:4050  (Lottery)"
echo "  http://172.30.1.85:3000  (Index)"
echo ""
echo "서브도메인 주소 (/etc/hosts 설정 후):"
echo "  http://yourlife.alldatabox.com"
echo "  http://lottery.alldatabox.com"
echo "  http://index.alldatabox.com"
