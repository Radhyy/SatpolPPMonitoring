"use client";

import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import MultiSearchableSelect from '@/components/MultiSearchableSelect';

type Anggota = {
  id: number;
  nama: string;
};

export default function LaporanForm({ anggotaList }: { anggotaList: Anggota[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get('dokumentasi') as File;

    if (imageFile && imageFile.size > 0) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(imageFile, options);
        formData.set('dokumentasi', compressedFile, compressedFile.name);
      } catch (error) {
        console.error("Gagal mengkompres gambar:", error);
      }
    }

    try {
      const res = await fetch('/api/laporan', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Terjadi kesalahan saat mengirim laporan');
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
            <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: 1.5 }}>Laporan Piket Anda telah berhasil direkam ke dalam sistem.</p>
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
          <label htmlFor="anggotaId">Nama Petugas Piket (Regu)</label>
          <MultiSearchableSelect options={anggotaList} name="anggotaId" required />
        </div>

        <div className="form-group">
          <label htmlFor="jam">Jam</label>
          <select name="jam" id="jam" required className="form-control">
            <option value="">-- Pilih Jam --</option>
            <option value="Pagi (07:30 - 07:30) 24 Jam">Pagi (07:30 - 07:30) 24 Jam</option>
            <option value="Pagi (07:30 - 16:30)">Pagi (07:30 - 16:30)</option>
            <option value="Malam (20:00 - 07:00)">Malam (20:00 - 07:00)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="lokasiPos">Lokasi Pos</label>
          <select name="lokasiPos" id="lokasiPos" required className="form-control">
            <option value="">-- Pilih Lokasi Pos --</option>
            <option value="Kantor Bupati">Kantor Bupati</option>
            <option value="Kantor DPRD">Kantor DPRD</option>
            <option value="Kantor SATPOL PP">Kantor SATPOL PP</option>
            <option value="Rujab Bupati">Rujab Bupati</option>
            <option value="Rujab Wakil Bupati">Rujab Wakil Bupati</option>
            <option value="RSPP BETUN">RSPP BETUN</option>
            <option value="Rujab SEKDA">Rujab SEKDA</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="keterangan">Keterangan / Situasi</label>
          <textarea name="keterangan" id="keterangan" required className="form-control" rows={4} placeholder="Jelaskan situasi terkini di lokasi pos..."></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="dokumentasi">Upload Dokumentasi (Foto)</label>
          <input type="file" name="dokumentasi" id="dokumentasi" accept="image/*" required className="form-control" />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', marginTop: '1rem' }}>
          {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
        </button>
      </form>
    </div>
  );
}
