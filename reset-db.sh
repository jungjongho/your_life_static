#!/bin/bash

# 데이터베이스 초기화 스크립트 (주의: 모든 데이터 삭제됨!)

echo "⚠️  경고: 이 스크립트는 모든 데이터베이스 볼륨을 삭제합니다!"
echo "======================================"
read -p "정말 모든 데이터를 삭제하시겠습니까? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "취소되었습니다."
    exit 0
fi

echo ""
echo "데이터베이스 볼륨 삭제 중..."

# YourLife DB 볼륨
docker volume rm your_life_static_postgres_data 2>/dev/null && echo "✓ YourLife DB 볼륨 삭제"

# Lottery DB 볼륨
docker volume rm generate_lottery_number_postgres_data 2>/dev/null && echo "✓ Lottery DB 볼륨 삭제"

# Index DB 볼륨
docker volume rm index_static_postgres_data 2>/dev/null && echo "✓ Index DB 볼륨 삭제"

echo ""
echo "✅ 데이터베이스 초기화 완료"
echo "이제 서비스를 다시 시작하면 새로운 데이터베이스가 생성됩니다."
