# 🌐 웹 배포 가이드

SmartPassword Generator를 웹에 배포하는 방법을 단계별로 안내합니다.

## 🚀 Option 1: Vercel 배포 (추천)

### 1단계: Vercel CLI 설치 및 로그인

```bash
# Vercel CLI 설치 (이미 설치됨)
npm install -g vercel

# Vercel 로그인
vercel login
```

### 2단계: 프로젝트 빌드

```bash
# 프로덕션 빌드
npm run build
```

### 3단계: Vercel 배포

```bash
# 배포 시작
vercel --prod

# 또는 간단히
vercel
```

### 4단계: 환경변수 설정

```bash
# OpenAI API 키 설정
vercel env add OPENAI_API_KEY production

# 프롬프트에서 실제 API 키 입력
# 예: sk-proj-abc123...
```

### 5단계: 도메인 확인

배포 완료 후 제공되는 URL로 접속:
- 예: `https://smartpassword-generator-abc123.vercel.app`

---

## 🌐 Option 2: Netlify 배포

### 1단계: Netlify CLI 설치

```bash
npm install -g netlify-cli
```

### 2단계: 빌드 및 배포

```bash
# 빌드
npm run build

# Netlify 로그인
netlify login

# 배포
netlify deploy --prod --dir=dist
```

### 3단계: 환경변수 설정

Netlify 대시보드에서:
1. Site settings → Environment variables
2. `OPENAI_API_KEY` 추가
3. 실제 API 키 값 입력

---

## 🐙 Option 3: GitHub + Vercel (가장 추천!)

### 1단계: GitHub 저장소 생성

```bash
# Git 초기화
git init

# 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: SmartPassword Generator"

# GitHub 저장소 생성 후 연결
git remote add origin https://github.com/your-username/smartpassword-generator.git
git branch -M main
git push -u origin main
```

### 2단계: Vercel에서 GitHub 연동

1. **Vercel 웹사이트 접속**: https://vercel.com
2. **GitHub로 로그인**
3. **"New Project" 클릭**
4. **GitHub 저장소 선택**
5. **Import 클릭**

### 3단계: 환경변수 설정

Vercel 대시보드에서:
1. Project Settings → Environment Variables
2. `OPENAI_API_KEY` 추가
3. 실제 API 키 입력
4. Deploy 클릭

### 4단계: 자동 배포 설정

이제 GitHub에 코드를 푸시할 때마다 자동으로 배포됩니다!

```bash
# 코드 수정 후
git add .
git commit -m "Update feature"
git push origin main
# → 자동으로 Vercel에서 재배포
```

---

## 🔧 Option 4: 수동 배포 (고급)

### 1단계: 정적 파일 생성

```bash
# 빌드
npm run build

# dist 폴더가 생성됨
ls dist/
```

### 2단계: 서버리스 함수 설정

Vercel용 `vercel.json` 파일이 이미 준비되어 있습니다:

```json
{
  "functions": {
    "api/generate-passwords.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

### 3단계: 배포

```bash
# Vercel에 배포
vercel --prod

# 또는 Netlify에 배포
netlify deploy --prod --dir=dist
```

---

## 📋 배포 전 체크리스트

### ✅ 필수 확인사항

- [ ] `.env.local` 파일에 실제 OpenAI API 키 설정
- [ ] `npm run build` 성공적으로 실행
- [ ] `dist/` 폴더에 빌드 파일 생성 확인
- [ ] API 엔드포인트 테스트 (`/api/health`)

### ✅ 보안 확인사항

- [ ] `.env.local` 파일이 `.gitignore`에 포함됨
- [ ] API 키가 코드에 하드코딩되지 않음
- [ ] 환경변수로 API 키 관리

### ✅ 성능 확인사항

- [ ] 빌드 크기 최적화
- [ ] 이미지 최적화 (있다면)
- [ ] 불필요한 의존성 제거

---

## 🎯 추천 배포 순서

### 초보자용 (가장 쉬움)
1. **GitHub + Vercel**: 코드 푸시 → 자동 배포
2. **환경변수 설정**: Vercel 대시보드에서 API 키 설정
3. **완료!**: URL로 접속하여 테스트

### 중급자용
1. **Vercel CLI**: 로컬에서 직접 배포
2. **환경변수**: CLI로 설정
3. **도메인 커스터마이징**: 필요시

### 고급자용
1. **Netlify**: 대안 플랫폼
2. **커스텀 도메인**: 자신의 도메인 연결
3. **CDN 설정**: 성능 최적화

---

## 💰 비용 정보

### Vercel
- **무료 플랜**: 월 100GB 대역폭, 100GB-hours 함수 실행
- **Pro 플랜**: $20/월 (더 많은 리소스)

### Netlify
- **무료 플랜**: 월 100GB 대역폭, 300분 빌드 시간
- **Pro 플랜**: $19/월

### OpenAI API
- **GPT-4o-mini**: $0.15/1M input tokens, $0.60/1M output tokens
- **예상 비용**: 월 1,000명 사용자 시 약 $3-5

---

## 🚨 문제 해결

### 빌드 오류
```bash
# 캐시 삭제 후 재빌드
rm -rf dist .vite node_modules/.vite
npm run build
```

### 환경변수 오류
```bash
# 로컬에서 테스트
echo $OPENAI_API_KEY

# Vercel에서 확인
vercel env ls
```

### API 오류
```bash
# API 상태 확인
curl https://your-app.vercel.app/api/health
```

---

## 🎉 배포 완료 후

### 1. 테스트
- [ ] 웹사이트 접속 확인
- [ ] 비밀번호 생성 테스트
- [ ] 모바일 반응형 확인

### 2. 공유
- [ ] URL 공유
- [ ] 소셜 미디어 홍보
- [ ] 포트폴리오에 추가

### 3. 모니터링
- [ ] Vercel/Netlify 대시보드 확인
- [ ] OpenAI API 사용량 모니터링
- [ ] 사용자 피드백 수집

---

## 📞 도움말

배포 중 문제가 발생하면:

1. **Vercel 문서**: https://vercel.com/docs
2. **Netlify 문서**: https://docs.netlify.com
3. **GitHub Issues**: 프로젝트 저장소에 이슈 등록

---

**🎊 축하합니다!**  
이제 전 세계 누구나 사용할 수 있는 웹앱이 완성됩니다!
