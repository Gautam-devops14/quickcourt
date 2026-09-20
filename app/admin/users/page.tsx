"use client";
import { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { Role } from '@/types';

type UserStatus = 'ACTIVE' | 'BANNED';

export default function AdminUsersPage() {
  const { users, bookings, toggleUserStatus } = useStore();
  const [roleFilter, setRoleFilter] = useState<Role | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesRole && matchesStatus;
  });

  const athleteCount = users.filter(u => u.role === 'USER').length;
  const ownerCount = users.filter(u => u.role === 'OWNER').length;
  const suspendedCount = users.filter(u => u.status === 'BANNED').length;

  const toggleStatus = (userId: string) => {
    toggleUserStatus(userId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Identity & Partner Management</h1>
            <span className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-2.5 py-0.5 rounded-full border border-primary/20">
              User Administration
            </span>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md mt-1 max-w-3xl">
            Audit athlete booking profiles, manage facility owner accounts, and enforce platform trust and safety bans.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 flex flex-col gap-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-96">
            <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-2 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="Search Email, Name, or Account ID..." type="text" />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">search</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between border-t border-outline-variant/40 pt-3 gap-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <button onClick={() => { setRoleFilter('ALL'); setStatusFilter('ALL'); }} className={`px-4 py-1.5 rounded-lg font-label-md text-label-md font-semibold ${roleFilter === 'ALL' && statusFilter === 'ALL' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant/40'}`}>
              All Accounts ({users.length})
            </button>
            <button onClick={() => { setRoleFilter('USER'); setStatusFilter('ALL'); }} className={`px-4 py-1.5 rounded-lg font-label-md text-label-md font-semibold ${roleFilter === 'USER' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant/40'}`}>
              Athletes / Players ({athleteCount})
            </button>
            <button onClick={() => { setRoleFilter('OWNER'); setStatusFilter('ALL'); }} className={`px-4 py-1.5 rounded-lg font-label-md text-label-md font-semibold ${roleFilter === 'OWNER' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant/40'}`}>
              Facility Owners ({ownerCount})
            </button>
            <button onClick={() => { setRoleFilter('ALL'); setStatusFilter('BANNED'); }} className={`px-4 py-1.5 rounded-lg font-label-md text-label-md font-semibold ${statusFilter === 'BANNED' ? 'bg-error-container text-error' : 'bg-surface-container-low text-error hover:bg-error-container border border-outline-variant/40'}`}>
              Suspended / Banned ({suspendedCount})
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant text-on-surface-variant text-label-md font-label-md uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10">
                  <input className="w-[18px] h-[18px] rounded border-outline-variant text-primary-container focus:ring-primary-container cursor-pointer" type="checkbox" />
                </th>
                <th className="py-3.5 px-4">Account & Identity</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Booking Activity</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Ban / Unban Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 text-body-md font-body-md">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-outline">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const userBookings = bookings.filter(b => b.userId === user.id);
                  const revenue = userBookings.reduce((sum, b) => sum + (b.status === 'CONFIRMED' || b.status === 'COMPLETED' ? b.amount : 0), 0);
                  
                  return (
                    <tr key={user.id} className="hover:bg-surface-bright transition-colors group">
                      <td className="py-4 px-4 align-top">
                        <input className="w-[18px] h-[18px] rounded border-outline-variant text-primary-container focus:ring-primary-container cursor-pointer mt-1" type="checkbox" />
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-surface-container-high border border-outline-variant text-on-surface">
                              {user.name.slice(0, 1)}
                            </div>
                            {user.status === 'ACTIVE' ? (
                              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-secondary rounded-full ring-2 ring-surface-container-lowest" title="Active"></span>
                            ) : (
                              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-error rounded-full ring-2 ring-surface-container-lowest" title="Banned"></span>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-on-surface text-body-md font-body-md">{user.name}</span>
                            </div>
                            <span className="text-label-sm font-label-sm text-outline">#{user.id}</span>
                            <div className="flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant mt-1">
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${user.role === 'ADMIN' ? 'bg-primary-container text-on-primary-container' : user.role === 'OWNER' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-primary'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col text-body-sm font-body-sm">
                          <span className="font-bold text-on-surface">{userBookings.length} Bookings (₹{revenue.toFixed(0)})</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        {user.status === 'ACTIVE' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm bg-surface-container-low text-secondary font-bold border border-outline-variant">
                            <span className="w-2 h-2 rounded-full bg-secondary"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm bg-error-container text-on-error-container font-bold border border-error/30">
                            <span className="w-2 h-2 rounded-full bg-error"></span>
                            Banned
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 align-top text-right">
                        {user.role !== 'ADMIN' && (
                          <button onClick={() => toggleStatus(user.id)} className={`h-9 px-3 rounded-lg border font-label-md text-label-md transition-colors flex items-center gap-1.5 ml-auto ${user.status === 'ACTIVE' ? 'border-error text-error hover:bg-error-container' : 'border-secondary text-secondary hover:bg-secondary-container'}`}>
                            <span className="material-symbols-outlined text-[18px]">
                              {user.status === 'ACTIVE' ? 'block' : 'check_circle'}
                            </span>
                            <span>{user.status === 'ACTIVE' ? 'Ban User' : 'Unban'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
