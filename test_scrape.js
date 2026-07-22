const cheerio = require('cheerio');
async function s() { 
  const res = await fetch('https://www.mvnohub.kr/user/index.do'); 
  const html = await res.text(); 
  const $ = cheerio.load(html); 
  $('.tit').each((i, el) => { 
    if (i>3) return false; 
    const li = $(el).closest('li'); 
    console.log('--- LI', i, '---');
    li.find('img, span, div').each((j, sub) => {
        const alt = $(sub).attr('alt');
        if (alt) console.log('Found alt text:', alt);
    });
  }); 
} 
s();
