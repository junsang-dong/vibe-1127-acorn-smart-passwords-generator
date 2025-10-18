import { useState } from 'react';

export default function InputForm({ onGenerate, isLoading }) {
  const [pattern, setPattern] = useState('');
  const [length, setLength] = useState(16);
  const [requirements, setRequirements] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (pattern.trim().length < 3) {
      alert('패턴은 최소 3자 이상 입력해주세요');
      return;
    }
    
    onGenerate({ pattern, length, requirements });
  };

  const toggleRequirement = (key) => {
    setRequirements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const examplePatterns = [
    '좋아하는 동물 + 숫자 + 특수문자',
    '영화 제목 기반, 대문자 포함',
    '기억하기 쉬운 문구 + 생일 조합',
    '게임 캐릭터 이름 스타일'
  ];

  const setExamplePattern = (example) => {
    setPattern(example);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          💡 어떤 스타일의 비밀번호를 원하시나요?
        </h2>
        <p className="text-gray-600 text-sm">
          자연어로 원하는 비밀번호 패턴을 설명해주세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 패턴 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            비밀번호 패턴
          </label>
          <textarea
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="예: 좋아하는 영화 제목 기반, 숫자와 특수문자 포함"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            rows={3}
            disabled={isLoading}
          />
          
          {/* 예시 패턴 버튼 */}
          <div className="mt-2 flex flex-wrap gap-2">
            {examplePatterns.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setExamplePattern(example)}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* 길이 슬라이더 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📏 길이: <span className="text-primary font-bold">{length}자</span>
          </label>
          <input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>8자</span>
            <span>32자</span>
          </div>
        </div>

        {/* 포함 요소 체크박스 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ✅ 포함 요소
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: 'uppercase', label: '대문자 (A-Z)', icon: '🔤' },
              { key: 'lowercase', label: '소문자 (a-z)', icon: '🔡' },
              { key: 'numbers', label: '숫자 (0-9)', icon: '🔢' },
              { key: 'special', label: '특수문자 (!@#)', icon: '✨' }
            ].map(({ key, label, icon }) => (
              <label
                key={key}
                className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  requirements[key]
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={requirements[key]}
                  onChange={() => toggleRequirement(key)}
                  className="w-4 h-4 text-primary focus:ring-primary rounded"
                  disabled={isLoading}
                />
                <span className="text-sm">
                  <span className="mr-1">{icon}</span>
                  {label.split(' ')[0]}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 생성 버튼 */}
        <button
          type="submit"
          disabled={isLoading || !pattern.trim()}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>생성 중...</span>
            </>
          ) : (
            <>
              <span>🎲</span>
              <span>비밀번호 생성하기</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

