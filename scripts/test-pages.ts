import "dotenv/config";

async function testPages() {
  try {
    // 1. Get Black Clover MN chapter ID
    const res = await fetch(`https://api.mangadex.org/manga/e7eabe96-aa17-476f-b431-2497d5e9d060/feed?limit=1&translatedLanguage[]=mn`);
    const data = await res.json();
    const chapterId = data.data[0].id;
    console.log("Chapter:", chapterId);

    // 2. Get pages
    const serverRes = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`);
    const serverData = await serverRes.json();
    console.log("Server base URL:", serverData.baseUrl);
    console.log("Hash:", serverData.chapter.hash);
    console.log("Pages:", serverData.chapter.data.slice(0, 3));
    
    // Page URL format: ${baseUrl}/data/${hash}/${filename}
    const pageUrl = `${serverData.baseUrl}/data/${serverData.chapter.hash}/${serverData.chapter.data[0]}`;
    console.log("Example Page URL:", pageUrl);
  } catch(e) { console.error(e); }
}
testPages();
