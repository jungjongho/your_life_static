#!/bin/bash

# 포트 충돌 확인 및 최종 배포 스크립트

echo "======================================"
echo "포트 충돌 확인 및 배포"
echo "======================================"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# 필요한 포트 목록
declare -A PORTS=(
    [80]="통합 Nginx HTTP"
    [443]="통합 Nginx HTTPS"
    [3050]="YourLife Frontend"
    [4050]="Lottery Frontend"
    [5000]="Index Frontend"
    [5432]="YourLife Database"
    [5433]="Lottery Database"
    [5434]="Index Database"
    [7000]="Index Backend"
    [8050]="YourLife Backend"
    [9050]="Lottery Backend"
)

echo ""
echo -e "${BLUE}[1/3] 포트 사용 상태 확인${NC}"
echo "================================"

CONFLICTS=0
for PORT in "${!PORTS[@]}"; do
    PROCESS=$(lsof -ti:$PORT 2>/dev/null)
    if [ ! -z "$PROCESS" ]; then
        PROC_NAME=$(ps -p $PROCESS -o comm= 2>/dev/null)
        echo -e "${YELLOW}⚠ 포트 $PORT 사용 중${NC} - ${PORTS[$PORT]} (PID: $PROCESS, $PROC_NAME)"
        CONFLICTS=$((CONFLICTS + 1))
    else
        echo -e "${GREEN}✓ 포트 $PORT 사용 가능${NC} - ${PORTS[$PORT]}"
    fi
done | sort -t':' -k2 -n

echo ""
if [ $CONFLICTS -gt 0 ]; then
    echo -e "${YELLOW}경고: $CONFLICTS 개의 포트가 이미 사용 중입니다.${NC}"
    read -p "사용 중인 포트를 모두 정리하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}포트 정리 중...${NC}"
        for PORT in "${!PORTS[@]}"; do
            PROCESS=$(lsof -ti:$PORT 2>/dev/null)
            if [ ! -z "$PROCESS" ]; then
                kill -9 $PROCESS 2>/dev/null && echo "  ✓ 포트 $PORT 정리 완료"
            fi
        done
    fi
else
    echo -e "${GREEN}✓ 모든 포트 사용 가능합니다!${NC}"
fi

echo ""
echo -e "${BLUE}[2/3] 최종 포트 구성 확인${NC}"
echo "================================"
cat << 'EOF'
┌─────────────┬──────────┬─────────┬──────────┐
│   서비스    │ Frontend │ Backend │ Database │
├─────────────┼──────────┼─────────┼──────────┤
│ YourLife    │   3050   │  8050   │   5432   │
│ Lottery     │   4050   │  9050   │   5433   │
│ Index       │   5000   │  7000   │   5434   │
│ Nginx       │ 80, 443  │    -    │    -     │
└─────────────┴──────────┴─────────┴──────────┘
EOF

echo ""
read -p "위 포트 구성으로 배포를 진행하시겠습니까? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "배포가 취소되었습니다."
    exit 0
fi

BASE_DIR="/Users/jonghojung/Desktop/home_server"
YOURLIFE_DIR="$BASE_DIR/your_life_static"
LOTTERY_DIR="$BASE_DIR/generate_lottery_number"
INDEX_DIR="$BASE_DIR/index_static"

echo ""
echo -e "${BLUE}[3/3] 서비스 배포 시작${NC}"
echo "================================"

# 기존 컨테이너 정리
echo -e "${YELLOW}기존 컨테이너 중지...${NC}"
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

# 1. YourLife
echo ""
echo -e "${GREEN}[1/4] YourLife 배포...${NC}"
cd "$YOURLIFE_DIR"
docker-compose up -d db backend frontend
[ $? -eq 0 ] && echo -e "${GREEN}  ✓ YourLife 완료${NC}" || echo -e "${RED}  ✗ YourLife 실패${NC}"

# 2. Lottery
echo ""
echo -e "${GREEN}[2/4] Lottery 배포...${NC}"
cd "$LOTTERY_DIR"
docker-compose build --no-cache frontend
docker-compose up -d
[ $? -eq 0 ] && echo -e "${GREEN}  ✓ Lottery 완료${NC}" || echo -e "${RED}  ✗ Lottery 실패${NC}"

# 3. Index
echo ""
echo -e "${GREEN}[3/4] Index 배포...${NC}"
cd "$INDEX_DIR"
docker-compose up -d
[ $? -eq 0 ] && echo -e "${GREEN}  ✓ Index 완료${NC}" || echo -e "${RED}  ✗ Index 실패${NC}"

# 4. 통합 Nginx
echo ""
echo -e "${GREEN}[4/4] 통합 Nginx 배포...${NC}"
cd "$YOURLIFE_DIR"
docker-compose -f docker-compose-nginx.yml up -d
[ $? -eq 0 ] && echo -e "${GREEN}  ✓ Nginx 완료${NC}" || echo -e "${RED}  ✗ Nginx 실패${NC}"

echo ""
echo "======================================"
echo -e "${GREEN}배포 완료!${NC}"
echo "======================================"

sleep 2
echo ""
echo "실행 중인 컨테이너:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo -e "${BLUE}접속 주소:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "포트로 직접 접속:"
echo "  http://172.30.1.85:3050  → YourLife"
echo "  http://172.30.1.85:4050  → Lottery"
echo "  http://172.30.1.85:5000  → Index"
echo ""
echo "서브도메인 접속 (/etc/hosts 설정 필요):"
echo "  http://yourlife.alldatabox.com"
echo "  http://lottery.alldatabox.com"
echo "  http://index.alldatabox.com"
echo ""
echo "API 문서:"
echo "  http://172.30.1.85:8050/docs  → YourLife API"
echo "  http://172.30.1.85:9050/docs  → Lottery API"
echo "  http://172.30.1.85:7000/docs  → Index API"
