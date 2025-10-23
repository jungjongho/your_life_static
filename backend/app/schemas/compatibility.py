"""
Compatibility Analysis Schemas
사주 궁합 분석 요청/응답 스키마
"""
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator
from datetime import datetime


class PersonInfo(BaseModel):
    """개인 정보 스키마"""
    birth_year: int = Field(..., ge=1900, le=datetime.now().year, description="출생 연도")
    birth_month: int = Field(..., ge=1, le=12, description="출생 월")
    birth_day: int = Field(..., ge=1, le=31, description="출생 일")
    birth_hour: Optional[int] = Field(None, ge=0, le=23, description="출생 시간 (선택)")
    gender: Optional[str] = Field(None, description="성별 (male/female)")
    name: Optional[str] = Field(None, max_length=50, description="이름/별명 (선택)")

    @field_validator('gender')
    @classmethod
    def validate_gender(cls, v: Optional[str]) -> Optional[str]:
        """성별 값 검증"""
        if v is not None and v not in ['male', 'female']:
            raise ValueError('gender must be either "male" or "female"')
        return v

    @field_validator('birth_day')
    @classmethod
    def validate_date(cls, v: int, info) -> int:
        """날짜 유효성 검증"""
        # Note: Full date validation happens in the service layer
        if v < 1 or v > 31:
            raise ValueError('Invalid day')
        return v


class CompatibilityRequest(BaseModel):
    """사주 궁합 분석 요청 스키마"""
    person1: PersonInfo = Field(..., description="첫 번째 사람 정보")
    person2: PersonInfo = Field(..., description="두 번째 사람 정보")
    language: str = Field(default="ko", description="응답 언어 (ko/en)")

    @field_validator('language')
    @classmethod
    def validate_language(cls, v: str) -> str:
        """언어 코드 검증"""
        if v not in ['ko', 'en']:
            raise ValueError('language must be either "ko" or "en"')
        return v


class CompatibilityResponse(BaseModel):
    """사주 궁합 분석 응답 스키마"""
    score: int = Field(..., ge=0, le=100, description="궁합 점수 (0-100)")
    summary: str = Field(..., description="전체 궁합 요약")
    strengths: List[str] = Field(..., min_length=3, max_length=3, description="강점 3가지")
    cautions: List[str] = Field(..., min_length=3, max_length=3, description="주의할 점 3가지")
    elements_analysis: str = Field(..., description="오행(五行) 분석")
    zodiac_compatibility: str = Field(..., description="띠 궁합 분석")
    advice: str = Field(..., description="조언 및 팁")

    class Config:
        json_schema_extra = {
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
