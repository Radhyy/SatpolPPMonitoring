"use client";

import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import SearchableSelect from '@/components/SearchableSelect';

type Anggota = {
  id: number;
  nama: string;
};

export default function KegiatanKejadianForm({ anggotaList }: { anggotaList: Anggota[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get('bukti') as File;

    if (imageFile && imageFile.size > 0) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(imageFile, options);
        formData.set('bukti', compressedFile, compressedFile.name);
      } catch (error) {
        console.error("Gagal mengkompres gambar:", error);
      }
    }

    try {
      const res = await fetch('/api/kegiatan-kejadian', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Terjadi kesalahan saat mengirim laporan kegiatan/kejadian');
      } else {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      {success && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '2.5rem 2rem', borderRadius: '1rem', textAlign: 'center', maxWidth: '400px', width: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ backgroundColor: '#10b981', color: 'white', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem auto', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#334155', marginBottom: '0.5rem' }}>Berhasil!</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: 1.5 }}>Laporan Kegiatan / Kejadian Anda telah berhasil dikirim ke dalam sistem.</p>
            <button type="button" onClick={() => setSuccess(false)} style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', border: 'none', fontWeight: 600, cursor: 'pointer', width: '100%', fontSize: '1rem' }}>
              Tutup Jendela
            </button>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="laporan-form">
        <div className="form-group">
          <label htmlFor="anggotaId">Nama Pelapor (Petugas)</label>
          <SearchableSelect options={anggotaList} name="anggotaId" required />
        </div>

        <div className="form-group">
          <label htmlFor="kategori">Kategori Laporan</label>
          <select name="kategori" id="kategori" required className="form-control">
            <option value="">-- Pilih Kategori --</option>
            <option value="Pengamanan">Pengamanan</option>
            <option value="Pengawalan">Pengawalan</option>
            <option value="Pelanggaran Perda">Pelanggaran Perda</option>
            <option value="Keributan / Gangguan Trantibum">Keributan / Gangguan Trantibum</option>
            <option value="Kejadian Lapangan Khusus">Kejadian Lapangan Khusus</option>
            <option value="Bencana / Kebakaran">Bencana / Kebakaran</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="prioritas">Tingkat Prioritas</label>
          <select name="prioritas" id="prioritas" required className="form-control">
            <option value="">-- Pilih Prioritas --</option>
            <option value="Rendah">Rendah (Dapat ditangani nanti)</option>
            <option value="Sedang">Sedang (Perlu penanganan segera)</option>
            <option value="Tinggi">Tinggi (Mendesak / Darurat)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="lokasiMaps">Lokasi / URL Maps</label>
          <input type="text" name="lokasiMaps" id="lokasiMaps" required className="form-control" placeholder="Contoh: Jl. Merdeka No.1 atau Link Google Maps" />
        </div>

        <div className="form-group">
          <label htmlFor="keterangan">Keterangan / Kronologi Kejadian</label>
          <textarea name="keterangan" id="keterangan" required className="form-control" rows={5} placeholder="Jelaskan secara detail kejadian, siapa yang terlibat, dan tindakan awal yang diambil..."></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="bukti">Upload Bukti / Dokumentasi</label>
          <input type="file" name="bukti" id="bukti" accept="image/*" required className="form-control" />
          <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>* Foto akan dikompres otomatis hingga maksimal 1MB.</small>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', marginTop: '1rem' }}>
          {isSubmitting ? 'Mengirim Data...' : 'Submit Laporan'}
        </button>
      </form>
    </div>
  );
}
