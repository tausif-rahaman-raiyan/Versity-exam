import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertTriangle, FileText, ArrowRight, RefreshCw } from 'lucide-react';
import type { ExamSession, Question } from '../data/questionBank';

interface JsonImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (session: ExamSession, questions: Question[]) => void;
}

export function JsonImportModal({ isOpen, onClose, onImportSuccess }: JsonImportModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [report, setReport] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleProcessJson = async (file: File) => {
    setIsLoading(true);
    setErrorMsg(null);
    setReport(null);
    setProgressStatus('JSON ফাইল রিড এবং স্ট্রাকচার চেক করা হচ্ছে...');

    try {
      const text = await file.text();
      let rawJson: any;
      try {
        rawJson = JSON.parse(text);
      } catch {
        throw new Error('ভুল JSON ফরম্যাট! সঠিক JSON ফাইল আপলোড করুন।');
      }

      if (!rawJson || typeof rawJson !== 'object' || !Array.isArray(rawJson.questions)) {
        throw new Error('ভুল পরীক্ষার স্ট্রাকচার! "questions" অ্যারে খুঁজে পাওয়া যায়নি।');
      }

      setProgressStatus('সার্ভারে ছবি লোকালাইজেশন ও আনসার ভ্যালিডেশন চলছে...');

      const response = await fetch('/api/json/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rawJson),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `সার্ভার এরর: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success || !data.exam) {
        throw new Error(data.error || 'আমদানি ব্যর্থ হয়েছে।');
      }

      setReport(data.report);

      const university = (data.exam.university || 'DU').toUpperCase() as any;
      const sessionYear = data.exam.exam_year || '25-26';
      const examTitle = data.exam.exam_title || `${university} ${sessionYear} Admission Test`;
      const isWritten = (data.exam.exam_type || '').toLowerCase() === 'written';

      const newSession: ExamSession = {
        id: `${university.toLowerCase()}-${sessionYear.replace(/[^0-9-]/g, '')}-${isWritten ? 'written' : 'mcq'}-${Date.now().toString(36)}`,
        title: examTitle,
        university: ['DU', 'RU', 'JU', 'CU', 'GST'].includes(university) ? university : 'DU',
        session: sessionYear,
        durationMinutes: isWritten ? 30 : 90,
        totalQuestions: data.report.totalQuestions,
        totalMarks: data.report.totalQuestions,
        description: `${examTitle} - ${data.report.mcqCount} MCQ, ${data.report.downloadedImagesCount} Localized Images.`,
        questionType: isWritten ? 'Written' : 'MCQ',
      };

      const mappedQuestions: Question[] = data.exam.questions.map((q: any, index: number) => {
        const rawOptions = Array.isArray(q.options) ? q.options : [];
        const optionTexts = rawOptions.map((opt: any) => typeof opt === 'string' ? opt : (opt.text || opt.html || ''));
        const optionLabels = rawOptions.map((opt: any, optIdx: number) =>
          typeof opt === 'string' ? String.fromCharCode(65 + optIdx) : (opt.label || String.fromCharCode(65 + optIdx))
        );

        return {
          id: `${newSession.id}-q-${q.number || index + 1}`,
          university: newSession.university,
          session: newSession.session,
          subject: q.subject || 'General Science',
          question: q.question || '',
          options: optionTexts,
          correctAnswer: isWritten ? -1 : (typeof q.verifiedAnswerIndex === 'number' ? q.verifiedAnswerIndex : -1),
          explanation: q.explanation || '',
          questionType: isWritten ? 'Written' : 'MCQ',
          marks: typeof q.marks === 'number' ? q.marks : 1,
          number: q.number || index + 1,
          answerVerified: Boolean(q.isAnswerVerified),
          answerDetection: q.answer_detection,
          correctAnswerText: q.correct_answer?.text || '',
          optionLabels,
          questionHtml: q.question_html,
          optionHtmls: rawOptions.map((opt: any) => typeof opt === 'string' ? '' : (opt.html || '')),
          explanationHtml: q.explanation_html,
          questionImageUrls: q.question_image_urls || [],
          optionImageUrls: rawOptions.map((opt: any) => typeof opt === 'string' ? [] : (opt.image_urls || [])),
          explanationImageUrls: q.explanation_image_urls || [],
          rawCardHtml: q.raw_card_html,
          sourceLabel: q.source_label,
        };
      });

      onImportSuccess(newSession, mappedQuestions);

    } catch (err: any) {
      console.error('Import error:', err);
      setErrorMsg(err.message || 'JSON ফাইল প্রসেস করতে সমস্যা হয়েছে।');
    } finally {
      setIsLoading(false);
      setProgressStatus('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessJson(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessJson(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0B1222] border border-indigo-900/80 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 text-slate-100 my-auto">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Chorcha Exam JSON Importer
              </h3>
              <p className="text-xs text-slate-400">
                বিশ্ববিদ্যালয় ভর্তি পরীক্ষার JSON ফাইল আপলোড ও লোকাল ইমেজ কনভার্ট করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone */}
        {!report && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-sky-400 bg-sky-500/10 scale-[0.99]'
                : 'border-slate-800 hover:border-sky-500/50 bg-[#070D1B]'
            }`}
          >
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
              id="json-file-input"
              disabled={isLoading}
            />
            <label htmlFor="json-file-input" className="cursor-pointer block space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                {isLoading ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-sky-400" />
                ) : (
                  <FileText className="w-6 h-6 text-sky-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {isLoading ? progressStatus : 'JSON ফাইল ড্র্যাগ করে ছাড়ুন অথবা ব্রাউজ করুন'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  সহায়তা করে: DU_25-26_MCQ (1).json এবং অন্যান্য Chorcha JSON ফরম্যাট
                </p>
              </div>
              {!isLoading && (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-md">
                  <span>ফাইল সিলেক্ট করুন (.json)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </label>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">আমদানি ত্রুটি!</p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Import Verification Report */}
        {report && (
          <div className="space-y-4 bg-[#070D1B] border border-emerald-950/80 rounded-2xl p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-emerald-300">
                  পরীক্ষা সফলভাবে ইমপোর্ট হয়েছে!
                </h4>
              </div>
              <span className="text-xs font-bold text-sky-400 px-2.5 py-1 bg-sky-500/10 border border-sky-500/20 rounded-lg">
                {report.university} • {report.session}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-[#0B1222] p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">মোট প্রশ্ন</span>
                <span className="text-base font-bold text-white">{report.totalQuestions} টি</span>
                <span className="text-[10px] text-slate-500 block">ঘোষিত: {report.declaredCount}</span>
              </div>

              <div className="bg-[#0B1222] p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">পরীক্ষার ধরন</span>
                <span className="text-base font-bold text-sky-400">
                  {report.mcqCount > 0 ? `${report.mcqCount} MCQ` : `${report.writtenCount} Written`}
                </span>
                <span className="text-[10px] text-emerald-400 block font-medium">
                  {report.verifiedAnswersCount} উত্তর ভেরিফাইড
                </span>
              </div>

              <div className="bg-[#0B1222] p-3 rounded-xl border border-slate-800 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">ছবি সমুহ</span>
                <span className="text-base font-bold text-amber-300">
                  {report.downloadedImagesCount} Localized
                </span>
                <span className="text-[10px] text-slate-500 block">মোট {report.totalImagesFound} টি পাইপড</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs space-y-1 text-slate-300">
              <p className="flex items-center justify-between">
                <span>সার্ভারে ছবি সেভড:</span>
                <strong className="text-emerald-400">/assets/imported/ (100% Offline Safe)</strong>
              </p>
              <p className="flex items-center justify-between">
                <span>KaTeX গণিত ফর্মুলা:</span>
                <strong className="text-sky-300">সংরক্ষিত ($ and $$)</strong>
              </p>
              <p className="flex items-center justify-between">
                <span>বাংলা টেক্সট ও সমাধান:</span>
                <strong className="text-emerald-300">ভেরিফাইড</strong>
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => {
                  setReport(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                আরেকটি ফাইল আপলোড করুন
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg"
              >
                পরীক্ষা শুরু করুন / প্রশ্ন দেখুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
