import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import Papa from 'papaparse';
import { ArrowLeft, Loader2, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

// Leaflet varsayılan ikon yollarını düzeltme
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const istanbulCoords: [number, number] = [41.0082, 28.9784];

const knownLocations: Record<string, {lat: number, lon: number}> = {
    // ... bilinen lokasyonlar (önceki veriler aynı şablonda korunacak ama yer israfı olmasın diye burada)
    "Anadolu Hisarı Müzesi": {lat: 41.0822, lon: 29.0673},
    "Artİstanbul Feshane": {lat: 41.0461, lon: 28.9351},
    "Aşiyan Müzesi": {lat: 41.0815, lon: 29.0555},
    "Atatürk Müzesi": {lat: 41.0581, lon: 28.9873},
    "Bakırköy Sanat": {lat: 40.9785, lon: 28.8752},
    "Baruthane Müze": {lat: 40.9754, lon: 28.8606},
    "Bebek Sarnıcı Sanat Galerisi": {lat: 41.0772, lon: 29.0436},
    "Bulgur Palas Müzesi": {lat: 41.0086, lon: 28.9458},
    "Casa Botter Sanat Galerisi": {lat: 41.0286, lon: 28.9747},
    "Cendere Sanat Müzesi": {lat: 41.0984, lon: 28.9756},
    "Cumhuriyet Müzesi": {lat: 41.0369, lon: 28.9850},
    "Çocuk Bilim Merkezi": {lat: 40.9933, lon: 29.0444},
    "Doğa  ve Bilim Müzesi": {lat: 41.1089, lon: 29.0800},
    "Dijital Sanatlar Müzesi": {lat: 41.1089, lon: 29.0800},
    "Gülhane Sarnıcı": {lat: 41.0122, lon: 28.9814},
    "Habitat Sanat": {lat: 41.0600, lon: 28.9878},
    "Haliç Sanat 1": {lat: 41.0250, lon: 28.9500},
    "Haliç Sanat 2": {lat: 41.0255, lon: 28.9510},
    "Haliç Sanat 3": {lat: 41.0260, lon: 28.9520},
    "İBB Belgradkapı Kara Surları Ziyaretçi Merkezi": {lat: 41.0000, lon: 28.9222},
    "İBB Mevlanakapı Kara Surları Ziyaretçi Merkezi": {lat: 41.0056, lon: 28.9250},
    "İklim Müzesi": {lat: 40.9935, lon: 29.0446},
    "İstanbul Tasarım Müzesi": {lat: 41.0167, lon: 28.9667},
    "İstanbul Sanat Müzesi": {lat: 41.0283, lon: 28.9731},
    "İtfaiye Müzesi": {lat: 41.0458, lon: 29.0083},
    "Kağıthane Sanat": {lat: 41.0833, lon: 28.9667},
    "Karikatür ve Mizah Müzesi": {lat: 40.9931, lon: 29.0442},
    "Kemal Sunal Müzesi": {lat: 40.9722, lon: 29.0556},
    "Maltepe Sanat": {lat: 40.9222, lon: 29.1333},
    "Mecidiyeköy Sanat Galerisi": {lat: 41.0667, lon: 28.9917},
    "Saraçhane Sergi Salonu": {lat: 41.0144, lon: 28.9536},
    "Taş Mektep Müze": {lat: 40.8667, lon: 29.1167},
    "Tekfur Sarayı Müzesi": {lat: 41.0333, lon: 28.9389},
    "Yerebatan Sarnıcı Müzesi": {lat: 41.0083, lon: 28.9783},
    
    // Kütüphaneler
    "Atatürk Kitaplığı (Merkez Kütüphane)": { lat: 41.032768, lon: 28.967636 },
    "Kadın Eserleri Kütüphanesi": { lat: 41.004513, lon: 28.977416 },
    "Barış Manço Kütüphanesi": { lat: 41.044314, lon: 28.881740 },
    "Eyüp Sultan Kütüphanesi": { lat: 41.048497, lon: 28.929621 },
    "Ahmet Süheyl Ünver Kütüphanesi": { lat: 41.022894, lon: 29.096939 },
    "Osman Nuri Ergin Kütüphanesi": { lat: 41.017126, lon: 28.863581 },
    "İdris Güllüce Kütüphanesi": { lat: 40.822930, lon: 29.308048 },
    "Muallim Cevdet Kütüphanesi": { lat: 40.892193, lon: 29.182453 },
    "Halil İnalcık Kütüphanesi": { lat: 40.879727, lon: 29.188465 },
    "Sesli Kütüphane": { lat: 41.049842, lon: 28.929592 },
    "Erdem Bayazıt Kütüphanesi": { lat: 41.039739, lon: 28.925979 },
    "Metin And Kütüphanesi": { lat: 40.956662, lon: 28.816111 },
    "Ahmet Kabaklı Kütüphanesi": { lat: 41.001619, lon: 28.966412 },
    "Rasim Özdenören Kütüphanesi": { lat: 41.113366, lon: 28.803734 },
    "Okçular Tekkesi Kütüphanesi": { lat: 41.031376, lon: 28.982186 },
    "Fatma Aliye Kütüphanesi": { lat: 41.034690, lon: 29.164200 },
    "Nasrettin Hoca Çocuk Kütüphanesi": { lat: 41.037876, lon: 28.853657 },
    "Hacı Bektaşi Veli Kütüphanesi": { lat: 41.114278, lon: 28.867096 },
    "İlhan Varank Kütüphanesi": { lat: 40.972130, lon: 29.266092 },
    "Ayşe Hatun Halk Kütüphanesi": { lat: 41.015735, lon: 28.980523 },
    "Atatürk Müzesi Kütüphanesi": { lat: 41.061780, lon: 28.990197 },
    "Afife Batur Kütüphanesi": { lat: 40.999072, lon: 29.017668 },
    "Ahmed Arif Halk Kütüphanesi": { lat: 41.106896, lon: 28.868200 },
    "Ödünç Kütüphane": { lat: 41.073445, lon: 28.978007 },
    "Sezai Karakoç Kütüphanesi": { lat: 41.020844, lon: 28.881035 },
    "Rıfat Ilgaz Kütüphanesi": { lat: 41.188151, lon: 28.750024 },
    "Fakir Baykurt Kütüphanesi": { lat: 40.974064, lon: 28.712534 },
    "Özgen Berkol Doğan Kütüphanesi": { lat: 40.984421, lon: 29.020365 },
    "Kütüphane Troleybüs": { lat: 41.010976, lon: 28.981392 },
    "Evliya Çelebi Kütüphanesi": { lat: 41.043878, lon: 28.904689 },
    "Gülten Akın Kütüphanesi": { lat: 41.041442, lon: 28.670563 },
    "Peyami Safa Kütüphanesi": { lat: 41.021284, lon: 28.964769 },
    "Yaşar Kemal Kütüphanesi": { lat: 40.980655, lon: 29.238720 },
    "Sabahattin Eyüboğlu Kütüphanesi": { lat: 40.977248, lon: 28.717084 },
    "İPA İstanbul Kitaplığı": { lat: 40.979671, lon: 28.873456 },
    "Atilla İlhan Kütüphanesi": { lat: 40.994486, lon: 28.774122 }
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function geocodeAddress(name: string, district: string) {
    if (knownLocations[name]) {
        return knownLocations[name];
    }

    const nameQuery = `${name}, İstanbul`;
    const districtQuery = `${district}, İstanbul`;
    
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(nameQuery)}&limit=1`;

    try {
        const response = await fetch(url, { headers: { 'Accept-Language': 'tr' } });
        const data = await response.json();
        
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
        }
        
        await sleep(1000);
        const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(districtQuery)}&limit=1`;
        const fallbackResponse = await fetch(fallbackUrl, { headers: { 'Accept-Language': 'tr' } });
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData && fallbackData.length > 0) {
            const offsetLat = (Math.random() - 0.5) * 0.020;
            const offsetLon = (Math.random() - 0.5) * 0.020;
            return { 
                lat: parseFloat(fallbackData[0].lat) + offsetLat, 
                lon: parseFloat(fallbackData[0].lon) + offsetLon 
            };
        }
    } catch (error) {
        console.error("Geocoding hatası:", error);
    }
    return null;
}

// Müzelere özel harita ikonu (SVG tabanlı)
const museumIconLight = L.divIcon({
    html: `<div style="background-color: #4f46e5; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"></line><line x1="6" x2="6" y1="18" y2="11"></line><line x1="10" x2="10" y1="18" y2="11"></line><line x1="14" x2="14" y1="18" y2="11"></line><line x1="18" x2="18" y1="18" y2="11"></line><polygon points="12 2 20 7 4 7"></polygon></svg></div>`,
    className: 'custom-museum-marker light',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    tooltipAnchor: [0, -36]
});

// Koyu tema pim ikonu (biraz daha farklı çerçeve)
const museumIconDark = L.divIcon({
    html: `<div style="background-color: #818cf8; color: #1e1e2f; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #1e1e2f; box-shadow: 0 4px 6px rgba(0,0,0,0.4);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"></line><line x1="6" x2="6" y1="18" y2="11"></line><line x1="10" x2="10" y1="18" y2="11"></line><line x1="14" x2="14" y1="18" y2="11"></line><line x1="18" x2="18" y1="18" y2="11"></line><polygon points="12 2 20 7 4 7"></polygon></svg></div>`,
    className: 'custom-museum-marker dark',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    tooltipAnchor: [0, -36]
});

// Kütüphanelere özel ikon (Açık - Turkuaz)
const libraryIconLight = L.divIcon({
    html: `<div style="background-color: #0d9488; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg></div>`,
    className: 'custom-library-marker light',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    tooltipAnchor: [0, -36]
});

// Kütüphanelere özel ikon (Koyu - Açık Turkuaz)
const libraryIconDark = L.divIcon({
    html: `<div style="background-color: #2dd4bf; color: #1e1e2f; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #1e1e2f; box-shadow: 0 4px 6px rgba(0,0,0,0.4);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg></div>`,
    className: 'custom-library-marker dark',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    tooltipAnchor: [0, -36]
});

export default function MapPage() {
    const navigate = useNavigate();
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const [status, setStatus] = useState("Harita Yükleniyor...");
    const [isLoaded, setIsLoaded] = useState(false);
    
    // Tema yönetimi hook'unu içeriye alıyoruz
    const { isDark, toggleTheme } = useTheme();

    // Tema değiştiğinde Harita Katmanını Güncelleme (Stadia Alidade Smooth / Dark)
    useEffect(() => {
        if (tileLayerRef.current) {
            const newTileUrl = isDark 
                ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
                : 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png';
            
            tileLayerRef.current.setUrl(newTileUrl);
            
            // Tüm markerların ikonlarını da temaya (ve tiplere) göre güncelle
            markersRef.current.forEach((marker: any) => {
                 const isLibrary = marker.options?.isLibrary; // Özel flag
                 if (isLibrary) {
                     marker.setIcon(isDark ? libraryIconDark : libraryIconLight);
                 } else {
                     marker.setIcon(isDark ? museumIconDark : museumIconLight);
                 }
            });
        }
    }, [isDark]);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        // Initialize map
        mapInstance.current = L.map(mapRef.current).setView(istanbulCoords, 11);
        
        // İlk yüklemede mevcut temaya uygun katman URL'si seçilir
        const initialTileUrl = isDark 
                ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
                : 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png';

        tileLayerRef.current = L.tileLayer(initialTileUrl, {
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom: 20
        }).addTo(mapInstance.current);

        let csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTFybZkkYn2RsnmFSaNME3WbyJkXoWU54o4hiGKUbMQ6Ijd8m_wO2nK5sRQQnd93XtQS0poQBGBXgGX/pubhtml';
        // CSV formatına çevir ve tarayıcının eski veriyi hatırlamasını (cache) engellemek için zaman damgası ekle
        csvUrl = csvUrl.replace('/pubhtml', '/pub?output=csv') + '&t=' + new Date().getTime();

        setStatus("Veriler İndiriliyor...");

        Papa.parse(csvUrl, {
            download: true,
            header: true,
            complete: async function(results) {
                const data = results.data as any[];
                if (!data || data.length === 0) return;

                // Dinamik kolon isimleri bulma ("Adı" veya "Müze Adı", "Mekan Türü", vb.)
                const firstRowKeys = Object.keys(data[0] || {});
                const nameKey = firstRowKeys.find(k => k.toLowerCase().includes('adı')) || 'Adı';
                const typeKey = firstRowKeys.find(k => k.toLowerCase().includes('türü')) || 'Mekan Türü';
                
                let targetData = data.filter(row => row[nameKey] && row[nameKey].trim() !== '');

                let loadedCount = 0;
                const total = targetData.length;
                
                for (const row of targetData) {
                    const name = row[nameKey];
                    const district = row['İlçe Adı'] || '';
                    const address = row['Adres'] || district;
                    const phone = row['Telefon'] || 'Belirtilmemiş';
                    const hours = row['Çalışma Saatleri'] || 'Belirtilmemiş';
                    const mediaUrl = row['Medya'] || ''; // Medya sütunundan (görsel veya video) linki alıyoruz
                    const type = row[typeKey] || ''; // Tür bilgisi

                    // Türüne göre sembol seçimi
                    const isLibrary = type.toLowerCase().includes('kütüphane');
                    const markerIcon = isLibrary 
                        ? (document.documentElement.classList.contains('dark') ? libraryIconDark : libraryIconLight)
                        : (document.documentElement.classList.contains('dark') ? museumIconDark : museumIconLight);

                    const coords = await geocodeAddress(name, district);
                    
                    if (coords && mapInstance.current) {
                        let mediaHtml = '';
                        if (mediaUrl) {
                            // YouTube linki kontrolü
                            const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
                            const ytMatch = mediaUrl.match(ytRegex);
                            
                            if (ytMatch && ytMatch[1]) {
                                // YouTube Iframe
                                const videoId = ytMatch[1];
                                mediaHtml = `<iframe width="100%" height="150" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 8px; margin-bottom: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></iframe>`;
                            } else {
                                // Standart Resim
                                mediaHtml = `<img src="${mediaUrl}" alt="${name}" style="width: 100%; height: 140px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" referrerPolicy="no-referrer" />`;
                            }
                        }

                        // Popup tasarımını isDark state'ine dinamik kalması karmaşık olduğu için native css ile koyu temaya duyarlı sınıf bazlı veya inline style ile yapacağız
                        // Burada standart bir beyaz popup bırakabiliriz (Leaflet popupları genelde beyazdır, dark mode CSS ile ezilebilir).
                        const popupHtml = `
                            <div style="font-family: sans-serif; min-width: 260px; color: #1e293b;">
                                ${mediaHtml}
                                <h3 style="margin: 0 0 8px 0; color: #4f46e5; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; font-size: 16px;">${name}</h3>
                                <p style="margin: 6px 0; font-size: 13px;"><strong>Adres:</strong> ${address}</p>
                                <p style="margin: 6px 0; font-size: 13px;"><strong>Telefon:</strong> ${phone}</p>
                                <p style="margin: 6px 0; font-size: 13px;"><strong>Saatler:</strong> ${hours}</p>
                            </div>
                        `;

                        const tooltipHtml = `
                            <div style="text-align: center; font-family: sans-serif;">
                                <strong>${name}</strong><br>
                                <span style="font-size: 11px; opacity: 0.8; display: block; margin-bottom: 2px;">${isLibrary ? 'Kütüphane' : 'Müze / Mekan'}</span>
                                ${district}<br>
                                ${hours !== 'Belirtilmemiş' ? hours : ''}
                            </div>
                        `;
                        
                        const marker = L.marker([coords.lat, coords.lon], { 
                            icon: markerIcon,
                            isLibrary: isLibrary // Özel flag ekledik
                        } as any)
                            .bindTooltip(tooltipHtml, { direction: 'top', offset: [0, -10] })
                            .bindPopup(popupHtml);
                            
                        markersRef.current.push(marker);
                    }
                    
                    loadedCount++;
                    setStatus(`Harita Hazırlanıyor... (${loadedCount}/${total})`);
                    
                    if (!knownLocations[name]) {
                        await sleep(1100);
                    }
                }
                
                if (mapInstance.current) {
                    const group = L.featureGroup(markersRef.current).addTo(mapInstance.current);
                    if (markersRef.current.length > 0) {
                        mapInstance.current.fitBounds(group.getBounds(), { padding: [30, 30] });
                    }
                }
                
                setStatus("Yükleme Tamamlandı");
                setIsLoaded(true);
            },
            error: function(error) {
                console.error("CSV okuma hatası:", error);
                setStatus("Veri Çekme Hatası!");
            }
        });

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []); // isDark array'de yok, sadece init

    return (
        <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm z-[1000] relative transition-colors duration-500">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300"
                        title="Ana Sayfaya Dön"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">İstanbul Kültür Haritası</h1>
                </div>

                <div className="flex items-center gap-4">
                    {!isLoaded ? (
                        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full text-sm font-medium border border-amber-200 dark:border-amber-800 transition-colors">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="hidden sm:inline">{status}</span>
                        </div>
                    ) : (
                       <div className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                          {markersRef.current.length} Mekan Listelendi
                       </div>
                    )}
                    
                    {/* Harita Tema Değiştirici */}
                    <button 
                        onClick={toggleTheme}
                        className="p-2 ml-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all border border-transparent dark:border-white/10"
                        title={isDark ? "Açık Tema (Alidade Smooth)" : "Koyu Tema (Alidade Smooth Dark)"}
                    >
                        {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
                    </button>
                </div>
            </header>

            {/* Map Container */}
            <div className="flex-1 w-full relative z-0">
                <div ref={mapRef} className="absolute inset-0 w-full h-full" />
            </div>
            
            {/* Global Popup CSS ezilmeleri (Harici CSS dosyasıyla uğraşmadan dark mode desteği) */}
            <style>{`
               .dark .leaflet-popup-content-wrapper,
               .dark .leaflet-popup-tip,
               .dark .leaflet-tooltip {
                   background: #1e293b;
                   color: #f8fafc;
                   border-color: #334155;
               }
               .dark .leaflet-popup-content h3 {
                   color: #818cf8 !important;
                   border-bottom-color: #334155 !important;
               }
               .dark .leaflet-popup-content p, .dark .leaflet-popup-content strong {
                   color: #cbd5e1 !important;
               }
            `}</style>
        </div>
    );
}
