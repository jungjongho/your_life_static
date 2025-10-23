#!/bin/bash

# 포트 사용 확인 및 정리 스크립트

echo "======================================"
echo "포트 사용 상태 확인"
echo "======================================"

# 필요한 포트 목록
PORTS=(80 443 3000 3050 4050 5432 5433 5434 8000 8050 9050)

echo ""
echo "사용 중인 포트 확인..."
for PORT in "${PORTS[@]}"; do
    PROCESS=$(lsof -ti:$PORT 2>/dev/null)
    if [ ! -z "$PROCESS" ]; then
        echo "❌ 포트 $PORT 사용 중 (PID: $PROCESS)"
        ps -p $PROCESS -o comm=
    else
        echo "✅ 포트 $PORT 사용 가능"
    fi
done

echo ""
echo "======================================"
echo "Docker 컨테이너 상태"
echo "======================================"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
read -p "사용 중인 포트를 모두 정리하시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "포트 정리 중..."
    for PORT in "${PORTS[@]}"; do
        PROCESS=$(lsof -ti:$PORT 2>/dev/null)
        if [ ! -z "$PROCESS" ]; then
            echo "포트 $PORT (PID: $PROCESS) 종료 중..."
            kill -9 $PROCESS 2>/dev/null
        fi
    done
    echo "✅ 포트 정리 완료"
fi
