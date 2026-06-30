# Standart Turing Makinesi Simülatörü

Projenin amacı turing makinesinin çalışma mantığını kullanıcı dosu bir web arayüzü üzerinden somutlaştırmaktır.
Kullanıcının yüklediği makine tanımlarına ve girdi dizilerine göre tape'nin anlık durumunu ve kafa hareketlerini adım adım takip edilmesini sağlar.

## Özellikler
 - JSON dosyası ile makine tanımlama
 - Değerler ve geçişler tablosunun gösterilmesi
 - Adım adım çalıştırma (step-by-step execution)
 - Anlık durum (state) gösterimi
 - Bant (tape) görselleştirme
 - Kabul / red durumlarının gösterimi
 - Adım geçmişinin takip edilebilmesi

## Proje Yapısı

```text
 standart-turing-makinesi-simulatoru/                 
 │
 ├── index.html
 ├── css/
 │   └── style.css
 ├── js/                 
 │   └── script.js
 ├── data/
 │    ├── ornek1.json
 │    └── ornek2.json
 ├── .gitignore
 └── README.md  
```
## Kurulum ve Çalıştırma

Bu proje herhangi bir kurulum veya bağımlılık gerektirmez.

### 1. Projeyi indirin

GitHub reposunu bilgisayarınıza klonlayın veya ZIP olarak indirin.


### 2. Proje klasörüne girin

```standart-turing-makinesi-simulatoru```

### 3. Uygulamayı çalıştırın
index.html dosyasını herhangi bir modern tarayıcıda açın (Chrome, Firefox, Edge).

### 4. JSON dosyası seçin
Uygulama açıldığında:
- data/ klasöründeki örnek JSON dosyalarından birini seçebilir
veya
- kendi Turing makinesi JSON dosyanızı yükleyebilirsiniz.

### 5. Simülasyonu başlatın
JSON yüklendikten sonra:
- makine adım adım çalıştırılabilir
- bant ve durum geçişleri ekranda görüntülenir

## JSON Formatı

Turing makinesi, aşağıdaki yapıya uygun bir JSON dosyası ile tanımlanmalıdır:

```json
{
  "states": ["q0", "q1", "qAccept", "qReject"],
  "alphabet": ["a", "b", "c", "X", "Y", "Z", "B"],
  "initial_state": "q0",
  "accept_state": "qAccept",
  "reject_state": "qReject",
  "tape_input": "aaabbbccc",
  "transitions": [
    { "state": "q0", "read": "B", "write": "B", "move": "R", "next_state": "qAccept" },
    { "state": "q0", "read": "a", "write": "X", "move": "R", "next_state": "q1" },
    { "state": "q0", "read": "Y", "write": "Y", "move": "R", "next_state": "q4" },
    { "state": "q0", "read": "b", "write": "b", "move": "R", "next_state": "qReject" },
	
    { "state": "q1", "read": "a", "write": "a", "move": "R", "next_state": "q1" },
    { "state": "q1", "read": "Y", "write": "Y", "move": "R", "next_state": "q1" }, 
    { "state": "q1", "read": "b", "write": "Y", "move": "R", "next_state": "q2" },
	
  ]
}

### Alanların Açıklaması

- **states**: Makinedeki tüm durumlar (q0, q1 vb.)
- **alphabet**: Kullanılan semboller
- **initial_state**: Makinenin başladığı durum
- **accept_state**: Kabul durumu
- **reject_state**: Red durumu
- **tape_input**: Bant üzerine yazılacak başlangıç girdisi
- **transitions**: Durum geçiş kuralları

Her geçiş şu şekilde çalışır:
- `state`:Mevcut durum
- `read`: Bant üzerinden okunan sembol
- `write`: Bant üzerine yazılan sembol
- `move`: Hareket yönü (R = sağ, L = sol)
- `next_state`: Geçilecek yeni durum


## Kullanılan Teknolojiler
 - HTML
 - CSS
 - JavaScript

## Notlar
 - Bu proje tamamen frontend çalışır.
 - Herhangi bir backend veya kurulum gerektirmez.
 - JSON formatı doğru girilmezse simülasyon çalışmaz.
