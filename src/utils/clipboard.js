/**
 * 클립보드 복사 유틸리티
 */

/**
 * 텍스트를 클립보드에 복사
 * @param {string} text - 복사할 텍스트
 * @returns {Promise<boolean>} 성공 여부
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // 최신 Clipboard API 사용
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 폴백: 구형 브라우저 지원
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      textArea.remove();
      
      return successful;
    }
  } catch (error) {
    console.error('복사 실패:', error);
    return false;
  }
}

