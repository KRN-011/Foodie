import { AnimatePresence, motion } from 'framer-motion'
import { IoMdCloseCircle, IoIosArrowDown } from 'react-icons/io'
import { useEffect, useState } from 'react';
import { getAllUsers, updateUser } from '../../services/apiService';
import CustomDropdown from '../CustomDropdown';

const ROLE_OPTIONS = [
    { value: 'ALL', label: 'All' },
    { value: 'USER', label: 'User' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'RESTAURANT', label: 'Restaurant' },
];

const EditUserModal = ({ open, onClose, onSave }: { open: boolean, onClose: () => void, onSave: () => void }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [editStates, setEditStates] = useState<{ [id: number]: any }>({});
    const [loading, setLoading] = useState(false);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [search, setSearch] = useState<string>('');
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    useEffect(() => {
        if (open) {
            setLoading(true);
            const getUsers = async () => {
                const res = await getAllUsers();
                const userList = res.data || [];
                setUsers(userList);
                // Initialize edit states from userList
                setFilteredUsers(userList);
                const states: { [id: number]: any } = {};
                userList.forEach((u: any) => {
                    states[u.id] = {
                        username: u.username,
                        email: u.email,
                        role: u.role,
                        disabled: u.deleted,
                    };
                });
                setEditStates(states);
                setLoading(false);
            };
            getUsers();
        } else {
            setUsers([]);
            setEditStates({});
        }
    }, [open]);

    const handleChange = (id: number, field: string, value: any) => {
        setEditStates(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            }
        }));
    };

    const handleSave = async (id: number) => {
        setSavingId(id);
        try {
            const { username, role, disabled } = editStates[id];
            await updateUser(id, { username, role, deleted: disabled });
            onSave && onSave();
        } catch (e) {
            // Optionally show error toast
        }
        setSavingId(null);
    };

    useEffect(() => {
        if (search) {
            setFilteredUsers(users.filter((user: any) => user.username.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())));
        } else {
            setFilteredUsers(users);
        }
    }, [search]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
                >
                    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
                        <div className='bg-white max-h-[90vh] overflow-y-auto no-scrollbar rounded-xl shadow-lg p-6 w-full max-w-2xl mx-2 flex flex-col gap-4 relative'>
                            <div className='flex items-center justify-between'>
                                <h3 className='text-xl font-bold'>Edit Users</h3>
                                <button type="button" className="text-3xl text-[var(--color-error)] cursor-pointer" onClick={onClose}><IoMdCloseCircle size={25} /></button>
                            </div>
                            <div className='flex flex-col gap-4'>
                                <input type="text" placeholder='Search' className='w-full px-2 py-1 border rounded' value={search} onChange={(e) => setSearch(e.target.value)} />
                                <div className="flex items-center gap-2">
                                    <CustomDropdown
                                        label="Filter by Role"
                                        value={roleFilter}
                                        onChange={(val: string) => setRoleFilter(val)}
                                        options={ROLE_OPTIONS}
                                        placeholder="All Roles"
                                    />
                                </div>
                            </div>
                            {loading ? (
                                <div className="text-center py-8">Loading users...</div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {filteredUsers?.filter((user: any) => !roleFilter || user.role === roleFilter || roleFilter === 'ALL').map((user: any) => (
                                        <div key={user.id} className='bg-light rounded-lg p-3 border h-auto'>
                                            <div className='flex items-center justify-between cursor-pointer' onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}>
                                                <h3 className='text-sm font-semibold'>{user.username}</h3>
                                                <button type="button" className="text-3xl"><IoIosArrowDown size={25} className={`transition-transform duration-300 ${expandedId === user.id ? 'rotate-180' : ''}`} /></button>
                                            </div>
                                            <AnimatePresence initial={false}>
                                                {
                                                    expandedId === user.id && (
                                                        <motion.div
                                                            key={user.id}
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto', transition: { opacity: { delay: 0.2 } } }}
                                                            exit={{ opacity: 0, height: 0, transition: { height: { delay: 0.2 } } }}
                                                            className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-3"
                                                        >
                                                            <div className="flex-1">
                                                                <label className="block text-xs font-semibold mb-1">Username</label>
                                                                <input
                                                                    className="w-full px-2 py-1 border rounded"
                                                                    value={editStates[user.id]?.username || ''}
                                                                    onChange={e => handleChange(user.id, 'username', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <label className="block text-xs font-semibold mb-1">Email</label>
                                                                <input
                                                                    className="w-full px-2 py-1 border rounded bg-gray-100 text-gray-500"
                                                                    value={user.email}
                                                                    disabled
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <label className="block text-xs font-semibold mb-1">Role</label>
                                                                <CustomDropdown
                                                                    label=""
                                                                    value={editStates[user.id]?.role}
                                                                    onChange={(val: string) => handleChange(user.id, 'role', val)}
                                                                    options={ROLE_OPTIONS}
                                                                    placeholder="Select Role"
                                                                />
                                                            </div>
                                                            <div className="flex-1 flex flex-col items-start">
                                                                <label className="block text-xs font-semibold mb-1">Disabled</label>
                                                                <button
                                                                    type="button"
                                                                    className={`w-12 h-6 flex items-center rounded-full transition-colors duration-200 p-1 ${editStates[user.id]?.disabled ? 'bg-[var(--color-error)] justify-end' : 'bg-[var(--color-white)] justify-start'}`}
                                                                    onClick={() => handleChange(user.id, 'disabled', !editStates[user.id]?.disabled)}
                                                                    aria-pressed={editStates[user.id]?.disabled}
                                                                >
                                                                    <span className="absolute w-5 h-5 bg-light rounded-full transform transition-transform duration-200" />
                                                                </button>
                                                                <span className="text-xs text-[var(--color-muted)] mt-1">{editStates[user.id]?.disabled ? 'Yes' : 'No'}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-1 justify-end">
                                                                <button
                                                                    type="button"
                                                                    className="py-1 px-4 rounded bg-[var(--color-tertiary)] text-white font-semibold cursor-pointer"
                                                                    onClick={() => handleSave(user.id)}
                                                                    disabled={savingId === user.id}
                                                                >
                                                                    {savingId === user.id ? 'Saving...' : 'Save'}
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )
                                                }
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default EditUserModal
