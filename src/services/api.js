/**
 * API 서비스
 * 백엔드 API와 통신
 */

import axios from 'axios';

const API_BASE_URL = '/api';

/**
 * 비밀번호 생성 요청
 * @param {Object} params - 생성 파라미터
 * @param {string} params.pattern - 사용자 패턴 설명
 * @param {number} params.length - 비밀번호 길이
 * @param {Object} params.requirements - 요구사항
 * @returns {Promise<Object>} 생성된 비밀번호 배열
 */
export async function generatePasswords({ pattern, length, requirements }) {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-passwords`, {
      pattern,
      length,
      requirements
    }, {
      timeout: 30000 // 30초 타임아웃
    });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // 서버 응답 에러
      const message = error.response.data?.error || '비밀번호 생성에 실패했습니다';
      throw new Error(message);
    } else if (error.request) {
      // 네트워크 에러
      throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
    } else {
      // 기타 에러
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
}

