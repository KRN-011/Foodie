import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function CustomDropdown({ label, value, onChange, options, placeholder = 'Select', searchable = false, multi = false, error, onAddNew, isAdmin }: any) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const filtered = options.filter((opt: any) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );
    const handleSelect = (opt: any) => {
        if (multi) {
            if (value.includes(opt.value)) {
                onChange(value.filter((v: any) => v !== opt.value));
            } else {
                onChange([...value, opt.value]);
            }
        } else {
            onChange(opt.value);
            setOpen(false);
        }
    };
    return (
        <div className="mb-4 w-full relative h-full">
            <label className="block mb-2 text-sm" style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-saira)' }}>{label}</label>
            <div
                className="w-full px-3 py-2 border rounded bg-[var(--color-light)] flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--color-tertiary)', fontFamily: 'var(--font-saira)', color: 'var(--color-dark)' }}
                onClick={() => setOpen(o => !o)}
                tabIndex={0}
            >
                <span className="truncate text-sm">
                    {multi
                        ? (options.filter((opt: any) => value.includes(opt.value)).map((opt: any) => opt.label).join(', ') || placeholder)
                        : (options.find((opt: any) => opt.value === value)?.label || placeholder)}
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
                        <div className="p-2 z-50">
                            {searchable && (
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full px-2 py-1 rounded border border-[var(--color-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-light)] mb-2"
                                    style={{ fontFamily: 'var(--font-saira)' }}
                                />
                            )}
                            <div className="flex flex-col gap-1">
                                {filtered.map((opt: any) => (
                                    <button
                                        key={opt.value}
                                        className={`text-left px-2 py-1 rounded hover:bg-[var(--color-tertiary)] hover:text-[var(--color-white)] transition-colors ${multi && value.includes(opt.value) ? 'font-bold text-[var(--color-tertiary)]' : (!multi && value === opt.value ? 'font-bold text-[var(--color-tertiary)]' : '')}`}
                                        onClick={() => handleSelect(opt)}
                                        style={{ fontFamily: 'var(--font-saira)' }}
                                        type="button"
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                                <>
                                    {
                                        filtered.length === 0 && (
                                            <span className="text-xs text-[var(--color-muted)] px-2">No options found</span>
                                        )
                                    }
                                    {onAddNew && isAdmin && (
                                        <button
                                            type="button"
                                            className="mt-2 px-2 py-1 bg-[var(--color-tertiary)] text-white rounded text-xs hover:bg-[var(--color-quaternary)] cursor-pointer"
                                            onClick={() => { setOpen(false); onAddNew(); }}
                                        >
                                            + Add new category
                                        </button>
                                    )}
                                </>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {error && <span className="text-[var(--color-error)] text-xs mt-1 block">{error}</span>}
        </div>
    );
}

export default CustomDropdown; 