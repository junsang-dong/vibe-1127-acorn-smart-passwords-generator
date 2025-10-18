import { useState } from 'react';
import InputForm from './components/InputForm';
import PasswordResult from './components/PasswordResult';
import { generatePasswords } from './services/api';

function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (params) => {
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await generatePasswords(params);
      
      if (data.success && data.passwords) {
        setResults(data.passwords);
      } else {
        throw new Error(data.error || '비밀번호 생성에 실패했습니다');
      }
    } catch (err) {
      setError(err.message);
      console.error('생성 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    setResults([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">🔐</span>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SmartPassword Generator
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                AI 기반 스마트 비밀번호 생성기
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 입력 폼 */}
        <InputForm onGenerate={handleGenerate} isLoading={isLoading} />

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg animate-slide-in-up">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">오류 발생</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 결과 섹션 */}
        {results.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                📊 생성 결과
              </h2>
              <button
                onClick={handleRegenerate}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>다시 생성</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result, index) => (
                <PasswordResult
                  key={index}
                  password={result.password}
                  explanation={result.explanation}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="text-center py-12 animate-slide-in-up">
            <div className="inline-block">
              <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 font-medium">AI가 비밀번호를 생성하고 있습니다...</p>
              <p className="text-gray-500 text-sm mt-2">잠시만 기다려주세요</p>
            </div>
          </div>
        )}

        {/* 빈 상태 */}
        {!isLoading && results.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-600 text-lg mb-2">
              원하는 패턴을 입력하고 비밀번호를 생성해보세요
            </p>
            <p className="text-gray-500 text-sm">
              AI가 안전하면서도 기억하기 쉬운 비밀번호를 만들어드립니다
            </p>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="max-w-6xl mx-auto px-4 py-8 mt-16 border-t border-gray-200">
        <div className="text-center text-gray-600 text-sm space-y-2">
          <p>
            <strong>⚠️ 보안 안내:</strong> 생성된 비밀번호는 서버에 저장되지 않습니다.
          </p>
          <p className="text-xs text-gray-500">
            Powered by OpenAI GPT-4o-mini | Built with React + Vite + TailwindCSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

