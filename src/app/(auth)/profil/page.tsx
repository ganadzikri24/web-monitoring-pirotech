"use client";

import { useState, useEffect, Suspense } from "react";
import { useRole } from "@/lib/useRole";
import { Trash2, UserPlus, Loader2, User as UserIcon, Shield, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  username: string;
  creationTime: string;
  lastSignInTime: string;
}

function ProfilContent() {
  const { user, role, loading: roleLoading, isAdmin } = useRole();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "pengguna" && isAdmin ? "pengguna" : "profil";
  
  const [activeTab, setActiveTab] = useState(initialTab);

  // Profile Form States
  const [profileUsername, setProfileUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Users Form States
  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [usersMessage, setUsersMessage] = useState("");
  
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [confirmUserPassword, setConfirmUserPassword] = useState("");
  const [newRole, setNewRole] = useState("operator");
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  useEffect(() => {
    if (user) {
      const getUsername = async () => {
        try {
          const idTokenResult = await user.getIdTokenResult();
          setProfileUsername(idTokenResult.claims.username || "");
        } catch (e) {
          console.error(e);
        }
      }
      getUsername();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "pengguna" && isAdmin) {
      fetchUsers();
    }
  }, [activeTab, isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Gagal mengambil data pengguna");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setUsersError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUpdating(true);
    setProfileMessage("");
    setProfileError("");

    // Validasi konfirmasi password
    if (newPassword && newPassword !== confirmPassword) {
      setProfileError("Password baru dan konfirmasi password tidak cocok.");
      setIsUpdating(false);
      return;
    }

    try {
      let hasChanges = false;

      // Update username via API jika berubah
      const idTokenResult = await user.getIdTokenResult();
      const currentUsername = idTokenResult.claims.username || "";
      
      if (profileUsername !== currentUsername) {
        const res = await fetch(`/api/users/${user.uid}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: profileUsername }),
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Gagal memperbarui username");
        }
        
        // Refresh token agar claims baru segera aktif di frontend
        await user.getIdToken(true);
        hasChanges = true;
      }

      if (newPassword) {
        if (!currentPassword) {
          throw new Error("Masukkan password saat ini untuk mengganti password baru.");
        }
        if (newPassword.length < 6) {
          throw new Error("Password baru minimal 6 karakter.");
        }
        const credential = EmailAuthProvider.credential(user.email!, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        hasChanges = true;
      }

      if (hasChanges) {
        setProfileMessage("✅ Perubahan berhasil disimpan!");
      } else {
        setProfileMessage("Tidak ada perubahan yang perlu disimpan.");
      }
      setTimeout(() => setProfileMessage(""), 5000);
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        setProfileError("Password saat ini salah.");
      } else {
        setProfileError(error.message || "Gagal memperbarui profil.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingUser(true);
    setUsersError("");
    setUsersMessage("");
    
    // Validasi konfirmasi password
    if (newUserPassword !== confirmUserPassword) {
      setUsersError("Password dan konfirmasi password tidak cocok.");
      setIsCreatingUser(false);
      return;
    }

    if (newUserPassword.length < 6) {
      setUsersError("Password minimal 6 karakter.");
      setIsCreatingUser(false);
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: newEmail, 
          password: newUserPassword, 
          role: newRole,
          username: newUsername || undefined,
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal membuat pengguna");
      }
      
      setNewEmail("");
      setNewUsername("");
      setNewUserPassword("");
      setConfirmUserPassword("");
      setNewRole("operator");
      setUsersMessage(`✅ Akun ${newEmail} berhasil dibuat!`);
      setTimeout(() => setUsersMessage(""), 5000);
      await fetchUsers();
    } catch (err: any) {
      setUsersError(err.message);
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleDeleteUser = async (uid: string, email: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna ${email}?`)) return;
    
    setUsersError("");
    setUsersMessage("");

    try {
      const res = await fetch(`/api/users/${uid}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus pengguna");
      }
      
      setUsersMessage(`✅ Akun ${email} berhasil dihapus.`);
      setTimeout(() => setUsersMessage(""), 5000);
      await fetchUsers();
    } catch (err: any) {
      setUsersError(err.message);
    }
  };

  const handleUpdateRole = async (uid: string, newRole: string) => {
    setUsersError("");
    setUsersMessage("");
    try {
      const res = await fetch(`/api/users/${uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mengubah role pengguna");
      }
      
      setUsersMessage(`✅ Role berhasil diperbarui.`);
      setTimeout(() => setUsersMessage(""), 5000);
      await fetchUsers();
    } catch (err: any) {
      setUsersError(err.message);
    }
  };

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-green700 mb-2 tracking-tight">Pengaturan Akun</h1>
        <p className="text-brand-sage leading-relaxed">
          Kelola profil Anda atau atur akses pengguna lain.
        </p>
      </div>

      <div className="flex space-x-1 border-b border-card-border mb-6">
        <button
          onClick={() => setActiveTab("profil")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors font-medium text-sm ${
            activeTab === "profil"
              ? "border-brand-green text-brand-green"
              : "border-transparent text-brand-sage hover:text-brand-green700"
          }`}
        >
          <UserIcon className="w-4 h-4" />
          Profil Saya
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab("pengguna")}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors font-medium text-sm ${
              activeTab === "pengguna"
                ? "border-brand-green text-brand-green"
                : "border-transparent text-brand-sage hover:text-brand-green700"
            }`}
          >
            <Shield className="w-4 h-4" />
            Kelola Pengguna
          </button>
        )}
      </div>

      {activeTab === "profil" && (
        <div className="bg-card-bg p-8 rounded-2xl border border-card-border shadow-sm max-w-2xl">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            
            {profileMessage && (
              <div className="bg-brand-green50 text-brand-green700 p-4 rounded-xl border border-brand-green/20 font-medium flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                {profileMessage}
              </div>
            )}
            {profileError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 font-medium">
                {profileError}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-brand-green700 border-b border-card-border pb-2">Informasi Dasar</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">Email (Tidak dapat diubah)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full px-4 py-2.5 rounded-xl border border-input-border bg-input-bg/50 text-brand-sage cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Username</label>
                <input
                  type="text"
                  value={profileUsername}
                  onChange={(e) => setProfileUsername(e.target.value.replace(/\s/g, ''))}
                  placeholder="Masukkan username Anda"
                  className="w-full px-4 py-2.5 rounded-xl border border-input-border bg-input-bg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-semibold text-lg text-brand-green700 border-b border-card-border pb-2">Ganti Password</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">Password Saat Ini</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Opsional (Isi jika ingin ganti password)"
                  className="w-full px-4 py-2.5 rounded-xl border border-input-border bg-input-bg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">Password Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Opsional (Min. 6 karakter)"
                  className="w-full px-4 py-2.5 rounded-xl border border-input-border bg-input-bg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang password baru"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-input-bg focus:ring-2 transition-all ${
                    confirmPassword && confirmPassword !== newPassword
                      ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                      : "border-input-border focus:ring-brand-green/20 focus:border-brand-green"
                  }`}
                />
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full sm:w-auto bg-brand-green hover:bg-brand-green700 text-white font-medium px-8 py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "pengguna" && isAdmin && (
        <div className="space-y-6">
          {/* Pesan sukses global */}
          {usersMessage && (
            <div className="bg-brand-green50 text-brand-green700 p-4 rounded-xl border border-brand-green/20 font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              {usersMessage}
            </div>
          )}
          {usersError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 font-medium">
              {usersError}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Form Tambah Pengguna */}
            <div className="md:col-span-1 bg-card-bg p-6 rounded-2xl border border-card-border shadow-sm h-fit">
              <h3 className="font-semibold text-lg text-brand-green700 mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> Tambah Akun
              </h3>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="contoh@email.com"
                    className="w-full px-3 py-2 rounded-lg border border-input-border bg-input-bg focus:ring-2 focus:ring-brand-green/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Username (opsional)</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value.replace(/\s/g, ''))}
                    placeholder="username untuk login"
                    className="w-full px-3 py-2 rounded-lg border border-input-border bg-input-bg focus:ring-2 focus:ring-brand-green/20"
                  />
                  <p className="text-xs text-brand-sage mt-1">Pengguna bisa login pakai username ini</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Min. 6 karakter"
                    className="w-full px-3 py-2 rounded-lg border border-input-border bg-input-bg focus:ring-2 focus:ring-brand-green/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Konfirmasi Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmUserPassword}
                    onChange={(e) => setConfirmUserPassword(e.target.value)}
                    placeholder="Ketik ulang password"
                    className={`w-full px-3 py-2 rounded-lg border bg-input-bg focus:ring-2 ${
                      confirmUserPassword && confirmUserPassword !== newUserPassword
                        ? "border-red-300 focus:ring-red-200"
                        : "border-input-border focus:ring-brand-green/20"
                    }`}
                  />
                  {confirmUserPassword && confirmUserPassword !== newUserPassword && (
                    <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Peran (Role)</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input-border bg-input-bg focus:ring-2 focus:ring-brand-green/20"
                  >
                    <option value="operator">Operator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="w-full bg-brand-green hover:bg-brand-green700 text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {isCreatingUser && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isCreatingUser ? "Menyimpan..." : "Buat Akun"}
                </button>
              </form>
            </div>

            {/* Daftar Pengguna */}
            <div className="md:col-span-2 bg-card-bg rounded-2xl border border-card-border shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-card-border flex justify-between items-center">
                <h3 className="font-semibold text-lg text-brand-green700">Daftar Pengguna</h3>
                {loadingUsers && <Loader2 className="w-4 h-4 animate-spin text-brand-green" />}
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-green50/50">
                      <th className="px-6 py-3 text-xs font-semibold text-brand-green700 uppercase tracking-wider border-b border-card-border">Email / Username</th>
                      <th className="px-6 py-3 text-xs font-semibold text-brand-green700 uppercase tracking-wider border-b border-card-border">Peran</th>
                      <th className="px-6 py-3 text-xs font-semibold text-brand-green700 uppercase tracking-wider border-b border-card-border text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border">
                    {users.map((u) => (
                      <tr key={u.uid} className="hover:bg-brand-green50/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="font-medium">
                            {u.email}
                            {u.uid === user?.uid && <span className="ml-2 text-xs text-brand-green bg-brand-green50 px-2 py-0.5 rounded-full">Anda</span>}
                          </div>
                          {u.username && (
                            <div className="text-xs text-brand-sage mt-0.5">@{u.username}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {u.uid === user?.uid ? (
                            <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                              u.role === 'admin' ? 'bg-brand-green100 text-brand-green700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {u.role}
                            </span>
                          ) : (
                            <select
                              value={u.role}
                              onChange={(e) => handleUpdateRole(u.uid, e.target.value)}
                              className={`px-2 py-1 text-xs rounded-lg font-medium border focus:ring-2 focus:ring-brand-green/20 ${
                                u.role === 'admin' 
                                  ? 'bg-brand-green50 text-brand-green700 border-brand-green/20' 
                                  : 'bg-gray-50 text-gray-700 border-gray-200'
                              }`}
                            >
                              <option value="operator">operator</option>
                              <option value="admin">admin</option>
                            </select>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {u.uid !== user?.uid && (
                            <button
                              onClick={() => handleDeleteUser(u.uid, u.email)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors p-2 rounded-lg"
                              title="Hapus Pengguna"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && !loadingUsers && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-brand-sage text-sm">
                          Belum ada akun lain.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-brand-green" /></div>}>
      <ProfilContent />
    </Suspense>
  );
}
