#!/bin/bash

# AllDataBox 멀티 서비스 중지 스크립트

echo "======================================"
echo "AllDataBox Services Shutdown"
echo "======================================"
echo ""

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 프로젝트 경로
BASE_DIR="/Users/jonghojung/Desktop/home_server"
YOURLIFE_DIR="$BASE_DIR/your_life_static"
LOTTERY_DIR="$BASE_DIR/generate_lottery_number"
INDEX_DIR="$BASE_DIR/index_static"

# 1. 통합 Nginx 중지
echo -e "${YELLOW}[1/4] 통합 Nginx 중지...${NC}"
cd "$YOURLIFE_DIR"
docker-compose -f docker-compose-nginx.yml down
echo -e "${GREEN}✓ Nginx 중지 완료${NC}"

# 2. YourLife 서비스 중지
echo ""
echo -e "${YELLOW}[2/4] YourLife 서비스 중지...${NC}"
cd "$YOURLIFE_DIR"
docker-compose down
echo -e "${GREEN}✓ YourLife 중지 완료${NC}"

# 3. Lottery 서비스 중지
echo ""
echo -e "${YELLOW}[3/4] Lottery 서비스 중지...${NC}"
cd "$LOTTERY_DIR"
docker-compose down
echo -e "${GREEN}✓ Lottery 중지 완료${NC}"

# 4. Index 서비스 중지
echo ""
echo -e "${YELLOW}[4/4] Index 서비스 중지...${NC}"
cd "$INDEX_DIR"
docker-compose down
echo -e "${GREEN}✓ Index 중지 완료${NC}"

echo ""
echo "======================================"
echo -e "${GREEN}모든 서비스 중지 완료!${NC}"
echo "======================================"

# 남은 컨테이너 확인
echo ""
echo "남은 컨테이너:"
docker ps -a
