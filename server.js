/**
 * 로컬 개발용 Express 서버
 * API 엔드포인트를 제공합니다
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 환경변수 로드
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3000;

// 미들웨어
app.use(cors());
app.use(express.json());

// Rate limiting을 위한 간단한 메모리 저장소
const requestCounts = new Map();

/**
 * 속도 제한 확인
 */
function checkRateLimit(userId) {
  const now = Date.now();
  const userRequests = requestCounts.get(userId) || [];
  
  // 최근 1시간 내 요청 필터링
  const recentRequests = userRequests.filter(
    time => now - time < 3600000
  );
  
  const limit = parseInt(process.env.RATE_LIMIT_PER_HOUR || '20');
  
  if (recentRequests.length >= limit) {
    return false;
  }
  
  recentRequests.push(now);
  requestCounts.set(userId, recentRequests);
  return true;
}

/**
 * 입력 검증
 */
function validateInput(data) {
  const errors = [];
  
  if (!data.pattern || typeof data.pattern !== 'string') {
    errors.push('패턴이 필요합니다');
  } else if (data.pattern.trim().length < 3) {
    errors.push('패턴은 최소 3자 이상이어야 합니다');
  } else if (data.pattern.length > 200) {
    errors.push('패턴은 200자를 초과할 수 없습니다');
  }
  
  if (!data.length || typeof data.length !== 'number') {
    errors.push('길이가 필요합니다');
  } else if (data.length < 8 || data.length > 32) {
    errors.push('비밀번호 길이는 8-32자여야 합니다');
  }
  
  if (!data.requirements || typeof data.requirements !== 'object') {
    errors.push('요구사항이 필요합니다');
  } else {
    const reqs = data.requirements;
    if (!reqs.uppercase && !reqs.lowercase && !reqs.numbers && !reqs.special) {
      errors.push('최소 1개 이상의 구성 요소를 선택해야 합니다');
    }
  }
  
  return errors;
}

/**
 * GPT 프롬프트 생성
 */
function createPrompt(pattern, length, requirements) {
  const reqText = [];
  if (requirements.uppercase) reqText.push('대문자 포함 필수');
  if (requirements.lowercase) reqText.push('소문자 포함 필수');
  if (requirements.numbers) reqText.push('숫자 포함 필수');
  if (requirements.special) reqText.push('특수문자 포함 필수');

  return `사용자 패턴: "${pattern}"

요구사항:
- 길이: 정확히 ${length}자
- ${reqText.join(', ')}

위 요구사항을 모두 만족하는 비밀번호 3개를 생성하세요.
각 비밀번호는 서로 다른 창의적인 스타일이어야 합니다.
각 비밀번호에 대해 간단한 설명(30자 이내)을 포함하세요.

중요: 
- 예측 가능한 패턴(123, abc, qwerty 등)은 피하세요
- 보안을 최우선으로 하되 패턴을 반영하세요
- 비밀번호는 실제로 사용 가능한 수준이어야 합니다`;
}

/**
 * OpenAI API 호출
 */
async function callOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'sk-your-api-key-here') {
    // API 키가 설정되지 않은 경우 데모 데이터 반환
    return [
      {
        password: "Demo@Password123!",
        explanation: "데모용 비밀번호 (API 키 설정 필요)"
      },
      {
        password: "Sample#Pass456$",
        explanation: "샘플 비밀번호 (OpenAI 키 필요)"
      },
      {
        password: "Example!Pass789&",
        explanation: "예시 비밀번호 (API 키 설정 후 사용)"
      }
    ];
  }

  const systemPrompt = `당신은 보안 전문가이자 비밀번호 생성 전문가입니다.
사용자의 선호 패턴을 반영하면서도 높은 보안 강도를 가진 비밀번호를 생성합니다.

규칙:
1. 정확히 3개의 비밀번호를 생성하세요
2. 각 비밀번호는 서로 다른 창의적 접근을 사용하세요
3. 사용자가 지정한 길이와 구성 요소를 반드시 포함하세요
4. 예측 가능한 패턴은 피하세요
5. 각 비밀번호에 대해 간단한 설명을 포함하세요

출력 형식:
JSON 배열로만 응답하며, 다른 텍스트는 포함하지 마세요.
[
  {
    "password": "생성된 비밀번호",
    "explanation": "생성 방식 설명 (30자 이내)"
  },
  {
    "password": "생성된 비밀번호2",
    "explanation": "생성 방식 설명 (30자 이내)"
  },
  {
    "password": "생성된 비밀번호3",
    "explanation": "생성 방식 설명 (30자 이내)"
  }
]`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API 호출 실패');
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // JSON 파싱
    try {
      // 코드 블록 제거 (```json ... ``` 형식)
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1].trim();
      const passwords = JSON.parse(jsonStr);
      
      if (!Array.isArray(passwords) || passwords.length !== 3) {
        throw new Error('잘못된 응답 형식');
      }
      
      return passwords;
    } catch (parseError) {
      console.error('JSON 파싱 오류:', content);
      throw new Error('응답 파싱 실패');
    }
  } catch (error) {
    console.error('OpenAI API 오류:', error);
    throw error;
  }
}

// API 엔드포인트
app.post('/api/generate-passwords', async (req, res) => {
  try {
    const { pattern, length, requirements } = req.body;

    // 입력 검증
    const errors = validateInput({ pattern, length, requirements });
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: errors.join(', ')
      });
    }

    // 속도 제한 확인 (IP 주소 기반)
    const userId = req.ip || req.connection.remoteAddress || 'unknown';
    if (!checkRateLimit(userId)) {
      return res.status(429).json({
        success: false,
        error: '시간당 요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.'
      });
    }

    // 프롬프트 생성
    const prompt = createPrompt(pattern, length, requirements);

    // OpenAI API 호출
    const passwords = await callOpenAI(prompt);

    // 성공 응답
    return res.status(200).json({
      success: true,
      passwords,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('비밀번호 생성 오류:', error);

    return res.status(500).json({
      success: false,
      error: error.message || '비밀번호 생성 중 오류가 발생했습니다'
    });
  }
});

// 헬스 체크 엔드포인트
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-api-key-here'
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
  console.log(`📊 API 상태: http://localhost:${PORT}/api/health`);
  console.log(`🔑 API 키 상태: ${process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-api-key-here' ? '설정됨' : '미설정 (데모 모드)'}`);
});
