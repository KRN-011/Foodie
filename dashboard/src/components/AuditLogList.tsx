import { motion, AnimatePresence } from 'framer-motion';

interface AuditLog {
  id: number;
  action: string;
  model: string;
  details?: string;
  createdAt: string;
}

interface AuditLogListProps {
  auditLogs: AuditLog[];
}

const AuditLogList = ({ auditLogs }: AuditLogListProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="bg-[var(--color-secondary)] rounded-xl shadow p-4 mb-4 h-56 flex flex-col"
      >
        <h2 className="text-lg font-bold text-[var(--color-dark)] font-saira mb-2">Recent Audit Logs</h2>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <ul className="space-y-2">
            {auditLogs.map((log) => (
              <li key={log.id} className="bg-[var(--color-light)] rounded p-2 text-[var(--color-dark)] shadow-sm">
                <span className="font-semibold">{log.action}</span> on <span className="font-medium">{log.model}</span>
                {log.details && <span className="block text-xs text-[var(--color-muted)]">{log.details}</span>}
                <span className="block text-xs text-[var(--color-muted)]">{new Date(log.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuditLogList; 