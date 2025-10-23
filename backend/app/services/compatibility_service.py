"""
Compatibility Service
사주 궁합 분석 비즈니스 로직 및 OpenAI API 통합
"""
from typing import Dict, Any
from datetime import datetime
import json
from openai import OpenAI

from app.schemas.compatibility import (
    PersonInfo,
    CompatibilityRequest,
    CompatibilityResponse
)
from app.core.config import settings


class CompatibilityService:
    """사주 궁합 분석 서비스"""

    def __init__(self):
        """OpenAI 클라이언트 초기화"""
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = "gpt-4o-mini"

    def _validate_date(self, person: PersonInfo) -> bool:
        """날짜 유효성 검증"""
        try:
            datetime(person.birth_year, person.birth_month, person.birth_day)
            return True
        except ValueError:
            return False

    def _calculate_zodiac(self, year: int) -> str:
        """띠 계산 (12지신)"""
        zodiacs = ["원숭이", "닭", "개", "돼지", "쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양"]
        zodiacs_en = ["Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat"]
        index = year % 12
        return {"ko": zodiacs[index], "en": zodiacs_en[index]}

    def _calculate_elements(self, year: int) -> str:
        """오행 계산 (木火土金水)"""
        elements = {
            0: {"ko": "금(金)", "en": "Metal"},
            1: {"ko": "금(金)", "en": "Metal"},
            2: {"ko": "수(水)", "en": "Water"},
            3: {"ko": "수(水)", "en": "Water"},
            4: {"ko": "목(木)", "en": "Wood"},
            5: {"ko": "목(木)", "en": "Wood"},
            6: {"ko": "화(火)", "en": "Fire"},
            7: {"ko": "화(火)", "en": "Fire"},
            8: {"ko": "토(土)", "en": "Earth"},
            9: {"ko": "토(土)", "en": "Earth"},
        }
        last_digit = year % 10
        return elements[last_digit]

    def _build_prompt(self, request: CompatibilityRequest) -> str:
        """GPT 프롬프트 생성"""
        p1 = request.person1
        p2 = request.person2
        lang = request.language

        # 띠와 오행 계산
        zodiac1 = self._calculate_zodiac(p1.birth_year)
        zodiac2 = self._calculate_zodiac(p2.birth_year)
        element1 = self._calculate_elements(p1.birth_year)
        element2 = self._calculate_elements(p2.birth_year)

        # 이름 설정
        name1 = p1.name if p1.name else ("첫 번째 사람" if lang == "ko" else "Person 1")
        name2 = p2.name if p2.name else ("두 번째 사람" if lang == "ko" else "Person 2")

        if lang == "ko":
            prompt = f"""당신은 전문 사주 명리학자입니다. 두 사람의 사주 궁합을 분석해주세요.

**{name1}의 정보:**
- 생년월일: {p1.birth_year}년 {p1.birth_month}월 {p1.birth_day}일
- 생시: {f'{p1.birth_hour}시' if p1.birth_hour is not None else '미제공'}
- 성별: {p1.gender if p1.gender else '미제공'}
- 띠: {zodiac1['ko']}띠
- 오행: {element1['ko']}

**{name2}의 정보:**
- 생년월일: {p2.birth_year}년 {p2.birth_month}월 {p2.birth_day}일
- 생시: {f'{p2.birth_hour}시' if p2.birth_hour is not None else '미제공'}
- 성별: {p2.gender if p2.gender else '미제공'}
- 띠: {zodiac2['ko']}띠
- 오행: {element2['ko']}

아래 JSON 형식으로 정확히 응답해주세요:

{{
  "score": 0-100 사이의 궁합 점수 (정수),
  "summary": "전체적인 궁합에 대한 2-3문장 요약",
  "strengths": ["강점 1", "강점 2", "강점 3"],
  "cautions": ["주의할 점 1", "주의할 점 2", "주의할 점 3"],
  "elements_analysis": "오행 관점에서의 상생상극 분석 (2-3문장)",
  "zodiac_compatibility": "띠 궁합 분석 (2-3문장)",
  "advice": "두 사람을 위한 조언 및 팁 (2-3문장)"
}}

**중요 지침:**
1. 반드시 유효한 JSON 형식으로만 응답하세요.
2. strengths와 cautions는 정확히 3개의 항목을 포함해야 합니다.
3. score는 0-100 사이의 정수여야 합니다.
4. 모든 텍스트는 한국어로 작성하세요.
5. 긍정적이면서도 현실적인 조언을 제공하세요."""

        else:  # English
            prompt = f"""You are a professional Saju (Four Pillars of Destiny) fortune teller. Please analyze the compatibility between two people.

**{name1}'s Information:**
- Birth Date: {p1.birth_month}/{p1.birth_day}/{p1.birth_year}
- Birth Hour: {f'{p1.birth_hour}:00' if p1.birth_hour is not None else 'Not provided'}
- Gender: {p1.gender if p1.gender else 'Not provided'}
- Zodiac: {zodiac1['en']}
- Element: {element1['en']}

**{name2}'s Information:**
- Birth Date: {p2.birth_month}/{p2.birth_day}/{p2.birth_year}
- Birth Hour: {f'{p2.birth_hour}:00' if p2.birth_hour is not None else 'Not provided'}
- Gender: {p2.gender if p2.gender else 'Not provided'}
- Zodiac: {zodiac2['en']}
- Element: {element2['en']}

Please respond in exactly this JSON format:

{{
  "score": compatibility score between 0-100 (integer),
  "summary": "Overall compatibility summary in 2-3 sentences",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "cautions": ["Caution 1", "Caution 2", "Caution 3"],
  "elements_analysis": "Analysis from Five Elements perspective (2-3 sentences)",
  "zodiac_compatibility": "Chinese zodiac compatibility analysis (2-3 sentences)",
  "advice": "Advice and tips for the couple (2-3 sentences)"
}}

**Important Guidelines:**
1. Respond ONLY in valid JSON format.
2. strengths and cautions must contain exactly 3 items each.
3. score must be an integer between 0-100.
4. All text should be in English.
5. Provide positive yet realistic advice."""

        return prompt

    async def analyze_compatibility(
        self,
        request: CompatibilityRequest
    ) -> CompatibilityResponse:
        """
        사주 궁합 분석 실행

        Args:
            request: 궁합 분석 요청 데이터

        Returns:
            CompatibilityResponse: 궁합 분석 결과

        Raises:
            ValueError: 유효하지 않은 날짜
            Exception: OpenAI API 호출 실패
        """
        # 날짜 유효성 검증
        if not self._validate_date(request.person1):
            raise ValueError("Invalid date for person 1")
        if not self._validate_date(request.person2):
            raise ValueError("Invalid date for person 2")

        # OpenAI API 키 확인
        if not settings.OPENAI_API_KEY:
            raise ValueError("OpenAI API key is not configured")

        # 프롬프트 생성
        prompt = self._build_prompt(request)

        try:
            # GPT-4o-mini 호출
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional Saju fortune teller. Always respond in valid JSON format."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=1500,
                response_format={"type": "json_object"}
            )

            # 응답 파싱
            content = response.choices[0].message.content
            result_data = json.loads(content)

            # Pydantic 모델로 변환 (유효성 검증)
            compatibility_result = CompatibilityResponse(**result_data)

            return compatibility_result

        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse GPT response: {str(e)}")
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")


# 싱글톤 인스턴스
compatibility_service = CompatibilityService()
