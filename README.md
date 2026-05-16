# 📸 ระบบคลังรูปภาพกิจกรรม (Activity Photo Gallery)

> ระบบแสดงรูปภาพกิจกรรมขององค์กร บน **GitHub Pages** (Frontend)  
> เชื่อมต่อกับ **Google Sheets + Apps Script** (Backend)  
> รองรับมือถือ · Lightbox · ค้นหา · กรองหมวดหมู่ · ซ่อน/แสดงรูปได้

---

## 📁 โครงสร้างไฟล์

```
📦 gallery-system/
 ├── 📄 Code.gs        ← Google Apps Script (Backend)
 ├── 📄 index.html     ← หน้าเว็บ GitHub Pages (Frontend)
 └── 📄 README.md      ← คู่มือนี้
```

---

## 🗂️ ข้อมูลสำคัญของระบบ

| รายการ | ค่า |
|--------|-----|
| **Google Spreadsheet ID** | `1gNSiEpDvCcPAafZo4eMzKvMPcpEQe7IGnsUrzQA4mPg` |
| **Google Drive Folder ID** | `1RiTa1GkymfQXaY33cDnUiOpby7Y2Cpq8` |
| **Web App URL (GAS)** | `https://script.google.com/macros/s/AKfycby.../exec` |
| **ชื่อแผ่นงาน** | `Gallery` |

---

## 🚀 ขั้นตอนการติดตั้ง (ทำตามลำดับ)

### ขั้นที่ 1 — เตรียม Google Spreadsheet

1. เปิด Google Spreadsheet ด้วย ID ด้านบน  
   👉 `https://docs.google.com/spreadsheets/d/1gNSiEpDvCcPAafZo4eMzKvMPcpEQe7IGnsUrzQA4mPg`

2. ตรวจสอบว่ามีแผ่นงาน (Sheet) ชื่อ **`Gallery`** อยู่  
   ถ้ายังไม่มี ให้คลิกปุ่ม **`+`** ด้านล่างซ้าย แล้วเปลี่ยนชื่อเป็น `Gallery`

> ⚠️ ชื่อแผ่นงานต้องตรงกับตัวพิมพ์ใหญ่-เล็กทุกตัว (`Gallery` ไม่ใช่ `gallery`)

---

### ขั้นที่ 2 — ติดตั้ง Apps Script (Backend)

1. ใน Spreadsheet ไปที่เมนู  
   **ส่วนขยาย (Extensions) → Apps Script**

2. ลบโค้ดเดิมทั้งหมดใน `Code.gs` ออก

3. **วางโค้ดจากไฟล์ `Code.gs`** ที่ให้มาทั้งหมด แล้วกด **💾 Save** (`Ctrl+S`)

4. ตั้งชื่อโปรเจกต์ (บนซ้าย) เป็น **`GalleryBackend`** หรือชื่อที่ต้องการ

---

### ขั้นที่ 3 — รัน `setupSheets()` ครั้งแรก

> ทำครั้งเดียวตอนติดตั้ง เพื่อเตรียม Sheet ให้พร้อมใช้งาน

1. ใน Apps Script Editor ด้านบน เลือกฟังก์ชัน **`setupSheets`**  
   จาก Dropdown ที่แสดงชื่อฟังก์ชัน

2. กดปุ่ม **▶ Run**

3. ระบบจะขอสิทธิ์ครั้งแรก → กด **Review permissions → Allow**

4. เมื่อเสร็จ จะมี Popup แจ้งผลทุกขั้นตอน เช่น:

   ```
   ✅ สร้างแผ่นงาน 'Gallery' ใหม่
   ✅ ตั้งหัวตาราง + จัดรูปแบบเรียบร้อย
   ✅ Freeze แถวหัวตาราง + คอลัมน์แรกแล้ว
   ✅ ตั้ง Dropdown Validation คอลัมน์ Status
   ✅ ตั้ง Conditional Formatting
   ✅ ป้องกันแถว Header
   ✅ Drive Folder พบแล้ว: "ชื่อ Folder ของคุณ"
   ✅ ตั้ง Named Range 'GalleryData'
   ```

---

### ขั้นที่ 4 — สร้างข้อมูลตัวอย่าง *(ไม่บังคับ)*

> เพื่อทดสอบระบบก่อนกรอกข้อมูลจริง

1. เปลี่ยน Dropdown เป็นฟังก์ชัน **`createSampleData`**
2. กด **▶ Run**
3. ระบบจะสร้างข้อมูลตัวอย่าง **8 แถว** ใน Sheet Gallery โดยอัตโนมัติ

> ⚠️ ฟังก์ชันนี้จะ **ลบข้อมูลเดิมทั้งหมด** ใน Gallery Sheet — อย่ารันหากมีข้อมูลจริงแล้ว

---

### ขั้นที่ 5 — Deploy Web App (รับ URL สำหรับ Frontend)

1. ใน Apps Script Editor กดปุ่ม **Deploy → New deployment**

2. ตั้งค่าดังนี้:

   | ฟิลด์ | ค่า |
   |-------|-----|
   | Select type | **Web app** |
   | Description | `Gallery API v1` (หรืออะไรก็ได้) |
   | Execute as | **Me** |
   | Who has access | **Anyone** |

3. กด **Deploy** → คัดลอก **Web App URL** ที่ได้

   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

> 📌 URL นี้ได้ตั้งค่าไว้ใน `index.html` แล้ว ไม่ต้องแก้ไขอีก

---

### ขั้นที่ 6 — ทดสอบ Backend

ทดสอบเปิด Web App URL ในเบราว์เซอร์โดยตรง ควรได้ผลประมาณนี้:

```json
{
  "status": "success",
  "count": 7,
  "data": [
    {
      "id": 2,
      "date": "01/05/2567",
      "title": "วันแรงงานแห่งชาติ",
      "description": "กิจกรรมวันแรงงาน ณ ลานกลางแจ้ง",
      "category": "งานประเพณี",
      "imageUrl": "https://...",
      "status": "แสดง"
    }
  ]
}
```

> ถ้าเห็น JSON ด้านบน แสดงว่า Backend ทำงานถูกต้องแล้ว ✅

---

### ขั้นที่ 7 — Deploy Frontend บน GitHub Pages

1. สร้าง Repository ใหม่บน GitHub (ตั้งชื่อ เช่น `activity-gallery`)

2. อัปโหลดไฟล์ **`index.html`** เข้าไป

   ```bash
   git init
   git add index.html
   git commit -m "first deploy: gallery frontend"
   git branch -M main
   git remote add origin https://github.com/your-username/activity-gallery.git
   git push -u origin main
   ```

3. เปิด GitHub Pages:  
   **Settings → Pages → Source: Deploy from branch → main / (root) → Save**

4. รอ 1–2 นาที แล้วเปิดเว็บที่:  
   `https://your-username.github.io/activity-gallery`

---

## 📊 โครงสร้างข้อมูลใน Google Sheet

| คอลัมน์ | ชื่อ | ประเภท | ตัวอย่าง | หมายเหตุ |
|---------|------|--------|---------|---------|
| **A** | Date | ข้อความ | `15/08/2567` | รูปแบบ dd/MM/yyyy (พ.ศ.) |
| **B** | Title | ข้อความ | `อบรมเกษตรกรรุ่นใหม่` | ชื่อกิจกรรม แสดงบนการ์ด |
| **C** | Description | ข้อความ | `โครงการพัฒนาเกษตรกร...` | รายละเอียด แสดงใน Lightbox |
| **D** | Category | ข้อความ | `อบรม/สัมมนา` | ใช้สร้างปุ่มกรองอัตโนมัติ |
| **E** | ImageURL | URL | `https://drive.google.com/...` | รองรับ Google Drive / URL ตรง |
| **F** | Status | Dropdown | `แสดง` หรือ `ซ่อน` | `ซ่อน` = ไม่แสดงบนเว็บ |

---

## 🖼️ วิธีเพิ่มรูปภาพจาก Google Drive

### วิธีที่ 1 — แชร์ไฟล์รูปจาก Drive

1. อัปโหลดรูปเข้า Google Drive Folder ID: `1RiTa1GkymfQXaY33cDnUiOpby7Y2Cpq8`
2. คลิกขวาที่รูป → **Share → Anyone with the link → Copy link**
3. วาง URL ลงใน Column E ได้เลย ระบบจะแปลงให้อัตโนมัติ

```
# ลิงก์ที่คัดลอกมา (ใส่ได้เลย)
https://drive.google.com/file/d/1ABCdef.../view?usp=sharing

# ระบบแปลงเป็น (อัตโนมัติ)
https://drive.google.com/thumbnail?id=1ABCdef...&sz=w800
```

### วิธีที่ 2 — ใช้ URL รูปภาพโดยตรง

วาง URL ตรงๆ ได้เลย เช่น:
```
https://example.com/images/activity.jpg
```

---

## 🔧 การอัปเดตโค้ด (หลังจาก Deploy แล้ว)

> ⚠️ สำคัญมาก — ห้ามกด "Edit existing deployment" เด็ดขาด เพราะจะทำให้ URL เปลี่ยน

เมื่อแก้ไข `Code.gs` ให้ทำดังนี้:

```
Deploy → Manage deployments → เลือก deployment เดิม
→ แก้ไขไอคอน ✏️ → Version: "New version" → Deploy
```

URL เดิมจะยังใช้งานได้ต่อเนื่อง ✅

---

## 🐛 การแก้ปัญหาที่พบบ่อย

### ❌ หน้าเว็บแสดง "ไม่สามารถโหลดข้อมูลได้"

| สาเหตุ | วิธีแก้ |
|--------|--------|
| Web App URL ผิด | ตรวจสอบ `GAS_URL` ใน `index.html` |
| Who has access ไม่ใช่ "Anyone" | Redeploy ใหม่ ตั้งค่า Anyone |
| ชื่อ Sheet ผิด | ต้องเป็น `Gallery` ตรงตัวพิมพ์ |
| ยังไม่ได้ Allow Permission | รัน `setupSheets()` แล้ว Allow ใหม่ |

### ❌ รูปภาพไม่แสดง (กล่องว่าง)

| สาเหตุ | วิธีแก้ |
|--------|--------|
| Google Drive ไม่ได้แชร์ | ตั้งค่า Share → Anyone with the link |
| URL ไม่ใช่รูปภาพ | ตรวจสอบว่า URL ชี้ไปที่ไฟล์ .jpg/.png |
| รูปถูกลบจาก Drive | อัปโหลดและอัปเดต URL ใหม่ |

### ❌ Dropdown Status ใน Sheet ใช้ไม่ได้

รัน `setupSheets()` อีกครั้ง ระบบจะตั้ง Data Validation ใหม่ให้

### ❌ เว็บ GitHub Pages ยังไม่อัปเดต

GitHub Pages ใช้เวลา Cache 1–5 นาที ให้รอแล้วกด `Ctrl+Shift+R` (Hard Refresh)

---

## ✨ ฟีเจอร์ทั้งหมด

- **Card Grid Layout** — แสดงรูปแบบตาราง ปรับขนาดอัตโนมัติตามหน้าจอ
- **Lightbox Modal** — คลิกรูปเพื่อดูขยาย พร้อมรายละเอียด และปุ่มเลื่อนก่อน/หลัง
- **ปุ่มกรองหมวดหมู่** — สร้างจาก Column D อัตโนมัติ ไม่ต้องตั้งค่าเพิ่ม
- **ช่องค้นหา** — ค้นหาจาก ชื่อ / คำอธิบาย / หมวดหมู่
- **ระบบซ่อน/แสดง** — ตั้ง Status = `ซ่อน` รูปนั้นจะไม่ปรากฏบนเว็บทันที
- **Auto Convert Drive URL** — วางลิงก์ Drive ได้เลย ระบบแปลงให้อัตโนมัติ
- **Loading / Error / Empty State** — แสดงสถานะทุกกรณี
- **Keyboard Navigation** — กด `←` `→` เลื่อนรูปใน Lightbox / `Esc` ปิด
- **Responsive Design** — รองรับมือถือ แท็บเล็ต และคอมพิวเตอร์
- **Dark Theme** — ธีมมืดสไตล์ทันสมัย

---

## 📞 สรุปขั้นตอนฉบับย่อ (Quick Start)

```
1. เปิด Spreadsheet → ตรวจสอบ Sheet ชื่อ "Gallery"
2. Extensions → Apps Script → วางโค้ด Code.gs → Save
3. Run: setupSheets()     ← ตั้งค่า Sheet
4. Run: createSampleData() ← (ถ้าต้องการข้อมูลทดสอบ)
5. Deploy → New deployment → Web app → Anyone → Copy URL
6. ทดสอบ URL ใน Browser → ควรเห็น JSON
7. Push index.html ขึ้น GitHub → เปิด Pages
8. เปิดเว็บ → เสร็จ! 🎉
```

---

*Gallery System · Google Apps Script + GitHub Pages · ฟอนต์ Kanit / Prompt*
