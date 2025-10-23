"""
Compatibility Router
사주 궁합 분석 API 엔드포인트
"""
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

from app.schemas.compatibility import CompatibilityRequest, CompatibilityResponse
from app.services.compatibility_service import compatibility_service

router = APIRouter()


@router.post(
    "/analyze",
    response_model=CompatibilityResponse,
    status_code=status.HTTP_200_OK,
    summary="사주 궁합 분석",
    description="두 사람의 생년월일 정보를 바탕으로 사주 궁합을 분석합니다.",
    responses={
        200: {
            "description": "궁합 분석 성공",
            "content": {
                "application/json": {
                    "example": {
                        "score": 85,
                        "summary": "두 분은 서로를 보완하는 훌륭한 궁합입니다.",
                        "strengths": [
                            "서로의 부족한 점을 채워줄 수 있는 관계",
                            "의사소통이 원활한 편",
                            "장기적인 발전 가능성이 높음"
                        ],
                        "cautions": [
                            "감정 표현에 있어 오해가 생길 수 있음",
                            "재정 관리에 대한 의견 차이 주의",
                            "서로의 개성을 존중하는 것이 중요"
                        ],
                        "elements_analysis": "오행 분석 결과...",
                        "zodiac_compatibility": "띠 궁합 결과...",
                        "advice": "서로를 존중하고 이해하는 마음으로..."
                    }
                }
            }
        },
        400: {"description": "잘못된 요청 (유효하지 않은 날짜 등)"},
        500: {"description": "서버 오류 (OpenAI API 오류 등)"}
    }
)
async def analyze_compatibility(
    request: CompatibilityRequest
) -> CompatibilityResponse:
    """
    사주 궁합 분석 엔드포인트

    두 사람의 생년월일 정보를 받아 GPT-4o-mini를 이용하여
    사주 궁합을 분석하고 결과를 반환합니다.

    Args:
        request: 궁합 분석 요청 데이터
            - person1: 첫 번째 사람 정보
            - person2: 두 번째 사람 정보
            - language: 응답 언어 (ko/en)

    Returns:
        CompatibilityResponse: 궁합 분석 결과
            - score: 궁합 점수 (0-100)
            - summary: 전체 요약
            - strengths: 강점 3가지
            - cautions: 주의할 점 3가지
            - elements_analysis: 오행 분석
            - zodiac_compatibility: 띠 궁합
            - advice: 조언

    Raises:
        HTTPException 400: 유효하지 않은 날짜
        HTTPException 500: OpenAI API 오류
    """
    try:
        result = await compatibility_service.analyze_compatibility(request)
        return result

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        # 프로덕션에서는 상세 에러 메시지를 로그에만 남기고
        # 사용자에게는 일반적인 메시지 반환
        print(f"Compatibility analysis error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze compatibility. Please try again later."
        )


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="헬스 체크",
    description="궁합 분석 기능의 상태를 확인합니다."
)
async def health_check() -> dict[str, str]:
    """
    헬스 체크 엔드포인트

    Returns:
        dict: 상태 정보
    """
    return {
        "status": "healthy",
        "service": "compatibility_analysis",
        "model": "gpt-4o-mini"
    }
