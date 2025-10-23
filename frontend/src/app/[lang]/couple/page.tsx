'use client';

import { useState } from 'react';
import { useDictionary } from '@/contexts/DictionaryContext';
import { useParams } from 'next/navigation';
import { PersonInfo, CompatibilityResponse } from '@/types';
import { analyzeCompatibility } from '@/services/compatibility';
import { LanguageSwitcher } from '@/components/atoms/LanguageSwitcher';
import Button from '@/components/atoms/Button';

export default function CouplePage() {
  const dict = useDictionary();
  const params = useParams();
  const lang = params.lang as 'ko' | 'en';

  const currentYear = new Date().getFullYear();

  // Person 1 state
  const [year1, setYear1] = useState(0);
  const [month1, setMonth1] = useState(0);
  const [day1, setDay1] = useState(0);
  const [hour1, setHour1] = useState<number | undefined>(undefined);
  const [gender1, setGender1] = useState<'male' | 'female' | ''>('');
  const [name1, setName1] = useState('');

  // Person 2 state
  const [year2, setYear2] = useState(0);
  const [month2, setMonth2] = useState(0);
  const [day2, setDay2] = useState(0);
  const [hour2, setHour2] = useState<number | undefined>(undefined);
  const [gender2, setGender2] = useState<'male' | 'female' | ''>('');
  const [name2, setName2] = useState('');

  // Result state
  const [result, setResult] = useState<CompatibilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const validateDate = (year: number, month: number, day: number): boolean => {
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  const handleAnalyze = async () => {
    // Validate inputs
    if (!year1 || !month1 || !day1 || !year2 || !month2 || !day2) {
      showToast(dict.compatibility.toast.enterAllFields);
      return;
    }

    // Validate dates
    if (!validateDate(year1, month1, day1) || !validateDate(year2, month2, day2)) {
      showToast(dict.compatibility.toast.invalidDate);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const person1: PersonInfo = {
        birth_year: year1,
        birth_month: month1,
        birth_day: day1,
        birth_hour: hour1,
        gender: gender1 || undefined,
        name: name1 || undefined,
      };

      const person2: PersonInfo = {
        birth_year: year2,
        birth_month: month2,
        birth_day: day2,
        birth_hour: hour2,
        gender: gender2 || undefined,
        name: name2 || undefined,
      };

      const response = await analyzeCompatibility({
        person1,
        person2,
        language: lang,
      });

      setResult(response);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      showToast(dict.compatibility.toast.analysisFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setYear1(0);
    setMonth1(0);
    setDay1(0);
    setHour1(undefined);
    setGender1('');
    setName1('');
    setYear2(0);
    setMonth2(0);
    setDay2(0);
    setHour2(undefined);
    setGender2('');
    setName2('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {dict.compatibility.hero.title}
            </h1>
            <p className="text-gray-600">{dict.compatibility.hero.subtitle}</p>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            {toast}
          </div>
        )}

        {!result ? (
          /* Input Form */
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Person 1 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-pink-600 mb-4">
                  {dict.compatibility.form.person1Title}
                </h2>

                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {dict.compatibility.form.year} / {dict.compatibility.form.month} / {dict.compatibility.form.day}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={year1 || ''}
                      onChange={(e) => setYear1(parseInt(e.target.value) || 0)}
                      placeholder={dict.compatibility.form.year}
                      min={1900}
                      max={currentYear}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={month1 || ''}
                      onChange={(e) => setMonth1(parseInt(e.target.value) || 0)}
                      placeholder={dict.compatibility.form.month}
                      min={1}
                      max={12}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={day1 || ''}
                      onChange={(e) => setDay1(parseInt(e.target.value) || 0)}
                      placeholder={dict.compatibility.form.day}
                      min={1}
                      max={31}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Birth Hour */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {dict.compatibility.form.hour}
                  </label>
                  <input
                    type="number"
                    value={hour1 ?? ''}
                    onChange={(e) => setHour1(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder={dict.compatibility.form.hourPlaceholder}
                    min={0}
                    max={23}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {dict.compatibility.form.gender}
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setGender1('male')}
                      className={`flex-1 py-2 rounded-lg border-2 transition-colors ${
                        gender1 === 'male'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-300 hover:border-pink-300'
                      }`}
                    >
                      {dict.compatibility.form.genderMale}
                    </button>
                    <button
                      onClick={() => setGender1('female')}
                      className={`flex-1 py-2 rounded-lg border-2 transition-colors ${
                        gender1 === 'female'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-300 hover:border-pink-300'
                      }`}
                    >
                      {dict.compatibility.form.genderFemale}
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {dict.compatibility.form.name}
                  </label>
                  <input
                    type="text"
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    placeholder={dict.compatibility.form.namePlaceholder}
                    maxLength={50}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Person 2 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-purple-600 mb-4">
                  {dict.compatibility.form.person2Title}
                </h2>

                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {dict.compatibility.form.year} / {dict.compatibility.form.month} / {dict.compatibility.form.day}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={year2 || ''}
                      onChange={(e) => setYear2(parseInt(e.target.value) || 0)}
                      placeholder={dict.compatibility.form.year}
                      min={1900}
                      max={currentYear}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={month2 || ''}
                      onChange={(e) => setMonth2(parseInt(e.target.value) || 0)}
                      placeholder={dict.compatibility.form.month}
                      min={1}
                      max={12}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={day2 || ''}
                      onChange={(e) => setDay2(parseInt(e.target.value) || 0)}
                      placeholder={dict.compatibility.form.day}
                      min={1}
                      max={31}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Birth Hour */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {dict.compatibility.form.hour}
                  </label>
                  <input
                    type="number"
                    value={hour2 ?? ''}
                    onChange={(e) => setHour2(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder={dict.compatibility.form.hourPlaceholder}
                    min={0}
                    max={23}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {dict.compatibility.form.gender}
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setGender2('male')}
                      className={`flex-1 py-2 rounded-lg border-2 transition-colors ${
                        gender2 === 'male'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      {dict.compatibility.form.genderMale}
                    </button>
                    <button
                      onClick={() => setGender2('female')}
                      className={`flex-1 py-2 rounded-lg border-2 transition-colors ${
                        gender2 === 'female'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      {dict.compatibility.form.genderFemale}
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {dict.compatibility.form.name}
                  </label>
                  <input
                    type="text"
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    placeholder={dict.compatibility.form.namePlaceholder}
                    maxLength={50}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="mt-6 text-center text-sm text-gray-600">
              {dict.compatibility.form.privacyNote}
            </div>

            {/* Analyze Button */}
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-12 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg transition-all text-lg"
              >
                {loading ? dict.compatibility.form.analyzing : dict.compatibility.form.analyzeButton}
              </Button>
            </div>
          </div>
        ) : (
          /* Result Display */
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
              {dict.compatibility.result.title}
            </h2>

            {/* Score */}
            <div className="text-center py-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
              <div className="text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {result.score}
              </div>
              <div className="text-xl text-gray-600 mt-2">{dict.compatibility.result.score}</div>
            </div>

            {/* Summary */}
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {dict.compatibility.result.summary}
              </h3>
              <p className="text-gray-700 leading-relaxed">{result.summary}</p>
            </div>

            {/* Strengths */}
            <div className="p-6 bg-green-50 rounded-xl">
              <h3 className="text-lg font-bold text-green-800 mb-3">
                {dict.compatibility.result.strengths}
              </h3>
              <ul className="space-y-2">
                {result.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cautions */}
            <div className="p-6 bg-amber-50 rounded-xl">
              <h3 className="text-lg font-bold text-amber-800 mb-3">
                {dict.compatibility.result.cautions}
              </h3>
              <ul className="space-y-2">
                {result.cautions.map((caution, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-amber-600 mr-2">⚠</span>
                    <span className="text-gray-700">{caution}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Elements Analysis */}
            <div className="p-6 bg-blue-50 rounded-xl">
              <h3 className="text-lg font-bold text-blue-800 mb-2">
                {dict.compatibility.result.elementsAnalysis}
              </h3>
              <p className="text-gray-700 leading-relaxed">{result.elements_analysis}</p>
            </div>

            {/* Zodiac Compatibility */}
            <div className="p-6 bg-purple-50 rounded-xl">
              <h3 className="text-lg font-bold text-purple-800 mb-2">
                {dict.compatibility.result.zodiacCompatibility}
              </h3>
              <p className="text-gray-700 leading-relaxed">{result.zodiac_compatibility}</p>
            </div>

            {/* Advice */}
            <div className="p-6 bg-pink-50 rounded-xl">
              <h3 className="text-lg font-bold text-pink-800 mb-2">
                {dict.compatibility.result.advice}
              </h3>
              <p className="text-gray-700 leading-relaxed">{result.advice}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <Button
                onClick={handleReset}
                className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                {dict.compatibility.result.resetButton}
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          {dict.footer.copyright}
        </div>
      </div>
    </div>
  );
}
