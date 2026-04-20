import fs from 'fs';
import Papa from 'papaparse';

const libraries = [
{"name":"Atatürk Kitaplığı (Merkez Kütüphane)","district":"Beyoğlu"},
{"name":"Kadın Eserleri Kütüphanesi","district":"Fatih"},{"name":"Barış Manço Kütüphanesi","district":"Esenler"},
{"name":"Eyüp Sultan Kütüphanesi","district":"Eyüpsultan"},{"name":"Ahmet Süheyl Ünver Kütüphanesi","district":"Ümraniye"},
{"name":"Osman Nuri Ergin Kütüphanesi","district":"Güngören"},{"name":"İdris Güllüce Kütüphanesi","district":"Tuzla"},
{"name":"Muallim Cevdet Kütüphanesi","district":"Kartal"},{"name":"Halil İnalcık Kütüphanesi","district":"Kartal"},
{"name":"Sesli Kütüphane","district":"Eyüpsultan"},{"name":"Erdem Bayazıt Kütüphanesi","district":"Eyüpsultan"},
{"name":"Metin And Kütüphanesi","district":"K.Çekmece"},{"name":"Ahmet Kabaklı Kütüphanesi","district":"Fatih"},
{"name":"Rasim Özdenören Kütüphanesi","district":"Başakşehir"},{"name":"Okçular Tekkesi Kütüphanesi","district":"Beyoğlu"},
{"name":"Fatma Aliye Kütüphanesi","district":"Çekmeköy"},{"name":"Nasrettin Hoca Çocuk Kütüphanesi","district":"Bağcılar"},
{"name":"Hacı Bektaşi Veli Kütüphanesi","district":"Sultangazi"},{"name":"İlhan Varank Kütüphanesi","district":"Sultanbeyli"},
{"name":"Ayşe Hatun Halk Kütüphanesi","district":"Fatih"},{"name":"Atatürk Müzesi Kütüphanesi","district":"Şişli"},
{"name":"Afife Batur Kütüphanesi","district":"Kadıköy"},{"name":"Ahmed Arif Halk Kütüphanesi","district":"Sultangazi"},
{"name":"Ödünç Kütüphane","district":"Şişli"},{"name":"Sezai Karakoç Kütüphanesi","district":"Güngören"},
{"name":"Rıfat Ilgaz Kütüphanesi","district":"Arnavutköy"},{"name":"Fakir Baykurt Kütüphanesi","district":"Avcılar"},
{"name":"Özgen Berkol Doğan Kütüphanesi","district":"Kadıköy"},{"name":"Kütüphane Troleybüs","district":"Fatih"},
{"name":"Evliya Çelebi Kütüphanesi","district":"Bayrampaşa"},{"name":"Gülten Akın Kütüphanesi","district":"Esenyurt"},
{"name":"Peyami Safa Kütüphanesi","district":"Beyoğlu"},{"name":"Yaşar Kemal Kütüphanesi","district":"Sancaktepe"},
{"name":"Sabahattin Eyüboğlu Kütüphanesi","district":"Avcılar"},{"name":"İPA İstanbul Kitaplığı","district":"Bakırköy"},
{"name":"Atilla İlhan Kütüphanesi","district":"Küçükçekmece"}
];

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function fetchCoords() {
    const fetch = globalThis.fetch;
    const dict: Record<string, any> = {};
    for (let lib of libraries) {
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(lib.district + ', İstanbul')}&limit=1`;
            const res = await fetch(url, { headers: { 'Accept-Language': 'tr', 'User-Agent': 'KulturRotaApp/1.0' } });
            const data = await res.json();
            if (data && data.length > 0) {
                // adding slight random offset to district center so they don't overlap completely
                const offsetLat = (Math.random() - 0.5) * 0.020;
                const offsetLon = (Math.random() - 0.5) * 0.020;
                dict[lib.name] = { 
                    lat: parseFloat(data[0].lat) + offsetLat, 
                    lon: parseFloat(data[0].lon) + offsetLon 
                };
            }
        } catch (e) {
            console.error('Error fetching', lib.name, e);
        }
        await sleep(1100);
    }
    fs.writeFileSync('coords.json', JSON.stringify(dict, null, 2));
    console.log("Done");
}
fetchCoords();
