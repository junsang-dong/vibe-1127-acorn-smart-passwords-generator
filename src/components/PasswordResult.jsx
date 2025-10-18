import { useState, useEffect } from 'react';
import { analyzePasswordStrength } from '../utils/passwordAnalyzer';
import { copyToClipboard } from '../utils/clipboard';
import StrengthMeter from './StrengthMeter';

export default function PasswordResult({ password, explanation, index }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  // 비밀번호 분석
  useEffect(() => {
    if (password) {
      const result = analyzePasswordStrength(password);
      setAnalysis(result);
    }
  }, [password]);

  // 복사 처리
  const handleCopy = async () => {
    const success = await copyToClipboard(password);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert('복사에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 비밀번호 마스킹
  const displayPassword = visible ? password : '•'.repeat(password.length);

  if (!analysis) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 animate-slide-in-up">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          비밀번호 #{index + 1}
        </h3>
        <div className="flex space-x-2">
          {/* 표시/숨김 버튼 */}
          <button
            onClick={() => setVisible(!visible)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title={visible ? '숨기기' : '표시하기'}
          >
            {visible ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>

          {/* 복사 버튼 */}
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {copied ? (
              <span className="flex items-center space-x-1 animate-checkmark">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>복사됨!</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>복사</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 비밀번호 표시 */}
      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 font-mono text-lg text-center break-all select-all">
          {displayPassword}
        </div>
        {explanation && (
          <p className="mt-2 text-sm text-gray-600 italic">
            💡 {explanation}
          </p>
        )}
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* 강도 분석 */}
      <StrengthMeter analysis={analysis} />
    </div>
  );
}

