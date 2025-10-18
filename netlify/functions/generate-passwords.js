/**
 * 서버리스 함수: 비밀번호 생성
 * Netlify Functions용
 */

// Vercel용 함수를 재사용
import handler from '../../api/generate-passwords.js';

export { handler };

