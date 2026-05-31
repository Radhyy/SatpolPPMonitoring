'use client';
import { useState, useRef, useEffect } from 'react';

type Option = { id: number; nama: string };

export default function MultiSearchableSelect({ options, name, required }: { options: Option[], name: string, required?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
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

  const availableOptions = options.filter(opt => !selectedOptions.find(selected => selected.id === opt.id));
  const filteredOptions = availableOptions.filter(opt => opt.nama.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelect = (opt: Option) => {
    setSelectedOptions([...selectedOptions, opt]);
    setSearchTerm('');
    // Keep open so they can select more
  };

  const handleRemove = (idToRemove: number) => {
    setSelectedOptions(selectedOptions.filter(opt => opt.id !== idToRemove));
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      {/* Hidden inputs to submit as array */}
      {selectedOptions.map(opt => (
        <input key={opt.id} type="hidden" name={`${name}[]`} value={opt.id} />
      ))}
      
      {/* Fallback required validation if empty */}
      {selectedOptions.length === 0 && required && (
        <input type="hidden" name={`${name}_fallback`} required value="" />
      )}

      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          width: '100%',
          padding: '0.5rem 1rem',
          border: '1px solid #cbd5e1',
          borderRadius: '0.5rem',
          backgroundColor: 'white',
          cursor: 'text',
          minHeight: '46px'
        }}
        onClick={() => setIsOpen(true)}
      >
        {selectedOptions.map(opt => (
          <div key={opt.id} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
            {opt.nama}
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove(opt.id); }}
              style={{ background: 'none', border: 'none', marginLeft: '0.25rem', cursor: 'pointer', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        ))}
        
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => {
             setSearchTerm(e.target.value);
             setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedOptions.length > 0 ? "Ketik untuk tambah lagi..." : "Cari dan pilih nama (bisa lebih dari 1)..."}
          style={{ border: 'none', outline: 'none', flex: 1, minWidth: '150px', fontSize: '0.875rem', backgroundColor: 'transparent' }}
        />
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', cursor: 'pointer', marginLeft: 'auto' }} onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}><polyline points="6 9 12 15 18 9"/></svg>
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
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  color: '#334155'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                {opt.nama}
              </div>
            ))
          ) : (
            <div style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center' }}>
              {availableOptions.length === 0 ? "Semua anggota sudah dipilih" : "Nama tidak ditemukan"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
