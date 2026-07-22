"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "@/routing";
import { useQuizStore } from "@/store/useQuizStore";
import { Button } from "@/components/ui/Button";
import { Printer, ArrowLeft, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function SheetPage() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const { answers } = useQuizStore();
  const [mounted, setMounted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [planDetails, setPlanDetails] = useState<{ price: string, specs: any } | null>(null);
  const ts = useTranslations("Sheet");

  useEffect(() => {
    setMounted(true);
    if (!answers.arc) {
      router.push("/find");
      return;
    }

    if (plan && answers.stay) {
      fetch(`/api/prices?duration=${answers.stay}&locale=${locale}&v=2`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data && data.specs) {
            setPlanDetails({
              price: data.data[plan],
              specs: data.specs[plan]
            });
          }
        })
        .catch(err => console.error(err));
    }
  }, [answers, router, plan, locale]);

  if (!mounted) return null;

  const stayKoreanMap: Record<string, string> = {
    '1month': '1개월 미만 (단기 체류)',
    '2months': '2개월 (단기 체류)',
    '3months': '3개월 (단기 체류)',
    '6months': '6개월 (중기 체류)',
    '1year': '1년 (장기 체류)',
    'resident': '2년 이상 (장기 체류)'
  };
  const stayText = stayKoreanMap[answers.stay || ''] || '알 수 없음';

  const planKoreanMap: Record<string, string> = {
    'prepaid_airport': '공항 카운터 선불(Prepaid) 유심',
    'prepaid_online': '편의점/온라인 선불(Prepaid) 유심',
    'mvno': '알뜰폰(MVNO) 무약정 후불 요금제',
    'major': '통신 3사(SKT/KT/LGU+) 일반 후불 요금제',
    'esim': '여행자용 글로벌 데이터 eSIM'
  };
  const planText = planKoreanMap[plan || ''] || '상담 후 결정';

  const handleExportPDF = async () => {
    if (!sheetRef.current) return;
    setIsExporting(true);
    try {
      const { toPng } = await import('html-to-image');
      const jsPDF = (await import('jspdf')).default;

      // Ensure we capture the full scrollable area of the element
      const el = sheetRef.current;
      const imgData = await toPng(el, { 
        pixelRatio: 2, 
        backgroundColor: '#ffffff',
        width: el.scrollWidth,
        height: el.scrollHeight,
        style: {
          margin: '0', // Reset mx-auto which causes offsets in html-to-image
          transform: 'none'
        }
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Get exact image dimensions to prevent aspect ratio distortion or cutting
      const imgProps = pdf.getImageProperties(imgData);
      const a4Width = pdf.internal.pageSize.getWidth();
      const a4Height = pdf.internal.pageSize.getHeight();
      
      let pdfWidth = a4Width;
      let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // If the content is too tall for one A4 page, scale it down to fit height
      if (pdfHeight > a4Height) {
        pdfHeight = a4Height;
        pdfWidth = (imgProps.width * pdfHeight) / imgProps.height;
      }
      
      // Center horizontally if scaled down
      const xOffset = (a4Width - pdfWidth) / 2;
      
      pdf.addImage(imgData, 'PNG', xOffset, 0, pdfWidth, pdfHeight);
      pdf.save(`Connect_KR_Activation_${answers.fullName?.replace(/\s+/g, '_') || 'Sheet'}.pdf`);
    } catch (error) {
      console.error("PDF Export failed", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans print:p-0 print:bg-white">
      
      {/* Non-printable controls */}
      <div className="max-w-2xl mx-auto mb-8 flex justify-between items-center print:hidden">
        <Button variant="ghost" onClick={() => router.back()} className="text-ink/60">
          <ArrowLeft className="mr-2" size={16} /> 돌아가기
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => window.print()} variant="outline" className="border-signal text-signal hover:bg-signal/5">
            <Printer className="mr-2" size={16} /> 인쇄하기
          </Button>
          <Button onClick={handleExportPDF} className="bg-signal text-white" disabled={isExporting}>
            <Download className="mr-2" size={16} /> {isExporting ? '생성 중...' : 'PDF 다운로드'}
          </Button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div ref={sheetRef} className="max-w-2xl mx-auto border-4 border-black p-10 rounded-2xl print:border-0 print:p-0 bg-white">
        <div className="text-center border-b-2 border-black pb-6 mb-8">
          <h1 className="text-4xl font-black mb-2 tracking-tight">외국인 휴대폰 개통 안내서</h1>
          <p className="text-sm text-gray-400 font-medium mb-4">{ts("title")}</p>
          <p className="text-lg text-gray-800 font-bold">대리점 직원분께 이 화면을 보여주세요.</p>
          <p className="text-sm text-gray-500 font-medium">{ts("subtitle")}</p>
        </div>

        <div className="space-y-8">
          <section className="bg-green-50 p-6 rounded-xl border border-green-200">
            <div className="mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-green-900">
                <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span> 
                고객 인적사항
              </h2>
              <p className="text-sm text-green-700 ml-8 font-medium">Customer Information</p>
            </div>
            
            <ul className="space-y-4 text-lg font-medium">
              <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span className="w-40 shrink-0 text-gray-500">영문 이름 (Name)</span>
                <strong className="text-black">{answers.fullName || '미입력'}</strong>
              </li>
              <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span className="w-40 shrink-0 text-gray-500">국적 (Nationality)</span>
                <strong className="text-black">{answers.nationality || '미입력'}</strong>
              </li>
              <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span className="w-40 shrink-0 text-gray-500">생년월일 (DOB)</span>
                <strong className="text-black">{answers.dob || '미입력'}</strong>
              </li>
              <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span className="w-40 shrink-0 text-gray-500">비상 연락처 (Contact)</span>
                <strong className="text-black">{answers.contactNum || '미입력'}</strong>
              </li>
              <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span className="w-40 shrink-0 text-gray-500">한국 주소 (Address)</span>
                <strong className="text-black">{answers.address || '미입력 (Optional)'}</strong>
              </li>
              <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span className="w-40 shrink-0 text-gray-500">스마트폰 모델 (Model)</span>
                <strong className="text-black">{answers.phoneModel || '미입력'}</strong>
              </li>
              <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span className="w-40 shrink-0 text-gray-500">기기 식별(IMEI)</span>
                <strong className="text-black">{answers.imei || '미입력 (Optional)'}</strong>
              </li>
            </ul>
          </section>

          <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span> 
                고객님의 현재 상황
              </h2>
              <p className="text-sm text-gray-500 ml-8 font-medium">{ts("section1")}</p>
            </div>
            
            <ul className="space-y-6 text-lg font-medium">
              <li className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4">
                <div className="w-40 shrink-0">
                  <span className="text-gray-500 block">외국인등록증(ARC)</span>
                  <span className="text-gray-400 text-xs font-normal">Alien Registration Card</span>
                </div>
                <div>
                  <span className="font-bold text-black block">
                    {answers.arc === 'yes' ? '있음 (실물 보유)' : answers.arc === 'soon' ? '신청 중 (아직 없음)' : '없음 (여권만 보유)'}
                  </span>
                  <span className="text-gray-500 text-sm font-normal block mt-1">
                    {answers.arc === 'yes' ? ts("arc_yes") : answers.arc === 'soon' ? ts("arc_soon") : ts("arc_no")}
                  </span>
                </div>
              </li>
              <li className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4">
                <div className="w-40 shrink-0">
                  <span className="text-gray-500 block">한국 은행 계좌</span>
                  <span className="text-gray-400 text-xs font-normal">Korean Bank Account</span>
                </div>
                <div>
                  <span className="font-bold text-black block">
                    {answers.bank === 'yes' ? '있음' : '없음 (해외카드/현금 사용)'}
                  </span>
                  <span className="text-gray-500 text-sm font-normal block mt-1">
                    {answers.bank === 'yes' ? ts("bank_yes") : ts("bank_no")}
                  </span>
                </div>
              </li>
              <li className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4">
                <div className="w-40 shrink-0">
                  <span className="text-gray-500 block">체류 기간</span>
                  <span className="text-gray-400 text-xs font-normal">Duration of Stay</span>
                </div>
                <div>
                  <span className="font-bold text-black block">
                    {stayText}
                  </span>
                </div>
              </li>
            </ul>
          </section>

          <section className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                희망하는 가입 유형
              </h2>
              <p className="text-sm text-blue-600/70 ml-8 font-medium">Desired Plan Type</p>
            </div>
            
            <div className="text-lg font-bold text-blue-950 space-y-6">
              <div>
                <p>👉 "{planText} 가입을 원합니다."</p>
                {plan === 'mvno' && <p className="text-sm text-blue-700 font-normal mt-2 ml-6">(* 프로모션 할인이 적용되는 무약정 요금제를 찾고 있습니다.)</p>}
              </div>

              {/* User's explicit requests */}
              <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm mt-4">
                <p className="text-sm text-gray-500 mb-2">고객 희망 요금제 조건 (Customer's Request)</p>
                <ul className="space-y-2 text-base">
                  <li className="flex items-center gap-2"><span className="w-20 text-gray-400">데이터</span> <strong className="text-black">
                    {answers.data === 'light' ? '5GB 미만' : answers.data === 'medium' ? '10GB ~ 15GB' : answers.data === 'unlimited' ? '데이터 무제한' : '상담 요망'}
                  </strong></li>
                  <li className="flex items-center gap-2"><span className="w-20 text-gray-400">테더링</span> <strong className="text-black">
                    {answers.tethering === 'yes' ? '핫스팟/데이터 쉐어링 필요' : '필요 없음'}
                  </strong></li>
                  <li className="flex items-center gap-2"><span className="w-20 text-gray-400">전화/문자</span> <strong className="text-black">
                    {answers.calls === 'minimal' ? '최소한 (수신 위주)' : answers.calls === 'unlimited' ? '통화/문자 무제한' : '상담 요망'}
                  </strong></li>
                  <li className="flex items-center gap-2"><span className="w-20 text-gray-400">국제전화</span> <strong className="text-black">
                    {answers.intlCalls === 'yes' ? '고국으로의 국제전화 무료 제공 필요' : '필요 없음'}
                  </strong></li>
                  <li className="flex items-center gap-2"><span className="w-20 text-gray-400">통신망</span> <strong className="text-black">
                    {answers.network === '4g' ? '4G (LTE)' : answers.network === '5g' ? '5G' : '상담 요망'} 
                    {answers.carrier === 'skt' ? ' (SKT 선호)' : 
                     answers.carrier === 'kt' ? ' (KT 선호)' : 
                     answers.carrier === 'lgu' ? ' (LG U+ 선호)' : 
                     answers.carrier === 'mvno' ? ' (알뜰폰 선호)' : 
                     answers.carrier === 'prepaid' ? ' (선불폰 선호)' : 
                     answers.carrier === 'airport' ? ' (공항수령 선호)' : ''}
                  </strong></li>
                  <li className="flex items-center gap-2"><span className="w-20 text-gray-400">유심형태</span> <strong className="text-black">
                    {answers.simType === 'physical' ? '물리 유심 (USIM)' : answers.simType === 'esim' ? '이심 (eSIM)' : '가장 빠르고 저렴한 방식'}
                  </strong></li>
                  <li className="flex items-center gap-2"><span className="w-20 text-gray-400">결제수단</span> <strong className="text-black">
                    {answers.payment === 'card' ? '한국 신용/체크카드' : answers.payment === 'bank' ? '한국 통장 자동이체' : answers.payment === 'cash' ? '현금 또는 해외카드' : '상담 후 결정'}
                  </strong></li>
                </ul>
              </div>

              {/* API Recommended baseline (Optional reference for price) */}
              {planDetails && planDetails.specs && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
                  <p className="text-xs text-gray-400 mb-1">참고용: 현재 알뜰폰 최저가 시세 기준</p>
                  <p className="text-sm text-gray-600">
                    최소 {planDetails.price} 부터 시작 (스펙: {planDetails.specs.network} {planDetails.specs.data}, 통화 {planDetails.specs.calls})
                  </p>
                </div>
              )}
              
              <div className="mt-6">
                <p>
                  {answers.phone === 'byo' 
                    ? '👉 "기기는 제 개인 공기계를 사용할 예정입니다 (유심만 개통)."'
                    : '👉 "새로운 휴대폰 기기를 함께 구매(할부 등)하고 싶습니다."'}
                </p>
              </div>
            </div>
          </section>

          <section className="border-t-2 border-dashed border-gray-300 pt-8 mt-8">
            <h3 className="text-lg font-bold mb-1 text-gray-800">직원분께 드리는 당부 말씀</h3>
            <p className="text-xs text-gray-400 mb-3">Note to the store clerk</p>
            <p className="text-gray-600 leading-relaxed font-medium">
              안녕하세요, 이 안내서는 한국어 소통이 어려운 외국인 고객님을 돕기 위해 작성되었습니다.
              고객님이 보유하신 서류(여권/외국인등록증)와 체류 기간을 확인하시어, 
              <strong> 가장 조건에 맞는 요금제로 개통 안내</strong>를 부탁드립니다. 감사합니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
