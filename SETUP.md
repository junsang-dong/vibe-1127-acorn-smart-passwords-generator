# 🚀 설치 및 실행 가이드

## 1️⃣ OpenAI API 키 설정

프로젝트를 실행하려면 먼저 OpenAI API 키가 필요합니다.

### API 키 발급받기

1. [OpenAI 웹사이트](https://platform.openai.com)에 접속
2. 로그인 또는 회원가입
3. [API Keys 페이지](https://platform.openai.com/api-keys)로 이동
4. "Create new secret key" 버튼 클릭
5. 생성된 키 복사 (나중에 다시 볼 수 없으니 안전한 곳에 저장!)

### 환경변수 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하세요:

\`\`\`bash
# 파일: .env.local
OPENAI_API_KEY=sk-your-actual-api-key-here
RATE_LIMIT_PER_HOUR=20
\`\`\`

**⚠️ 주의**: 
- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- 이미 `.gitignore`에 포함되어 있어 자동으로 제외됩니다

---

## 2️⃣ 개발 서버 실행

### 터미널에서 실행:

\`\`\`bash
npm run dev
\`\`\`

### 브라우저에서 열기:

http://localhost:3000

---

## 3️⃣ 빌드 및 프리뷰

### 프로덕션 빌드:

\`\`\`bash
npm run build
\`\`\`

### 빌드 결과 미리보기:

\`\`\`bash
npm run preview
\`\`\`

---

## 4️⃣ 배포하기

### Option A: Vercel에 배포

1. **Vercel CLI 설치**
\`\`\`bash
npm i -g vercel
\`\`\`

2. **로그인**
\`\`\`bash
vercel login
\`\`\`

3. **배포**
\`\`\`bash
vercel --prod
\`\`\`

4. **환경변수 설정**
\`\`\`bash
vercel env add OPENAI_API_KEY production
# 프롬프트에서 API 키 입력
\`\`\`

### Option B: Netlify에 배포

1. **Netlify CLI 설치**
\`\`\`bash
npm i -g netlify-cli
\`\`\`

2. **로그인**
\`\`\`bash
netlify login
\`\`\`

3. **초기 설정**
\`\`\`bash
netlify init
\`\`\`

4. **배포**
\`\`\`bash
netlify deploy --prod
\`\`\`

5. **환경변수 설정**
- Netlify 대시보드 접속
- Site settings → Environment variables
- \`OPENAI_API_KEY\` 추가

### Option C: GitHub + Vercel/Netlify (추천)

1. **GitHub 저장소 생성**
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
\`\`\`

2. **Vercel/Netlify에서 Import**
   - Vercel: https://vercel.com/new
   - Netlify: https://app.netlify.com/start
   - GitHub 저장소 선택
   - 환경변수 설정 (\`OPENAI_API_KEY\`)
   - Deploy 버튼 클릭

---

## 5️⃣ 문제 해결

### 의존성 설치 오류

\`\`\`bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
\`\`\`

### API 호출 오류

1. **API 키 확인**
   - `.env.local` 파일이 존재하는지 확인
   - API 키가 올바른지 확인
   - OpenAI 계정에 크레딧이 있는지 확인

2. **CORS 오류**
   - 로컬에서는 Vite proxy 사용 (자동 설정됨)
   - 배포 시 서버리스 함수가 제대로 작동하는지 확인

3. **속도 제한 오류**
   - `.env.local`에서 \`RATE_LIMIT_PER_HOUR\` 값 조정
   - 잠시 후 다시 시도

### 빌드 오류

\`\`\`bash
# 캐시 삭제
rm -rf dist .vite

# 다시 빌드
npm run build
\`\`\`

---

## 6️⃣ 개발 팁

### Hot Reload
Vite가 파일 변경을 자동으로 감지하고 브라우저를 업데이트합니다.

### 코드 포매팅
\`\`\`bash
# Prettier 설치 (선택사항)
npm install -D prettier
npx prettier --write "src/**/*.{js,jsx}"
\`\`\`

### 디버깅
- 브라우저 개발자 도구의 Console 탭 확인
- Network 탭에서 API 호출 확인
- React DevTools 설치 권장

---

## 7️⃣ 비용 관리

### OpenAI API 사용량 모니터링

1. [OpenAI Dashboard](https://platform.openai.com/usage) 접속
2. 사용량 확인
3. 사용 제한 설정 (Settings → Billing → Usage limits)

### 예상 비용 (GPT-4o-mini)

- 요청당 약 $0.0005
- 월 1,000회 사용 시 약 $0.50
- 월 10,000회 사용 시 약 $5.00

### 비용 절감 팁

1. **Rate Limiting 활용**
   - \`RATE_LIMIT_PER_HOUR\`를 적절히 설정

2. **캐싱 구현** (고급)
   - 동일한 패턴 요청 시 캐시된 결과 반환

3. **Temperature 조정**
   - 낮은 temperature (0.7) 사용 시 토큰 사용량 감소

---

## 8️⃣ 다음 단계

프로젝트가 정상 작동하면 다음 기능들을 추가해보세요:

- [ ] 히스토리 기능 (LocalStorage)
- [ ] 다크 모드
- [ ] 비밀번호 기억 팁 생성
- [ ] 배치 생성 (10개 이상)
- [ ] CSV 다운로드
- [ ] 다국어 지원
- [ ] PWA 변환

---

## 📞 도움이 필요하신가요?

- 📖 [전체 문서 보기](README.md)
- 🐛 [이슈 등록](https://github.com/your-username/your-repo/issues)
- 💬 [토론 참여](https://github.com/your-username/your-repo/discussions)

---

**🎉 축하합니다!**  
이제 AI 기반 비밀번호 생성기를 사용할 준비가 되었습니다!

