'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type AdminUser = {
  id: number;
  username: string;
  role: string;
};

export default function AdminClient({ initialUsers }: { initialUsers: AdminUser[] }) {
  const router = useRouter();
  const [userList, setUserList] = useState<AdminUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT' | 'DELETE'>('ADD');
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [roleInput, setRoleInput] = useState('ADMIN');
  const [deleteUsername, setDeleteUsername] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const filteredUsers = userList.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setModalMode('ADD');
    setCurrentId(null);
    setUsernameInput('');
    setPasswordInput('');
    setRoleInput('ADMIN');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setModalMode('EDIT');
    setCurrentId(user.id);
    setUsernameInput(user.username);
    setPasswordInput(''); // Leave blank unless they want to change it
    setRoleInput(user.role);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: number, username: string) => {
    setModalMode('DELETE');
    setCurrentId(id);
    setDeleteUsername(username);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!currentId) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/users/${currentId}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Gagal menghapus akun admin');

      setUserList(prev => prev.filter(u => u.id !== currentId));
      closeModal();
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setErrorMsg('Username tidak boleh kosong');
      return;
    }
    if (modalMode === 'ADD' && !passwordInput.trim()) {
      setErrorMsg('Password wajib diisi untuk akun baru');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const payload: any = {
      username: usernameInput,
      role: roleInput
    };
    if (passwordInput) payload.password = passwordInput;

    try {
      if (modalMode === 'ADD') {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Gagal menambah akun admin');
        
        setUserList(prev => [...prev, data].sort((a, b) => a.username.localeCompare(b.username)));
      } else {
        // EDIT
        const res = await fetch(`/api/users/${currentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Gagal memperbarui akun admin');
        
        setUserList(prev => prev.map(u => u.id === currentId ? data : u).sort((a, b) => a.username.localeCompare(b.username)));
      }
      
      closeModal();
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: '1', minWidth: 0, maxWidth: '400px' }}>
          <input 
            type="text" 
            placeholder="Cari username..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', backgroundColor: '#f8fafc' }}
          />
        </div>
        <button 
          onClick={openAddModal}
          style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          Tambah Admin
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', width: '80px' }}>ID</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Username</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#64748b', whiteSpace: 'nowrap' }}>#{user.id}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>{user.username}</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => openEditModal(user)}
                        style={{ backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => openDeleteModal(user.id, user.username)}
                        style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    {userList.length === 0 ? 'Belum ada data admin terdaftar.' : 'Tidak ada akun yang sesuai dengan pencarian.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit/Delete Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: modalMode === 'DELETE' ? '#ef4444' : '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {modalMode === 'DELETE' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>}
              {modalMode === 'ADD' ? 'Tambah Akun Admin' : modalMode === 'EDIT' ? 'Edit Akun Admin' : 'Konfirmasi Hapus'}
            </h3>
            
            {modalMode === 'DELETE' ? (
              <div>
                <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Apakah Anda yakin ingin menghapus akun admin dengan username <strong style={{ color: '#0f172a' }}>"{deleteUsername}"</strong>? Akun ini tidak akan bisa login lagi ke sistem.
                </p>
                {errorMsg && (
                  <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
                    {errorMsg}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={closeModal}
                    disabled={isSubmitting}
                    style={{ backgroundColor: 'white', color: '#64748b', border: '1px solid #cbd5e1', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                  >
                    Batal
                  </button>
                  <button 
                    onClick={confirmDelete}
                    disabled={isSubmitting}
                    style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Username</label>
                  <input 
                    type="text" 
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Masukkan username..."
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                    autoFocus
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                    Password {modalMode === 'EDIT' && <span style={{ fontWeight: 400, color: '#94a3b8' }}>(Kosongkan jika tidak ingin diubah)</span>}
                  </label>
                  <input 
                    type="password" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder={modalMode === 'EDIT' ? "Biarkan kosong jika tidak diubah" : "Masukkan password rahasia..."}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>

                {errorMsg && (
                  <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button 
                    type="button" 
                    onClick={closeModal}
                    disabled={isSubmitting}
                    style={{ backgroundColor: 'white', color: '#64748b', border: '1px solid #cbd5e1', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
