import "dotenv/config";

async function checkIds() {
  const ids = [
    '29a2a045-0491-49f5-a7c7-7f5c866c6add',
    'b9170530-88ff-4e39-8f68-e11a17a89770',
    'e7eabe96-aa17-476f-b431-2497d5e9d060'
  ];
  for (const id of ids) {
      const res = await fetch(`https://api.mangadex.org/manga/${id}`);
      const data = await res.json();
      console.log(data?.data?.attributes?.title);
  }
}
checkIds();
