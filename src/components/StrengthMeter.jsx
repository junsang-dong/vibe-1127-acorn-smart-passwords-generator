export default function StrengthMeter({ analysis }) {
  const { score, grade, color, emoji, length, entropy, crackTime, warnings } = analysis;

  // 점수를 퍼센트로 변환 (0-100)
  const percentage = score;

  return (
    <div className="space-y-4">
      {/* 강도 점수 바 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            보안 강도
          </span>
          <span className="text-lg font-bold" style={{ color }}>
            {emoji} {score}/100
          </span>
        </div>
        
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full strength-bar rounded-full"
            style={{
              width: `${percentage}%`,
              backgroundColor: color
            }}
          />
        </div>
        
        <div className="mt-1 text-center">
          <span className="text-sm font-semibold" style={{ color }}>
            {grade}
          </span>
        </div>
      </div>

      {/* 크랙 예상 시간 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-600 mb-1">⏱️ 크랙 예상 시간</div>
            <div className="text-lg font-bold text-gray-800">{crackTime}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">🔒 엔트로피</div>
            <div className="text-lg font-bold text-gray-800">{entropy} bits</div>
          </div>
        </div>
      </div>

      {/* 상세 분석 */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700 mb-2">상세 분석</div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className={`flex items-center space-x-1 ${analysis.hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{analysis.hasUppercase ? '✅' : '❌'}</span>
            <span>대문자</span>
          </div>
          
          <div className={`flex items-center space-x-1 ${analysis.hasLowercase ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{analysis.hasLowercase ? '✅' : '❌'}</span>
            <span>소문자</span>
          </div>
          
          <div className={`flex items-center space-x-1 ${analysis.hasNumbers ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{analysis.hasNumbers ? '✅' : '❌'}</span>
            <span>숫자</span>
          </div>
          
          <div className={`flex items-center space-x-1 ${analysis.hasSpecial ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{analysis.hasSpecial ? '✅' : '❌'}</span>
            <span>특수문자</span>
          </div>
        </div>

        <div className={`text-sm ${length >= 12 ? 'text-green-600' : 'text-gray-600'}`}>
          {length >= 12 ? '✅' : 'ℹ️'} 길이: {length}자 {length >= 12 ? '(권장)' : '(12자 이상 권장)'}
        </div>

        {/* 경고 및 피드백 */}
        {warnings.length > 0 && (
          <div className="mt-3 space-y-1">
            {warnings.map((warning, idx) => {
              const isPositive = warning.startsWith('✅');
              return (
                <div
                  key={idx}
                  className={`text-xs px-3 py-2 rounded-lg ${
                    isPositive
                      ? 'bg-green-50 text-green-700'
                      : 'bg-yellow-50 text-yellow-700'
                  }`}
                >
                  {warning}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

