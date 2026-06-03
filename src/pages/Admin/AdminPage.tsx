import { useMemo, useState } from 'react'
import {
  Award,
  BadgeCheck,
  Ban,
  BarChart3,
  DoorOpen,
  Download,
  Globe,
  Image,
  Lock,
  Monitor,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShieldX,
  Smartphone,
  Trash2,
  Trophy,
  UserCheck,
  Users,
  Wifi,
  X,
} from 'lucide-react'

import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard'
import { useAdminMutations } from '@/hooks/admin/useAdminMutations'
import { exportRoomConversation } from '@/services/adminService'
import { isImageFile, uploadImage } from '@/services/Uploadservice'
import type {
  AdminAccessRule,
  AdminAchievement,
  AdminLoginAudit,
  AdminRoomConversationExport,
  AdminRoomRow,
  AdminUserRow,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
  UpsertAdminAchievementRequest,
} from '@/types/admin'

type AdminTab = 'users' | 'rooms' | 'points' | 'achievements' | 'access'
type LoginEvent = {
  id: string
  user: string
  identifier: string
  ip: string
  device: 'Desktop' | 'Mobile'
  browser: string
  status: 'Success' | 'Failed'
  time: string
  location: string
}

const tabs: Array<{ id: AdminTab; label: string; icon: typeof Users }> = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'rooms', label: 'Rooms', icon: DoorOpen },
  { id: 'points', label: 'Points', icon: Trophy },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'access', label: 'Access Control', icon: ShieldCheck },
]

const categories = ['CheckIn', 'Friendship', 'Chat', 'Reflection', 'Matching', 'Streak'] as const
const statusStyles: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Ready: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Admin: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  User: 'bg-sky-50 text-sky-700 ring-sky-100',
  Suspended: 'bg-rose-50 text-rose-700 ring-rose-100',
  Deleted: 'bg-slate-100 text-slate-600 ring-slate-200',
  Failed: 'bg-amber-50 text-amber-700 ring-amber-100',
  Waiting: 'bg-amber-50 text-amber-700 ring-amber-100',
  Closed: 'bg-slate-100 text-slate-600 ring-slate-200',
  Archived: 'bg-slate-100 text-slate-600 ring-slate-200',
  Block: 'bg-rose-50 text-rose-700 ring-rose-100',
  Draft: 'bg-slate-100 text-slate-600 ring-slate-200',
}

function formatDate(value?: string) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(date)
}

function mapLoginAudit(audit: AdminLoginAudit): LoginEvent {
  return {
    id: audit.id,
    user: audit.user || audit.identifier || 'Unknown',
    identifier: audit.identifier,
    ip: audit.ipAddress,
    device: audit.device === 'Mobile' ? 'Mobile' : 'Desktop',
    browser: audit.browser || 'Unknown',
    status: audit.isSuccess ? 'Success' : 'Failed',
    time: formatDate(audit.createdAt),
    location: audit.location || '-',
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[status] ?? 'bg-slate-100 text-slate-600 ring-slate-200'}`}>
      {status}
    </span>
  )
}

function StatTile({ icon: Icon, label, value, detail }: { icon: typeof Users; label: string; value: string; detail: string }) {
  return (
    <article className="rounded-2xl bg-white px-5 py-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)] ring-1 ring-sky-100">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-sky-950">{value}</p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600"><Icon className="size-5" /></div>
      </div>
      <p className="mt-3 text-sm text-slate-500">{detail}</p>
    </article>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-sky-50 px-5 py-4">
          <h2 className="font-semibold text-sky-950">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X className="size-4" /></button>
        </div>
        <div className="max-h-[calc(90vh-65px)] overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</span>
      <input value={value} type={type} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-sky-100 px-3 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100" />
    </label>
  )
}

function Select<T extends string>({ label, value, values, onChange }: { label: string; value: T; values: readonly T[]; onChange: (value: T) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as T)} className="mt-2 h-11 w-full rounded-xl border border-sky-100 bg-white px-3 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100">
        {values.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
  )
}

function Empty({ label }: { label: string }) {
  return <div className="rounded-2xl bg-white px-5 py-10 text-center text-sm font-medium text-slate-400 ring-1 ring-sky-100">{label}</div>
}

function TableShell({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-2xl bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)] ring-1 ring-sky-100"><div className="overflow-x-auto">{children}</div></div>
}

function IconButton({ title, onClick, children, danger = false }: { title: string; onClick: () => void; children: React.ReactNode; danger?: boolean }) {
  return <button type="button" title={title} onClick={onClick} className={`inline-flex size-9 items-center justify-center rounded-xl transition ${danger ? 'text-rose-500 hover:bg-rose-50' : 'text-slate-500 hover:bg-sky-50 hover:text-sky-700'}`}>{children}</button>
}

function UserDialog({ user, saving, onClose, onSubmit, onDelete }: { user: AdminUserRow | null; saving: boolean; onClose: () => void; onSubmit: (id: string, data: UpdateAdminUserRequest) => Promise<boolean>; onDelete: (id: string) => Promise<boolean> }) {
  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [role, setRole] = useState<'User' | 'Admin'>((user?.role as 'User' | 'Admin') ?? 'User')
  const [status, setStatus] = useState<'Active' | 'Suspended' | 'Deleted'>((user?.status as 'Active' | 'Suspended' | 'Deleted') ?? 'Active')
  const [password, setPassword] = useState('')
  if (!user) return null

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const ok = await onSubmit(user.id, { displayName, role, status, password: password.trim() || undefined })
    if (ok) onClose()
  }

  const remove = async () => {
    if (!confirm(`Delete user ${user.username}?`)) return
    const ok = await onDelete(user.id)
    if (ok) onClose()
  }

  return (
    <Modal title="Edit user" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-xl bg-sky-50 px-4 py-3 text-sm text-slate-600">@{user.username} - {user.email}</div>
        <Field label="Display name" value={displayName} onChange={setDisplayName} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Role" value={role} values={['User', 'Admin'] as const} onChange={setRole} />
          <Select label="Status" value={status} values={['Active', 'Suspended', 'Deleted'] as const} onChange={setStatus} />
        </div>
        <Field label="New password optional" value={password} onChange={setPassword} type="password" />
        <div className="flex justify-between gap-2 pt-2">
          <button type="button" onClick={remove} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"><Trash2 className="size-4" /> Delete</button>
          <div className="flex gap-2"><button type="button" onClick={onClose} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button><button disabled={saving} className="rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white">{saving ? 'Saving...' : 'Save'}</button></div>
        </div>
      </form>
    </Modal>
  )
}

function CreateUserDialog({ saving, onClose, onSubmit }: { saving: boolean; onClose: () => void; onSubmit: (data: CreateAdminUserRequest) => Promise<boolean> }) {
  const [form, setForm] = useState<CreateAdminUserRequest>({ username: '', email: '', displayName: '', password: '', role: 'User' })
  const update = (patch: Partial<CreateAdminUserRequest>) => setForm((current) => ({ ...current, ...patch }))
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const ok = await onSubmit(form)
    if (ok) onClose()
  }

  return (
    <Modal title="Add user" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Username" value={form.username} onChange={(value) => update({ username: value })} />
        <Field label="Email" value={form.email} onChange={(value) => update({ email: value })} />
        <Field label="Display name" value={form.displayName} onChange={(value) => update({ displayName: value })} />
        <Field label="Password" value={form.password} onChange={(value) => update({ password: value })} type="password" />
        <Select label="Role" value={form.role} values={['User', 'Admin'] as const} onChange={(role) => update({ role })} />
        <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onClose} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button><button disabled={saving} className="rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white">{saving ? 'Creating...' : 'Create'}</button></div>
      </form>
    </Modal>
  )
}

function AchievementDialog({ achievement, saving, onClose, onSubmit, onDelete }: { achievement: AdminAchievement | null; saving: boolean; onClose: () => void; onSubmit: (id: string | null, data: UpsertAdminAchievementRequest) => Promise<boolean>; onDelete: (id: string) => Promise<boolean> }) {
  const [form, setForm] = useState<UpsertAdminAchievementRequest>({
    code: achievement?.code ?? '',
    name: achievement?.name ?? '',
    description: achievement?.description ?? '',
    category: (achievement?.category as UpsertAdminAchievementRequest['category']) ?? 'CheckIn',
    iconUrl: achievement?.iconUrl ?? '',
    targetValue: achievement?.targetValue ?? 1,
    isActive: achievement?.isActive ?? true,
  })
  const [uploadingIcon, setUploadingIcon] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const update = (patch: Partial<UpsertAdminAchievementRequest>) => setForm((current) => ({ ...current, ...patch }))
  const handleIconUpload = async (file: File | undefined) => {
    if (!file) return

    setUploadError('')

    if (!isImageFile(file)) {
      setUploadError('Only jpg, png, gif, or webp images are supported.')
      return
    }

    setUploadingIcon(true)
    try {
      const result = await uploadImage(file)
      update({ iconUrl: result.url })
    } catch {
      setUploadError('Could not upload icon. Please try again.')
    } finally {
      setUploadingIcon(false)
    }
  }
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const ok = await onSubmit(achievement?.id ?? null, form)
    if (ok) onClose()
  }
  const remove = async () => {
    if (!achievement || !confirm(`Disable achievement ${achievement.code}?`)) return
    const ok = await onDelete(achievement.id)
    if (ok) onClose()
  }

  return (
    <Modal title={achievement ? 'Edit achievement' : 'Add achievement'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Code" value={form.code} onChange={(value) => update({ code: value })} />
        <Field label="Name" value={form.name} onChange={(value) => update({ name: value })} />
        <Field label="Description" value={form.description} onChange={(value) => update({ description: value })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Category" value={form.category} values={categories} onChange={(category) => update({ category })} />
          <Field label="Target" value={String(form.targetValue)} onChange={(value) => update({ targetValue: Number(value) || 1 })} type="number" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Icon</span>
          <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-sky-100 bg-sky-50/40 p-3 sm:flex-row sm:items-center">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-sky-100">
              {form.iconUrl ? (
                <img src={form.iconUrl} alt="Achievement icon" className="size-full object-cover" />
              ) : (
                <Image className="size-6 text-sky-300" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-600">
                {form.iconUrl || 'No icon uploaded'}
              </p>
              {uploadError && <p className="mt-1 text-xs font-semibold text-rose-600">{uploadError}</p>}
            </div>
            <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white hover:bg-sky-800">
              {uploadingIcon ? 'Uploading...' : 'Upload image'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                disabled={uploadingIcon || saving}
                onChange={(event) => void handleIconUpload(event.target.files?.[0])}
              />
            </label>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600"><input type="checkbox" checked={form.isActive} onChange={(event) => update({ isActive: event.target.checked })} /> Active</label>
        <div className="flex justify-between gap-2 pt-2">
          {achievement ? <button type="button" onClick={remove} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"><Trash2 className="size-4" /> Disable</button> : <span />}
          <div className="flex gap-2"><button type="button" onClick={onClose} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button><button disabled={saving} className="rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white">{saving ? 'Saving...' : 'Save'}</button></div>
        </div>
      </form>
    </Modal>
  )
}

function RoomConversationDialog({ data, onClose }: { data: AdminRoomConversationExport | null; onClose: () => void }) {
  if (!data) return null
  const download = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `room-${data.roomId}-conversation.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Modal title={data.roomName || `${data.roomType} room`} onClose={onClose}>
      <div className="space-y-3">
        {data.messages.length === 0 && <Empty label="No messages in this room" />}
        {data.messages.map((message) => (
          <div key={message.id} className="rounded-xl border border-sky-50 px-4 py-3">
            <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-sky-950">{message.senderName} <span className="text-slate-400">@{message.senderUsername}</span></p><span className="text-xs text-slate-400">{formatDate(message.createdAt)}</span></div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{message.content}</p>
            {message.fileUrl && <a href={message.fileUrl} target="_blank" className="mt-2 inline-flex text-sm font-semibold text-sky-700">{message.fileName || message.fileUrl}</a>}
          </div>
        ))}
        <div className="flex justify-end pt-2"><button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white"><Download className="size-4" /> Download JSON</button></div>
      </div>
    </Modal>
  )
}

function UsersTable({ rows, onEdit }: { rows: AdminUserRow[]; onEdit: (user: AdminUserRow) => void }) {
  if (rows.length === 0) return <Empty label="No users found" />
  return (
    <TableShell>
      <table className="min-w-[1020px] w-full text-left text-sm">
        <thead className="bg-sky-50 text-xs uppercase tracking-[0.14em] text-sky-400"><tr><th className="px-5 py-4 font-semibold">User</th><th className="px-5 py-4 font-semibold">Status</th><th className="px-5 py-4 font-semibold">Role</th><th className="px-5 py-4 font-semibold">Rooms</th><th className="px-5 py-4 font-semibold">Points</th><th className="px-5 py-4 font-semibold">Achievements</th><th className="px-5 py-4 font-semibold">Updated</th><th /></tr></thead>
        <tbody className="divide-y divide-sky-50">{rows.map((user) => <tr key={user.id} onClick={() => onEdit(user)} className="cursor-pointer text-slate-700 transition-colors hover:bg-sky-50/40"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-2xl bg-sky-100 font-semibold text-sky-700">{(user.displayName || user.username).charAt(0).toUpperCase()}</div><div><p className="font-semibold text-sky-950">{user.displayName || user.username}</p><p className="text-xs text-slate-400">@{user.username} - {user.email}</p></div></div></td><td className="px-5 py-4"><StatusBadge status={user.status} /></td><td className="px-5 py-4"><StatusBadge status={user.role} /></td><td className="px-5 py-4">{user.roomCount}</td><td className="px-5 py-4 font-semibold text-sky-800">{user.totalPoints.toLocaleString()}</td><td className="px-5 py-4">{user.achievementCount}</td><td className="px-5 py-4 text-slate-500">{formatDate(user.updatedAt)}</td><td className="px-5 py-4"><Pencil className="size-4 text-slate-400" /></td></tr>)}</tbody>
      </table>
    </TableShell>
  )
}

function RoomsTable({ rows, onExport }: { rows: AdminRoomRow[]; onExport: (room: AdminRoomRow) => void }) {
  if (rows.length === 0) return <Empty label="No rooms found" />
  return (
    <TableShell>
      <table className="min-w-[920px] w-full text-left text-sm">
        <thead className="bg-sky-50 text-xs uppercase tracking-[0.14em] text-sky-400"><tr><th className="px-5 py-4 font-semibold">Room</th><th className="px-5 py-4 font-semibold">Type</th><th className="px-5 py-4 font-semibold">Status</th><th className="px-5 py-4 font-semibold">Members</th><th className="px-5 py-4 font-semibold">Messages</th><th className="px-5 py-4 font-semibold">Owner</th><th className="px-5 py-4 font-semibold">Created</th><th /></tr></thead>
        <tbody className="divide-y divide-sky-50">{rows.map((room) => <tr key={room.id} className="text-slate-700 transition-colors hover:bg-sky-50/40"><td className="px-5 py-4"><p className="font-semibold text-sky-950">{room.name || `${room.roomType} room`}</p><p className="text-xs text-slate-400">{room.id}</p></td><td className="px-5 py-4">{room.roomType}</td><td className="px-5 py-4"><StatusBadge status={room.status} /></td><td className="px-5 py-4">{room.memberCount}</td><td className="px-5 py-4">{room.messageCount}</td><td className="px-5 py-4">{room.createdByDisplayName || room.createdByUsername}</td><td className="px-5 py-4 text-slate-500">{formatDate(room.createdAt)}</td><td className="px-5 py-4"><IconButton title="Export conversation" onClick={() => onExport(room)}><Download className="size-4" /></IconButton></td></tr>)}</tbody>
      </table>
    </TableShell>
  )
}

function AchievementsTable({ rows, onEdit, onAdd }: { rows: AdminAchievement[]; onEdit: (achievement: AdminAchievement) => void; onAdd: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end"><button type="button" onClick={onAdd} className="inline-flex items-center gap-2 rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white"><Plus className="size-4" /> Add achievement</button></div>
      {rows.length === 0 ? <Empty label="No achievements found" /> : <TableShell><table className="min-w-[900px] w-full text-left text-sm"><thead className="bg-sky-50 text-xs uppercase tracking-[0.14em] text-sky-400"><tr><th className="px-5 py-4 font-semibold">Achievement</th><th className="px-5 py-4 font-semibold">Category</th><th className="px-5 py-4 font-semibold">Target</th><th className="px-5 py-4 font-semibold">Status</th><th className="px-5 py-4 font-semibold">Updated</th><th /></tr></thead><tbody className="divide-y divide-sky-50">{rows.map((item) => <tr key={item.id} className="text-slate-700 hover:bg-sky-50/40"><td className="px-5 py-4"><p className="font-semibold text-sky-950">{item.name}</p><p className="text-xs text-slate-400">{item.code}</p></td><td className="px-5 py-4">{item.category}</td><td className="px-5 py-4">{item.targetValue}</td><td className="px-5 py-4"><StatusBadge status={item.isActive ? 'Active' : 'Draft'} /></td><td className="px-5 py-4 text-slate-500">{formatDate(item.updatedAt)}</td><td className="px-5 py-4"><IconButton title="Edit achievement" onClick={() => onEdit(item)}><Pencil className="size-4" /></IconButton></td></tr>)}</tbody></table></TableShell>}
    </div>
  )
}

function AccessTab({ loginHistory, rules, onBlockIp, onBlockBrowser, onDeleteRule }: { loginHistory: LoginEvent[]; rules: AdminAccessRule[]; onBlockIp: (log: LoginEvent) => void; onBlockBrowser: (log: LoginEvent) => void; onDeleteRule: (id: string) => void }) {
  const [filter, setFilter] = useState<'All' | 'Success' | 'Failed'>('All')
  const logs = filter === 'All' ? loginHistory : loginHistory.filter((log) => log.status === filter)
  const failedCount = loginHistory.filter((log) => log.status !== 'Success').length
  const riskIps = new Set(loginHistory.filter((log) => log.status !== 'Success').map((log) => log.ip)).size

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3"><StatTile icon={Wifi} label="Login Events" value={loginHistory.length.toString()} detail="Latest audit records" /><StatTile icon={ShieldX} label="Risk IPs" value={riskIps.toString()} detail="Failed login sources" /><StatTile icon={Lock} label="Failed Logins" value={failedCount.toString()} detail="Current audit window" /></div>
      <section className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)] ring-1 ring-sky-100"><div className="flex items-center justify-between border-b border-sky-50 px-5 py-4"><h2 className="font-semibold text-sky-950">Access Rules</h2><span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">{rules.length}</span></div>{rules.length === 0 ? <p className="px-5 py-8 text-center text-sm text-slate-400">No blocked access rules</p> : <div className="overflow-x-auto"><table className="min-w-[760px] w-full text-left text-sm"><thead className="bg-sky-50 text-xs uppercase tracking-[0.14em] text-sky-400"><tr><th className="px-5 py-3 font-semibold">Type</th><th className="px-5 py-3 font-semibold">Value</th><th className="px-5 py-3 font-semibold">Action</th><th className="px-5 py-3 font-semibold">Reason</th><th className="px-5 py-3 font-semibold">Created</th><th /></tr></thead><tbody className="divide-y divide-sky-50">{rules.map((rule) => <tr key={rule.id}><td className="px-5 py-3">{rule.type}</td><td className="px-5 py-3"><span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">{rule.value}</span></td><td className="px-5 py-3"><StatusBadge status={rule.action} /></td><td className="px-5 py-3 text-slate-500">{rule.reason || '-'}</td><td className="px-5 py-3 text-slate-500">{formatDate(rule.createdAt)}</td><td className="px-5 py-3"><IconButton title="Remove rule" onClick={() => onDeleteRule(rule.id)} danger><Trash2 className="size-4" /></IconButton></td></tr>)}</tbody></table></div>}</section>
      <section className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)] ring-1 ring-sky-100"><div className="flex flex-col gap-3 border-b border-sky-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><Ban className="size-4 text-sky-500" /><h2 className="font-semibold text-sky-950">Login History</h2></div><div className="flex gap-1.5 overflow-x-auto">{(['All', 'Success', 'Failed'] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${filter === item ? 'bg-[linear-gradient(135deg,#3f79aa,#2563eb)] text-white' : 'bg-sky-50 text-sky-600 hover:bg-sky-100'}`}>{item}</button>)}</div></div><div className="overflow-x-auto"><table className="min-w-[1040px] w-full text-left text-sm"><thead className="bg-sky-50 text-xs uppercase tracking-[0.14em] text-sky-400"><tr><th className="px-5 py-3 font-semibold">User</th><th className="px-5 py-3 font-semibold">IP</th><th className="px-5 py-3 font-semibold">Location</th><th className="px-5 py-3 font-semibold">Device</th><th className="px-5 py-3 font-semibold">Browser</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Time</th><th /></tr></thead><tbody className="divide-y divide-sky-50">{logs.map((log) => <tr key={log.id} className="hover:bg-sky-50/40"><td className="px-5 py-3"><p className="font-semibold text-sky-950">{log.user}</p><p className="text-xs text-slate-400">{log.identifier}</p></td><td className="px-5 py-3"><span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">{log.ip}</span></td><td className="px-5 py-3"><span className="flex items-center gap-1.5 text-slate-600"><Globe className="size-3.5 shrink-0 text-slate-400" />{log.location}</span></td><td className="px-5 py-3"><span className="flex items-center gap-1.5 text-slate-600">{log.device === 'Desktop' ? <Monitor className="size-3.5 text-slate-400" /> : <Smartphone className="size-3.5 text-slate-400" />}{log.device}</span></td><td className="px-5 py-3">{log.browser}</td><td className="px-5 py-3"><StatusBadge status={log.status} /></td><td className="px-5 py-3 text-xs text-slate-500">{log.time}</td><td className="px-5 py-3"><div className="flex gap-1"><IconButton title="Block IP" onClick={() => onBlockIp(log)} danger><Ban className="size-4" /></IconButton><IconButton title="Block browser" onClick={() => onBlockBrowser(log)} danger><ShieldX className="size-4" /></IconButton></div></td></tr>)}</tbody></table></div></section>
    </div>
  )
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<AdminUserRow | null>(null)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState<AdminAchievement | null>(null)
  const [showAchievementDialog, setShowAchievementDialog] = useState(false)
  const [roomExport, setRoomExport] = useState<AdminRoomConversationExport | null>(null)
  const [loadingRoomExport, setLoadingRoomExport] = useState(false)
  const { users, rooms, loginAudits, achievements, accessRules, loading, error, reload } = useAdminDashboard()
  const adminMutations = useAdminMutations(reload)

  const loginHistory = useMemo(() => loginAudits.map(mapLoginAudit), [loginAudits])
  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return users
    return users.filter((user) => [user.displayName, user.username, user.email, user.id, user.role, user.status].some((value) => value.toLowerCase().includes(keyword)))
  }, [searchTerm, users])
  const filteredRooms = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return rooms
    return rooms.filter((room) => [room.name || '', room.roomType, room.status, room.createdByDisplayName, room.createdByUsername, room.id].some((value) => value.toLowerCase().includes(keyword)))
  }, [searchTerm, rooms])
  const filteredAchievements = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return achievements
    return achievements.filter((item) => [item.code, item.name, item.category, item.description].some((value) => value.toLowerCase().includes(keyword)))
  }, [achievements, searchTerm])

  const activeUsers = users.filter((user) => user.status === 'Active').length
  const openRooms = rooms.filter((room) => ['Active', 'Ready', 'Waiting'].includes(room.status)).length
  const totalAchievements = users.reduce((sum, user) => sum + user.achievementCount, 0)
  const totalPoints = users.reduce((sum, user) => sum + user.totalPoints, 0)

  const handleExportRoom = async (room: AdminRoomRow) => {
    setLoadingRoomExport(true)
    try {
      setRoomExport(await exportRoomConversation(room.id))
    } finally {
      setLoadingRoomExport(false)
    }
  }

  return (
    <section className="space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <header className="rounded-3xl bg-[linear-gradient(135deg,#3f79aa_0%,#2563eb_60%,#1d4ed8_100%)] px-6 py-6 text-white shadow-[0_20px_50px_rgba(37,99,235,0.28)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-100"><ShieldCheck className="size-3.5" />Admin console</div><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Manage users, rooms and access</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-sky-100/80">Live admin dashboard connected to Emotion Connect API.</p></div><div className="grid gap-3 sm:grid-cols-3 xl:min-w-[430px]">{[['Open rooms', openRooms.toString()], ['Active users', activeUsers.toString()], ['Login audits', loginHistory.length.toString()]].map(([label, value]) => <div key={label} className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm"><p className="text-xs text-sky-100/80">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>)}</div></div>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatTile icon={UserCheck} label="Users" value={users.length.toString()} detail={`${activeUsers} active accounts`} /><StatTile icon={DoorOpen} label="Rooms" value={rooms.length.toString()} detail={`${openRooms} open or waiting rooms`} /><StatTile icon={BarChart3} label="Points" value={totalPoints.toLocaleString()} detail="Total tracked progress points" /><StatTile icon={BadgeCheck} label="Achievements" value={totalAchievements.toString()} detail="Unlocked by listed users" /></div>
      <div className="rounded-3xl bg-white/90 p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)] ring-1 ring-sky-100"><div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"><div className="flex gap-2 overflow-x-auto pb-1">{tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveTab(id)} className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl px-4 text-sm font-semibold transition ${activeTab === id ? 'bg-[linear-gradient(135deg,#3f79aa,#2563eb)] text-white shadow-[0_12px_28px_rgba(37,99,235,0.30)]' : 'bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-800'}`}><Icon className="size-4" />{label}</button>)}</div><div className="flex min-w-0 flex-col gap-3 sm:flex-row">{activeTab !== 'access' && activeTab !== 'points' && <label className="relative min-w-0 sm:w-[280px]"><Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-sky-400" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search" className="h-11 w-full rounded-2xl border border-sky-100 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100" /></label>}{activeTab === 'users' && <button type="button" onClick={() => setShowCreateUser(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white"><Plus className="size-4" />Add user</button>}<button type="button" onClick={() => void reload()} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#3f79aa,#2563eb)] px-4 text-sm font-semibold text-white"><RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />Refresh</button></div></div></div>
      {(error || adminMutations.error) && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error || adminMutations.error}</div>}
      {loading && <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-500 ring-1 ring-sky-100">Dang tai du lieu admin...</div>}
      {loadingRoomExport && <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-500 ring-1 ring-sky-100">Dang xuat hoi thoai...</div>}
      {activeTab === 'users' && <UsersTable rows={filteredUsers} onEdit={setSelectedUser} />}
      {activeTab === 'rooms' && <RoomsTable rows={filteredRooms} onExport={handleExportRoom} />}
      {activeTab === 'points' && <Empty label="Points management will be implemented later" />}
      {activeTab === 'achievements' && <AchievementsTable rows={filteredAchievements} onEdit={(item) => { setSelectedAchievement(item); setShowAchievementDialog(true) }} onAdd={() => { setSelectedAchievement(null); setShowAchievementDialog(true) }} />}
      {activeTab === 'access' && <AccessTab loginHistory={loginHistory} rules={accessRules} onBlockIp={(log) => void adminMutations.createAccessRule({ type: 'Ip', value: log.ip, reason: `Blocked from login audit ${log.id}` })} onBlockBrowser={(log) => void adminMutations.createAccessRule({ type: 'Browser', value: log.browser, reason: `Blocked from login audit ${log.id}` })} onDeleteRule={(id) => void adminMutations.deleteAccessRule(id)} />}
      {selectedUser && <UserDialog user={selectedUser} saving={adminMutations.saving} onClose={() => setSelectedUser(null)} onSubmit={adminMutations.updateUser} onDelete={adminMutations.deleteUser} />}
      {showCreateUser && <CreateUserDialog saving={adminMutations.saving} onClose={() => setShowCreateUser(false)} onSubmit={adminMutations.createUser} />}
      {showAchievementDialog && <AchievementDialog achievement={selectedAchievement} saving={adminMutations.saving} onClose={() => setShowAchievementDialog(false)} onSubmit={(id, data) => id ? adminMutations.updateAchievement(id, data) : adminMutations.createAchievement(data)} onDelete={adminMutations.deleteAchievement} />}
      {roomExport && <RoomConversationDialog data={roomExport} onClose={() => setRoomExport(null)} />}
    </section>
  )
}
