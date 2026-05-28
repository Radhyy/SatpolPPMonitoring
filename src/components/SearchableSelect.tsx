'use client';
import { useState, useRef, useEffect } from 'react';

type Option = { id: number; nama: string };

export default function SearchableSelect({ options, name, required }: { options: Option[], name: string, required?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<number | ''>('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => opt.nama.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelect = (opt: Option) => {
    setSelectedId(opt.id);
    setSearchTerm(opt.nama);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <input type="hidden" name={name} value={selectedId} />
      
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '0.75rem 1rem',
          border: '1px solid #cbd5e1',
          borderRadius: '0.5rem',
          backgroundColor: 'white',
          cursor: 'text'
        }}
        onClick={() => setIsOpen(true)}
      >
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => {
             setSearchTerm(e.target.value);
             setIsOpen(true);
             if (selectedId !== '') setSelectedId(''); // Clear selection if typing
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Cari dan pilih nama petugas..."
          style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }}
          required={required && selectedId === ''}
        />
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}><polyline points="6 9 12 15 18 9"/></svg>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.25rem',
          backgroundColor: 'white',
          border: '1px solid #cbd5e1',
          borderRadius: '0.5rem',
          maxHeight: '250px',
          overflowY: 'auto',
          zIndex: 50,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div 
                key={opt.id}
                onClick={() => handleSelect(opt)}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: selectedId === opt.id ? '#e0e7ff' : 'white',
                  fontSize: '0.875rem',
                  color: selectedId === opt.id ? '#4338ca' : '#334155'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = selectedId === opt.id ? '#e0e7ff' : '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedId === opt.id ? '#e0e7ff' : 'white'}
              >
                {opt.nama}
              </div>
            ))
          ) : (
            <div style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center' }}>
              Nama tidak ditemukan
            </div>
          )}
        </div>
      )}
    </div>
  );
}
