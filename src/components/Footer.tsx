import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Image src="/logo.png" alt="Logo Satpol PP" width={40} height={40} />
            <span>SATPOL PP</span>
          </div>
          <div className="footer-links">
            <Link href="#">Panduan</Link>
            <Link href="#">Kebijakan Privasi</Link>
            <Link href="#">Syarat & Ketentuan</Link>
            <Link href="#">Bantuan Teknis</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Satuan Polisi Pamong Praja. Sistem Informasi Terpadu.</p>
        </div>
      </div>
    </footer>
  );
}
