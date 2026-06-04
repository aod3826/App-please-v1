# คลังภาพกิจกรรม — PWA Package

## โครงสร้างไฟล์

```
your-github-pages-repo/
├── index.html              ← หน้าหลัก (PWA พร้อมใช้)
├── manifest.json           ← PWA Manifest
├── sw.js                   ← Service Worker
├── offline.html            ← หน้าออฟไลน์
└── icons/
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    ├── icon-512x512.png
    ├── apple-touch-icon.png
    ├── favicon-32x32.png
    └── favicon-16x16.png
```

## วิธี Deploy บน GitHub Pages

1. คัดลอกไฟล์ทั้งหมดไปยัง root ของ GitHub Pages repo
2. สร้างโฟลเดอร์ `icons/` แล้วย้ายไฟล์ PNG ทั้งหมดเข้าไป
3. Push ขึ้น GitHub
4. เปิดเว็บผ่าน HTTPS (GitHub Pages รองรับ HTTPS อัตโนมัติ)

## ฟีเจอร์ PWA ที่เพิ่มมา

- ✅ Install Banner — แจ้งให้ผู้ใช้ "เพิ่มลงหน้าจอหลัก"
- ✅ Offline Support — Cache First strategy, แสดงหน้า offline.html เมื่อไม่มีเน็ต
- ✅ Service Worker — Cache static assets + API response
- ✅ Offline Indicator Bar — แถบแจ้งเตือนเมื่อออฟไลน์
- ✅ Auto Reload — โหลดใหม่อัตโนมัติเมื่อกลับมาออนไลน์
- ✅ Icons ทุกขนาด — รองรับ Android, iOS, Windows
- ✅ Apple PWA meta tags — รองรับ Add to Home Screen บน iOS Safari
