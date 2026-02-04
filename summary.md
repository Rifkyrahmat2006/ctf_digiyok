## Platform Lomba Cyber Security (CTF)

---

## 1️⃣ STACK TEKNOLOGI (FIX)

* **Backend**: Laravel (latest stable)
* **Frontend**: Inertia.js + React (SPA-style, tanpa API terpisah)
* **Realtime**: Laravel Reverb (WebSocket)
* **Database**: MySQL
* **Auth**: Laravel built-in (session based)
* **Theme UI**: CTFd-inspired, **Red–Black**

---

## 2️⃣ KONSEP PRODUK

* Platform **Jeopardy-style CTF**
* Fokus utama:

  * Menampilkan soal
  * Submit flag
  * Hitung skor
  * Scoreboard realtime
* **Team-based**
* **User & team di-generate manual oleh admin**
* Peserta **tidak register sendiri**

---

## 3️⃣ ROLE SISTEM

### Role:

* `admin` → juri / panitia
* `participant` → peserta lomba

### Aturan:

* Admin **tidak ikut lomba**
* Semua submission dan skor **berbasis TEAM**

---

## 4️⃣ SISTEM USER & TEAM (WAJIB)

### USER

* Dibuat **oleh admin** via Admin Panel
* Field:
  * username (unique)
  * email (unique)
  * password (manual / auto-generate)
  * role
  * team_id

❌ Tidak ada register publik (tapi bisa scalable kedepannya)
❌ Tidak ada email verification (tapi bisa scalable kedepannya)

---

### TEAM

* Dibuat **oleh admin**
* Peserta **langsung ter-assign ke team**
* Tidak ada join mandiri (belum pakai team_code)

Field:

* name (unique)
* code (nullable, future use)

---

## 5️⃣ SISTEM CHALLENGE

### Karakteristik:

* Semua soal terlihat sejak awal tapi admin bisa setting juga ke satu per satu soal
* Tidak ada dependency antar soal tapi admin bisa setting juga ke depedency antar soal
* Setiap soal punya poin tetap dan di set di admin

### Challenge fields:

* title
* description (markdown / text)
* category (Web, Crypto, Forensic, Reverse, Misc)
* score (fixed)
* flag_hash
* dependency (nullable)
* is_published

---

## 6️⃣ SUBMISSION & SCORING (CORE LOGIC)

### Rule utama:

* Submit flag **atas nama TEAM**
* Case-sensitive
* Flag dibandingkan via **hash**
* Soal hanya bisa disolve **1x per team**
* Salah submit:

  * tidak kurangi poin
  * tetap dicatat

### Rate limit:

* ±1 submit / 3 detik / team

---

## 7️⃣ SCOREBOARD REALTIME (WAJIB)

### Teknologi:

* Laravel Reverb

### Cara kerja:

* Event `ScoreboardUpdated` di-trigger saat:

  * team berhasil solve soal
* Broadcast ke channel:

  ```
  scoreboard.global
  ```

### Data yang dikirim:

* team_id
* team_name
* total_score
* last_solve_time

### Tampilan scoreboard:

* Rank
* Team Name
* Total Score
* Last Solve Time (optional tapi disarankan)

⚠️ Tidak perlu realtime per-millisecond

---

## 8️⃣ ADMIN PANEL (WAJIB ADA)

### Admin bisa:

* Login
* CRUD User

  * create user
  * reset password
  * assign ke team
* CRUD Team
* CRUD Challenge
* Publish / Unpublish Challenge
* Lihat:

  * Scoreboard realtime
  * Submission log

---

## 9️⃣ DATABASE (FINAL)

### users

```
id
username (unique)
email (unique)
password_hash
role
team_id
created_at
```

### teams

```
id
name (unique)
code (nullable)
created_at
```

### challenges

```
id
title
description
category
score
flag_hash
is_published
created_at
```

### submissions

```
id
team_id
challenge_id
is_correct
created_at
```

---

## 🔐 10️⃣ SECURITY MINIMUM (TIDAK BOLEH HILANG)

* Password hash
* Flag hash
* Auth middleware
* Role middleware
* Rate limit submission
* Flag **tidak pernah dikirim ke frontend**

---

## 🎨 11️⃣ UI / THEME GUIDELINE

* Inspirasi: **CTFd**
* Warna utama:
  * Background: Black / Dark Gray
  * Accent: Red
* Font: clean, red-hat
* Fokus:

  * readability
  * kontras tinggi
  * minim animasi

---

## ❌ 12️⃣ YANG TIDAK BOLEH ADA DI MVP

* Register publik
* Join team pakai code
* Captain role
* Chat team
* Dynamic scoring
* Multi-event UI
* Docker challenge
* Email system