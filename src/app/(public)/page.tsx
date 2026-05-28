import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="section-badge" style={{ marginBottom: '1.5rem', background: 'rgba(253, 186, 18, 0.2)', color: '#FDBA12' }}>
              Pusat Data Terpadu
            </div>
            <h1>
              Sistem Absensi Digital<br />
              <span>Satpol PP</span>
            </h1>
            <p>
              Platform presensi modern, cepat, dan terpercaya untuk seluruh anggota Satuan Polisi Pamong Praja. Kelola data kehadiran dengan akurasi tinggi dan pelacakan *real-time*.
            </p>
            <div className="hero-buttons">
              <Link href="/login" className="btn btn-primary">
                Login Sistem
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="#panduan" className="btn btn-outline">
                Lihat Panduan
              </Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="hero-image-glow"></div>
            <Image 
              src="/logo.png" 
              alt="Logo Satpol PP" 
              width={550} 
              height={550} 
              className="hero-image"
              priority
            />
          </div>
        </div>
      </section>

      <section id="panduan" className="info-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Panduan Sistem</span>
            <h2 className="section-title">Cara Melakukan Presensi</h2>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon-wrapper">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h3>1. Login Akun</h3>
              <p>Gunakan NRP dan kata sandi yang telah didaftarkan untuk masuk ke dalam dasbor utama sistem absensi personel.</p>
            </div>
            <div className="step-card">
              <div className="step-icon-wrapper">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <h3>2. Pilih Tipe Absen</h3>
              <p>Pilih status kehadiran sesuai dengan kondisi penugasan aktual: Hadir, Sakit, Izin, atau Dinas Luar Kota.</p>
            </div>
            <div className="step-card">
              <div className="step-icon-wrapper">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3>3. Verifikasi Lokasi</h3>
              <p>Sistem akan memverifikasi koordinat GPS Anda secara otomatis, tekan kirim untuk menyelesaikan presensi hari ini.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Keunggulan</span>
            <h2 className="section-title">Infrastruktur Teknologi Terpadu</h2>
          </div>
          <div className="features-grid">
            <div className="feature-box">
              <h4>Keamanan Data Terjamin</h4>
              <p>Menggunakan enkripsi mutakhir untuk melindungi kerahasiaan data personel dari manipulasi serta kebocoran informasi.</p>
            </div>
            <div className="feature-box">
              <h4>Pelacakan Lokasi Presisi</h4>
              <p>Integrasi GPS yang akurat memastikan setiap personel berada tepat pada titik penugasan yang telah dialokasikan.</p>
            </div>
            <div className="feature-box">
              <h4>Laporan & Analitik Real-Time</h4>
              <p>Sistem rekapitulasi otomatis yang memudahkan pimpinan untuk memantau performa kehadiran personel di seluruh wilayah operasional.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
