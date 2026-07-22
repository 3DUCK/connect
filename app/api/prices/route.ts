import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Set caching to revalidate once a day (86400 seconds) to prevent scraping bans
export const revalidate = 86400;

const i18nDict: Record<string, Record<string, string>> = {
  ko: {
    airport: "공항 카운터 평균가, 총",
    major: "통신 3사 평균가, 총",
    esim: "글로벌 eSIM 평균가, 총",
    promo: "이벤트 특가",
    first: "첫",
    months: "개월",
    after: "이후",
    totalEst: "체류기간 총 예상",
    liveLowest: "Live 최저가",
    unlimited: "무제한",
    none: "없음",
    noContract: "무약정(위약금 0원)",
    contract24m: "24개월 약정"
  },
  en: {
    airport: "Airport counter avg, Total",
    major: "Major carrier avg, Total",
    esim: "Global eSIM avg, Total",
    promo: "Promo",
    first: "First",
    months: "mo",
    after: "then",
    totalEst: "Total est",
    liveLowest: "Live Lowest",
    unlimited: "Unlimited",
    none: "None",
    noContract: "No Contract (0 Penalty)",
    contract24m: "24mo Contract"
  },
  ja: {
    airport: "空港カウンター平均, 合計",
    major: "大手通信3社平均, 合計",
    esim: "グローバルeSIM平均, 合計",
    promo: "プロモ",
    first: "最初の",
    months: "ヶ月",
    after: "以降",
    totalEst: "滞在期間の予想合計",
    liveLowest: "Live最安値",
    unlimited: "無制限",
    none: "なし",
    noContract: "契約期間なし (違約金0円)",
    contract24m: "24ヶ月契約"
  },
  zh: {
    airport: "机场柜台平均, 总计",
    major: "三大运营商平均, 总计",
    esim: "全球eSIM平均, 总计",
    promo: "促销",
    first: "前",
    months: "个月",
    after: "之后",
    totalEst: "预计总额",
    liveLowest: "Live最低价",
    unlimited: "无限",
    none: "无",
    noContract: "无合约 (违约金0元)",
    contract24m: "24个月合约"
  },
  fr: {
    airport: "Moy. comptoir aéroport, Total",
    major: "Moy. opérateur principal, Total",
    esim: "Moy. eSIM mondiale, Total",
    promo: "Promo",
    first: "Premiers",
    months: "mois",
    after: "puis",
    totalEst: "Total estimé",
    liveLowest: "Le moins cher",
    unlimited: "Illimité",
    none: "Aucun",
    noContract: "Sans Engagement (0 frais)",
    contract24m: "Engagement 24 mois"
  }
};

function parseTotalCost($: any, durationMonths: number, t: Record<string, string>): { price: string, specs: any } | null {
  let bestPlan = "";
  let bestPlanSpecs = null;
  let lowestTotalCost = Infinity;

  $('.tit').each((i: number, el: any) => {
    if (i > 15) return false;
    const parentText = $(el).parent().text().replace(/\s+/g, ' ');
    const liText = $(el).closest('li').text().replace(/\s+/g, ' ');
    
    const promoPriceMatch = parentText.match(/월\s*([\d,]+)\s*원/);
    const promoDurationMatch = parentText.match(/(\d+)\s*개월\s*이후/);
    const regularPriceMatch = parentText.match(/이후\s*([\d,]+)\s*원/);

    if (promoPriceMatch && regularPriceMatch && promoDurationMatch) {
      const promoPrice = parseInt(promoPriceMatch[1].replace(/,/g, ''), 10);
      const regularPrice = parseInt(regularPriceMatch[1].replace(/,/g, ''), 10);
      const promoMonths = parseInt(promoDurationMatch[1], 10);

      let totalCost = 0;
      if (durationMonths <= promoMonths) {
        totalCost = promoPrice * durationMonths;
      } else {
        totalCost = (promoPrice * promoMonths) + (regularPrice * (durationMonths - promoMonths));
      }

      if (totalCost < lowestTotalCost) {
        lowestTotalCost = totalCost;
        bestPlan = `[${t.promo}] ${t.first} ${promoMonths}${t.months} ₩${promoPrice.toLocaleString()}, ${t.after} ₩${regularPrice.toLocaleString()} (${t.totalEst}: ₩${totalCost.toLocaleString()})`;
        
        const specMatch = liText.match(/데이터\s+(.*?)\s+통화\s+(.*?)\s+문자\s+(\S+)/);
        const networkMatch = liText.match(/\b(LTE|5G)\b/);
        if (specMatch) {
          const parseSpec = (val: string) => val === '무제한' ? t.unlimited : val;
          const parsedNetwork = networkMatch ? (networkMatch[1] === 'LTE' ? '4G LTE' : '5G') : '4G LTE';
          bestPlanSpecs = {
            network: parsedNetwork,
            data: parseSpec(specMatch[1]),
            calls: parseSpec(specMatch[2]),
            texts: parseSpec(specMatch[3]),
            contract: t.noContract
          };
        }
      }
    } else {
      const priceMatch = parentText.match(/([\d,]+)원/);
      if (priceMatch) {
         const price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
         if (price >= 5000) {
            const totalCost = price * durationMonths;
            if (totalCost < lowestTotalCost) {
               lowestTotalCost = totalCost;
               bestPlan = `[${t.liveLowest}] ₩${price.toLocaleString()} (${t.totalEst}: ₩${totalCost.toLocaleString()})`;
               
               const specMatch = liText.match(/데이터\s+(.*?)\s+통화\s+(.*?)\s+문자\s+(\S+)/);
               const networkMatch = liText.match(/\b(LTE|5G)\b/);
               if (specMatch) {
                 const parseSpec = (val: string) => val === '무제한' ? t.unlimited : val;
                 const parsedNetwork = networkMatch ? (networkMatch[1] === 'LTE' ? '4G LTE' : '5G') : '4G LTE';
                 bestPlanSpecs = {
                   network: parsedNetwork,
                   data: parseSpec(specMatch[1]),
                   calls: parseSpec(specMatch[2]),
                   texts: parseSpec(specMatch[3]),
                   contract: t.noContract
                 };
               }
            }
         }
      }
    }
  });
  return bestPlan ? { price: bestPlan, specs: bestPlanSpecs } : null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const durationStr = searchParams.get('duration') || '6months';
    const locale = searchParams.get('locale') || 'en';
    const t = i18nDict[locale] || i18nDict.en;

    const durationMap: Record<string, number> = { 
      '1month': 1, '2months': 2, '3months': 3, '6months': 6, '1year': 12, 'resident': 24 
    };
    const durationMonths = durationMap[durationStr] || 6;

    const prices: Record<string, string> = {
      prepaid_airport: `₩45,000 (${t.airport} ₩${(45000 * durationMonths).toLocaleString()})`,
      prepaid_online: "₩20,000",
      mvno: "₩15,000",
      major: `₩60,000 (${t.major} ₩${(60000 * durationMonths).toLocaleString()})`,
      esim: `₩20,000 (${t.esim} ₩${(20000 * durationMonths).toLocaleString()})`
    };

    const specsData: Record<string, any> = {
      prepaid_airport: { network: '4G LTE', data: '15GB + 3Mbps', calls: t.unlimited, texts: t.unlimited, contract: t.noContract },
      major: { network: '5G', data: '10GB + 1Mbps', calls: t.unlimited, texts: t.unlimited, contract: t.contract24m },
      esim: { network: '4G LTE', data: 'Daily 2GB + 512kbps', calls: t.none, texts: t.none, contract: t.noContract }
    };

    try {
      const res = await fetch('https://www.mvnohub.kr/user/index.do', {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ConnectKRBot/1.0;)' },
        next: { revalidate: 86400 }
      });
      if (res.ok) {
        const html = await res.text();
        const bestPlan = parseTotalCost(cheerio.load(html), durationMonths, t);
        if (bestPlan) {
           prices.mvno = bestPlan.price;
           if (bestPlan.specs) specsData.mvno = bestPlan.specs;
        }
      }
    } catch (e) {
      console.warn("MVNO scraping failed:", e);
    }

    try {
      const res2 = await fetch('https://www.mvnohub.kr/user/prpd/TblPrpdChrgeSnkList.do', {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ConnectKRBot/1.0;)' },
        next: { revalidate: 86400 }
      });
      if (res2.ok) {
        const html = await res2.text();
        const bestPlan = parseTotalCost(cheerio.load(html), durationMonths, t);
        if (bestPlan) {
           prices.prepaid_online = bestPlan.price;
           if (bestPlan.specs) specsData.prepaid_online = bestPlan.specs;
        }
      }
    } catch (e) {
      console.warn("Prepaid scraping failed:", e);
    }

    return NextResponse.json({ success: true, data: prices, specs: specsData, cachedAt: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch prices' }, { status: 500 });
  }
}
