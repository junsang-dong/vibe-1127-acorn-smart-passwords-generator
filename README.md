# 🔐 SmartPassword Generator

AI 기반 스마트 비밀번호 생성기 - 안전하고 기억하기 쉬운 비밀번호를 만들어보세요!

## ✨ 주요 기능

- 🤖 **AI 기반 생성**: OpenAI GPT-4o-mini를 활용한 지능형 비밀번호 생성
- 🎯 **패턴 커스터마이징**: 자연어로 원하는 비밀번호 스타일 지정
- 📊 **보안 강도 분석**: 실시간 엔트로피 계산 및 크랙 시간 예측
- 🎨 **직관적인 UI**: 반응형 디자인으로 모든 디바이스 지원
- 📋 **원클릭 복사**: 클립보드 복사 기능
- 👁️ **비밀번호 마스킹**: 보안을 위한 표시/숨김 토글

## 🚀 빠른 시작

### 사전 요구사항

- Node.js 18+ 
- npm 또는 yarn
- OpenAI API 키

### 설치

1. 저장소 클론 및 디렉토리 이동
\`\`\`bash
cd vibe-1127-acorn-smart-passwords-generator
\`\`\`

2. 의존성 설치
\`\`\`bash
npm install
\`\`\`

3. 환경변수 설정
\`\`\`bash
# .env.local 파일 생성
echo "OPENAI_API_KEY=your-api-key-here" > .env.local
\`\`\`

4. 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

5. 브라우저에서 열기: http://localhost:3000

## 📁 프로젝트 구조

\`\`\`
vibe-1127-acorn-smart-passwords-generator/
├── api/                          # Vercel 서버리스 함수
│   └── generate-passwords.js     # 비밀번호 생성 API
├── netlify/functions/            # Netlify 서버리스 함수
├── src/
│   ├── components/               # React 컴포넌트
│   │   ├── InputForm.jsx         # 입력 폼
│   │   ├── PasswordResult.jsx    # 결과 표시
│   │   └── StrengthMeter.jsx     # 강도 미터
│   ├── services/
│   │   └── api.js                # API 클라이언트
│   ├── utils/
│   │   ├── passwordAnalyzer.js   # 비밀번호 분석 로직
│   │   └── clipboard.js          # 클립보드 유틸
│   ├── App.jsx                   # 메인 앱
│   ├── main.jsx                  # 엔트리 포인트
│   └── index.css                 # 글로벌 스타일
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── vercel.json                   # Vercel 설정
└── netlify.toml                  # Netlify 설정
\`\`\`

## 🔧 기술 스택

### 프론트엔드
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **TailwindCSS** - CSS 프레임워크
- **Axios** - HTTP 클라이언트

### 백엔드
- **Vercel/Netlify Serverless Functions** - 서버리스 API
- **OpenAI GPT-4o-mini** - AI 비밀번호 생성

## 🌐 배포

### Vercel에 배포

1. Vercel CLI 설치
\`\`\`bash
npm i -g vercel
\`\`\`

2. 배포
\`\`\`bash
vercel --prod
\`\`\`

3. 환경변수 설정
\`\`\`bash
vercel env add OPENAI_API_KEY production
\`\`\`

### Netlify에 배포

1. Netlify CLI 설치
\`\`\`bash
npm i -g netlify-cli
\`\`\`

2. 배포
\`\`\`bash
netlify deploy --prod
\`\`\`

3. 환경변수 설정
- Netlify 대시보드 → Site settings → Environment variables
- \`OPENAI_API_KEY\` 추가

## 📊 비밀번호 강도 계산

### 점수 산정 (0-100점)

- **길이 점수**: 길이 × 2점 (최대 40점)
- **대문자**: +10점
- **소문자**: +10점
- **숫자**: +10점
- **특수문자**: +15점
- **보너스**: 4가지 모두 포함 시 +10점, 20자 이상 +5점
- **감점**: 연속 문자 -10점, 반복 문자 -10점, 일반 단어 -15점

### 보안 등급

- 🔴 **0-20점**: 매우 약함
- 🟠 **21-40점**: 약함
- 🟡 **41-60점**: 보통
- 🟢 **61-80점**: 강함
- 🟢 **81-100점**: 매우 강함

### 크랙 시간 계산

\`\`\`
엔트로피 = 길이 × log2(문자집합 크기)
크랙 시간 = 2^엔트로피 / (2 × 초당시도횟수)
\`\`\`

기준: 초당 10억 번 시도 (일반 GPU)

## 🔒 보안 고려사항

### API 키 보호
- ✅ 환경변수로 관리 (.env.local)
- ✅ 서버리스 함수에서만 사용
- ❌ 클라이언트 코드에 노출 금지

### 속도 제한
- 기본값: 시간당 20회 요청
- IP 주소 기반 제한
- 환경변수로 조정 가능: \`RATE_LIMIT_PER_HOUR\`

### 데이터 보안
- 생성된 비밀번호는 서버에 저장되지 않음
- 클라이언트에서만 처리
- LocalStorage 사용 시 패턴만 저장 (비밀번호는 미저장)

## 💰 비용

### OpenAI API (GPT-4o-mini)
- Input: $0.15 / 1M tokens
- Output: $0.60 / 1M tokens
- 요청당 약 500 tokens 사용
- **1,000회 생성 시 약 $0.50**

### 호스팅
- Vercel/Netlify Free Tier로 충분
- 서버리스 함수: 100GB-hours/month
- 대역폭: 100GB/month

## 🎯 사용 예시

### 1. 영화 제목 기반
**입력**: "좋아하는 영화 제목 기반, 숫자와 특수문자 포함"  
**결과**: \`Inception@2010!\`, \`Matrix!1999Neo\`, \`Pulp#Fiction94\`

### 2. 동물 이름
**입력**: "귀여운 동물 이름 + 랜덤 숫자"  
**결과**: \`Panda@2847\`, \`Koala!1653\`, \`Penguin#9024\`

### 3. 문구 기반
**입력**: "기억하기 쉬운 문구, 12자 이상"  
**결과**: \`ILoveCoding2024!\`, \`Coffee&Code4Ever\`, \`Dream*Big!2025\`

## 📝 개발 가이드

### 새 기능 추가

1. **히스토리 기능**: \`localStorage\`를 활용한 패턴 저장
2. **다크 모드**: TailwindCSS의 \`dark:\` 유틸리티 사용
3. **다국어 지원**: \`i18next\` 라이브러리 통합
4. **배치 생성**: API 호출 시 \`count\` 파라미터 추가

### 테스트

\`\`\`bash
# 비밀번호 분석 로직 테스트
npm run test

# E2E 테스트 (Playwright 등)
npm run test:e2e
\`\`\`

## 🤝 기여

기여는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자유롭게 사용하세요!

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**⚠️ 중요한 보안 안내**

- 생성된 비밀번호는 절대 공유하지 마세요
- 중요한 계정에는 2단계 인증(2FA)을 함께 사용하세요
- 정기적으로 비밀번호를 변경하세요
- 비밀번호 관리자 사용을 권장합니다

**Made with ❤️ using React, Vite, TailwindCSS & OpenAI**

