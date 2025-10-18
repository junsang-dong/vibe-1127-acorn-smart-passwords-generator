/**
 * 비밀번호 강도 분석 유틸리티
 * 엔트로피, 크랙 시간, 보안 점수 계산
 */

/**
 * 엔트로피 계산
 * @param {string} password - 분석할 비밀번호
 * @returns {number} 엔트로피 값 (bits)
 */
export function calculateEntropy(password) {
  let charsetSize = 0;
  
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/\d/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
  
  if (charsetSize === 0) return 0;
  
  return password.length * Math.log2(charsetSize);
}

/**
 * 크랙 예상 시간 계산
 * @param {number} entropy - 엔트로피 값
 * @returns {string} 사람이 읽기 쉬운 시간 형식
 */
export function calculateCrackTime(entropy) {
  // 초당 10억 번 시도 가정 (일반 GPU 기준)
  const attemptsPerSecond = 1e9;
  
  // 평균적으로 전체의 절반을 시도
  const totalCombinations = Math.pow(2, entropy);
  const secondsToCrack = totalCombinations / (2 * attemptsPerSecond);
  
  // 시간 변환
  if (secondsToCrack < 1) {
    return '1초 미만';
  } else if (secondsToCrack < 60) {
    return `약 ${Math.round(secondsToCrack)}초`;
  } else if (secondsToCrack < 3600) {
    return `약 ${Math.round(secondsToCrack / 60)}분`;
  } else if (secondsToCrack < 86400) {
    return `약 ${Math.round(secondsToCrack / 3600)}시간`;
  } else if (secondsToCrack < 31536000) {
    return `약 ${Math.round(secondsToCrack / 86400)}일`;
  } else if (secondsToCrack < 31536000000) {
    return `약 ${Math.round(secondsToCrack / 31536000)}년`;
  } else if (secondsToCrack < 31536000000000) {
    return `약 ${Math.round(secondsToCrack / 31536000000)}만년`;
  } else {
    const billions = Math.round(secondsToCrack / 31536000000000);
    return `약 ${billions.toLocaleString('ko-KR')}억년`;
  }
}

/**
 * 비밀번호 강도 종합 분석
 * @param {string} password - 분석할 비밀번호
 * @returns {Object} 분석 결과
 */
export function analyzePasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      grade: '없음',
      color: '#9ca3af',
      emoji: '⚪',
      length: 0,
      hasUppercase: false,
      hasLowercase: false,
      hasNumbers: false,
      hasSpecial: false,
      entropy: '0.0',
      crackTime: 'N/A',
      warnings: ['비밀번호를 입력하세요']
    };
  }

  let score = 0;
  const warnings = [];
  
  // 1. 길이 점수 (최대 40점)
  const length = password.length;
  if (length < 8) {
    return {
      score: 0,
      grade: '매우 약함',
      color: '#ef4444',
      emoji: '🔴',
      length,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecial: /[^a-zA-Z0-9]/.test(password),
      entropy: '0.0',
      crackTime: 'N/A',
      warnings: ['최소 8자 이상이어야 합니다']
    };
  }
  
  score += Math.min(length * 2, 40);
  
  // 2. 문자 다양성 점수 (각 10-15점)
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (hasLowercase) score += 10;
  if (hasUppercase) score += 10;
  if (hasNumbers) score += 10;
  if (hasSpecial) score += 15;
  
  // 3. 패턴 감점
  // 연속 문자 (abc, 123, xyz)
  if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789/i.test(password)) {
    score -= 10;
    warnings.push('연속된 문자 포함');
  }
  
  // 반복 문자 (aaa, 111)
  if (/(.)\1{2,}/.test(password)) {
    score -= 10;
    warnings.push('반복된 문자 포함');
  }
  
  // 일반 단어 체크
  const commonWords = [
    'password', 'passwd', 'admin', 'user', 'login', 'welcome',
    'qwerty', 'asdfgh', 'zxcvbn', 'letmein', 'monkey', 'dragon',
    '123456', '12345678', 'abc123', 'password123'
  ];
  
  const lowerPassword = password.toLowerCase();
  const foundWords = commonWords.filter(word => lowerPassword.includes(word));
  
  if (foundWords.length > 0) {
    score -= 15;
    warnings.push('일반적인 단어 포함');
  }
  
  // 키보드 패턴
  if (/qwert|asdfg|zxcvb/i.test(password)) {
    score -= 10;
    warnings.push('키보드 패턴 포함');
  }
  
  // 4. 보너스 점수
  // 매우 긴 비밀번호 (20자 이상)
  if (length >= 20) score += 5;
  
  // 4가지 문자 유형 모두 포함
  if (hasLowercase && hasUppercase && hasNumbers && hasSpecial) {
    score += 10;
  }
  
  // 5. 점수 범위 제한 (0-100)
  score = Math.max(0, Math.min(100, score));
  
  // 6. 등급 결정
  let grade, color, emoji;
  if (score >= 81) {
    grade = '매우 강함';
    color = '#10b981';
    emoji = '🟢';
  } else if (score >= 61) {
    grade = '강함';
    color = '#84cc16';
    emoji = '🟢';
  } else if (score >= 41) {
    grade = '보통';
    color = '#eab308';
    emoji = '🟡';
  } else if (score >= 21) {
    grade = '약함';
    color = '#f97316';
    emoji = '🟠';
  } else {
    grade = '매우 약함';
    color = '#ef4444';
    emoji = '🔴';
  }
  
  // 7. 엔트로피 및 크랙 시간 계산
  const entropy = calculateEntropy(password);
  const crackTime = calculateCrackTime(entropy);
  
  // 긍정적 피드백
  if (length >= 12 && warnings.length === 0) {
    warnings.push('✅ 훌륭한 비밀번호입니다!');
  }
  
  return {
    score,
    grade,
    color,
    emoji,
    length,
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSpecial,
    entropy: entropy.toFixed(1),
    crackTime,
    warnings
  };
}

