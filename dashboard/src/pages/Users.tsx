import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaEdit, FaTrash } from 'react-icons/fa';
import { getAllUsers, updateUser, deleteUserById } from '../services/apiService';
import { useUser } from '../contexts/userContext';

const roleOptions = [
    { label: 'All', value: '' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'User', value: 'USER' },
    { label: 'Restaurant', value: 'RESTAURANT' },
];

// Extract CustomDropdown from AddProductMenu
function CustomDropdown({ label, value, onChange, options, placeholder = 'Select', error }: any) {
    const [open, setOpen] = useState(false);
    return (
        <div className="mb-2 w-full relative">
            <label className="block mb-1 text-sm" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>{label}</label>
            <div
                className="w-full px-3 py-2 border rounded bg-[var(--color-light)] flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--color-tertiary)', fontFamily: 'var(--font-saira)', color: 'var(--color-dark)' }}
                onClick={() => setOpen(o => !o)}
                tabIndex={0}
            >
                <span className="truncate text-sm">
                    {options.find((opt: any) => opt.value === value)?.label || placeholder}
                </span>
                <svg className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute left-0 right-0 z-40 bg-[var(--color-white)] border border-[var(--color-light)] rounded shadow-lg mt-1 max-h-48 overflow-y-auto"
                    >
                        <div className="flex flex-col gap-1 p-2">
                            {options.map((opt: any) => (
                                <button
                                    key={opt.value}
                                    className={`text-left px-2 py-1 rounded hover:bg-[var(--color-tertiary)] hover:text-[var(--color-white)] transition-colors ${value === opt.value ? 'font-bold text-[var(--color-tertiary)]' : ''}`}
                                    onClick={() => { onChange(opt.value); setOpen(false); }}
                                    style={{ fontFamily: 'var(--font-saira)' }}
                                    type="button"
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {error && <span className="text-[var(--color-error)] text-xs mt-1 block">{error}</span>}
        </div>
    );
}

const Users = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterOpen, setFilterOpen] = useState(false);
    const [roleFilter, setRoleFilter] = useState('');
    const [editModal, setEditModal] = useState<{ open: boolean; user: any | null }>({ open: false, user: null });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: any | null }>({ open: false, user: null });
    const [editData, setEditData] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { user: currentUser } = useUser();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getAllUsers();
            setUsers((res.data || []).filter((u: any) => !currentUser || Number(u.id) !== Number(currentUser.id)));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchUsers();
        }
    }, [currentUser]);

    useEffect(() => {
        let filtered = users;
        if (roleFilter) {
            filtered = users.filter((u) => u.role === roleFilter);
        }
        setFilteredUsers(filtered);
    }, [users, roleFilter]);

    // Filter popup handlers
    const handleFilterSave = () => setFilterOpen(false);
    const handleFilterReset = () => {
        setRoleFilter('');
        setFilterOpen(false);
    };

    // Edit modal handlers
    const openEditModal = (user: any) => {
        setEditData({ email: user.email, role: user.role });
        setEditModal({ open: true, user });
    };
    const closeEditModal = () => setEditModal({ open: false, user: null });
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };
    const handleUpdateUser = async () => {
        if (!editModal.user) return;
        setSaving(true);
        try {
            await updateUser(editModal.user.id, editData);
            await fetchUsers();
            closeEditModal();
        } finally {
            setSaving(false);
        }
    };

    // Delete modal handlers
    const openDeleteModal = (user: any) => setDeleteModal({ open: true, user });
    const closeDeleteModal = () => setDeleteModal({ open: false, user: null });
    const handleDeleteUser = async () => {
        if (!deleteModal.user) return;
        setDeleting(true);
        try {
            await deleteUserById(deleteModal.user.id);
            await fetchUsers();
            closeDeleteModal();
        } finally {
            setDeleting(false);
        }
    };

    return (
        <motion.div
            className="flex-1 flex flex-col p-2 sm:p-6 w-full max-w-5xl mx-auto relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: 'var(--font-saira)', overflowX: 'unset' }}
        >
            {/* Title & Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2 w-full">
                <h1 className="text-2xl font-bold text-[var(--color-dark)]">Users</h1>
                <button
                    className="flex items-center gap-2 px-4 py-2 rounded bg-[var(--color-tertiary)] text-white font-semibold shadow hover:bg-[var(--color-quaternary)] transition cursor-pointer"
                    onClick={() => setFilterOpen(true)}
                >
                    <FaFilter />
                    <span className="hidden sm:inline">Filter</span>
                </button>
            </div>

            {/* Filter Popup */}
            <AnimatePresence>
                {filterOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-[var(--color-white)] rounded-lg shadow-lg p-6 w-[90vw] max-w-xs flex flex-col gap-4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', duration: 0.3 }}
                        >
                            <h2 className="text-lg font-semibold mb-2 text-[var(--color-dark)]">Filter Users</h2>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-[var(--color-dark)]">Role</label>
                                <select
                                    className="px-3 py-2 rounded border focus:outline-none focus:ring-2 text-sm"
                                    style={{ borderColor: 'var(--color-tertiary)', background: 'var(--color-light)', color: 'var(--color-dark)' }}
                                    value={roleFilter}
                                    onChange={e => setRoleFilter(e.target.value)}
                                >
                                    {roleOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    className="flex-1 px-4 py-2 rounded bg-[var(--color-tertiary)] text-white font-semibold hover:bg-[var(--color-quaternary)] transition"
                                    onClick={handleFilterSave}
                                >Save</button>
                                <button
                                    className="flex-1 px-4 py-2 rounded bg-[var(--color-muted)] text-white font-semibold hover:bg-[var(--color-dark)] transition"
                                    onClick={handleFilterReset}
                                >Reset</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Users Table */}
            <div className="w-full relative h-full flex-1 flex flex-col border border-[var(--color-tertiary)] rounded-lg bg-[var(--color-white)] overflow-x-auto no-scrollbar">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-[var(--color-muted)]">Loading...</div>
                ) : (
                    <table className="w-full text-sm md:text-base min-w-[350px] absolute overflow-x-auto">
                        <thead>
                            <tr className="bg-[var(--color-secondary)] text-[var(--color-dark)]">
                                <th className="p-2">#</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Role</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
                                <tr key={user.id} className="border-b last:border-none hover:bg-[var(--color-secondary)] transition-colors">
                                    <td className="p-2 text-center">{idx + 1}</td>
                                    <td className="p-2 text-center break-all">{user.email}</td>
                                    <td className="p-2 text-center">{user.role}</td>
                                    <td className="p-2 text-center flex gap-2 justify-center">
                                        <button
                                            className="p-2 rounded bg-[var(--color-tertiary)] text-white hover:bg-[var(--color-quaternary)] transition"
                                            onClick={() => openEditModal(user)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="p-2 rounded bg-[var(--color-error)] text-white hover:bg-[var(--color-dark)] transition"
                                            onClick={() => openDeleteModal(user)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center text-[var(--color-muted)] py-6">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Edit User Modal */}
            <AnimatePresence>
                {editModal.open && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-[var(--color-white)] rounded-lg shadow-lg p-6 w-[90vw] max-w-xs flex flex-col gap-4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', duration: 0.3 }}
                        >
                            <h2 className="text-lg font-semibold mb-2 text-[var(--color-dark)]">Edit User</h2>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-[var(--color-dark)]">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editData.email || ''}
                                    onChange={handleEditChange}
                                    className="px-3 py-2 rounded border focus:outline-none focus:ring-2 text-sm"
                                    style={{ borderColor: 'var(--color-tertiary)', background: 'var(--color-light)', color: 'var(--color-dark)' }}
                                    disabled
                                />
                                <label className="text-sm text-[var(--color-dark)]">Role</label>
                                <CustomDropdown
                                    label=""
                                    value={editData.role || ''}
                                    onChange={(val: string) => setEditData({ ...editData, role: val })}
                                    options={roleOptions.filter(r => r.value)}
                                    placeholder="Select Role"
                                />
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    className="flex-1 px-4 py-2 rounded bg-[var(--color-tertiary)] text-white font-semibold hover:bg-[var(--color-quaternary)] transition"
                                    onClick={handleUpdateUser}
                                    disabled={saving}
                                >{saving ? 'Updating...' : 'Update'}</button>
                                <button
                                    className="flex-1 px-4 py-2 rounded bg-[var(--color-muted)] text-white font-semibold hover:bg-[var(--color-dark)] transition"
                                    onClick={closeEditModal}
                                    disabled={saving}
                                >Cancel</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {deleteModal.open && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-[var(--color-white)] rounded-lg shadow-lg p-6 w-[90vw] max-w-xs flex flex-col gap-4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', duration: 0.3 }}
                        >
                            <h2 className="text-lg font-semibold mb-2 text-[var(--color-dark)]">Delete User</h2>
                            <p className="text-[var(--color-dark)]">Are you sure you want to delete <span className="font-bold">{deleteModal.user?.email}</span>?</p>
                            <div className="flex gap-2 mt-4">
                                <button
                                    className="flex-1 px-4 py-2 rounded bg-[var(--color-error)] text-white font-semibold hover:bg-[var(--color-dark)] transition"
                                    onClick={handleDeleteUser}
                                    disabled={deleting}
                                >{deleting ? 'Deleting...' : 'Delete'}</button>
                                <button
                                    className="flex-1 px-4 py-2 rounded bg-[var(--color-muted)] text-white font-semibold hover:bg-[var(--color-dark)] transition"
                                    onClick={closeDeleteModal}
                                    disabled={deleting}
                                >Cancel</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Users;
