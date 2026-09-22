'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  KeyRound, 
  Mail, 
  X, 
  Check, 
  AlertCircle,
  Plus
} from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'COUNSELOR' | 'ADMIN';
  active: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'COUNSELOR' | 'ADMIN'>('COUNSELOR');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user account.');
      }

      // Reset form & reload
      setName('');
      setEmail('');
      setPassword('');
      setRole('COUNSELOR');
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to add user account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleUserActive = async (id: string, currentActive: boolean) => {
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive }),
      });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from Supabase?`)) return;

    try {
      await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-confirm': 'true' },
      });
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Team Accounts &amp; Counselors
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage counselor credentials stored securely in Supabase PostgreSQL database. Add, remove, or deactivate team accounts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#0a2540] hover:bg-[#16385d] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4 text-amber-400" />
          <span>Add New Counselor / Staff</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading user accounts from Supabase...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No team accounts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-bold tracking-wider">
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Email ID</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="p-4 text-slate-600 font-mono">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] uppercase ${
                        u.role === 'ADMIN' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleUserActive(u.id, u.active)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] transition-colors ${
                          u.active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {u.active ? (
                          <>
                            <UserCheck className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3" />
                            <span>Deactivated</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove user from Supabase"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-[#0a2540] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>Add Counselor / Staff Member</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Usman Ali"
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address / Login ID *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. usman@meezab.com"
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set secure password"
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Access Level / Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'COUNSELOR' | 'ADMIN')}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="COUNSELOR">Counselor (Portal &amp; Advisory Tools Access)</option>
                  <option value="ADMIN">Administrator (Full Master Access + Admin Panel)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm disabled:opacity-70"
                >
                  {isSubmitting ? 'Saving to Supabase...' : 'Save User to Supabase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
