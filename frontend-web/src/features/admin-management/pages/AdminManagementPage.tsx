import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiCheck, FiPlus, FiShield, FiUser } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Avatar from '@/components/ui/Avatar';
import DataTable, { type Column } from '@/components/tables/DataTable';
import { useAdminAccounts, useCreateAdmin, useToggleAdminStatus, useUpdateAdminRole } from '../hooks/useAdminManagement';
import { rolePermissions, roleTone } from '../mock/data';
import type { AdminAccount, AdminRole, CreateAdminInput } from '../types';
import { toast } from '@/app/store/toast-store';

const roles: AdminRole[] = ['Super Admin', 'Operations', 'Finance', 'Support', 'Viewer'];

export default function AdminManagementPage() {
  const { data: admins, isLoading } = useAdminAccounts();
  const createMutation = useCreateAdmin();
  const roleMutation = useUpdateAdminRole();
  const statusMutation = useToggleAdminStatus();
  const [createOpen, setCreateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAdminInput>({ defaultValues: { role: 'Support' } });

  const activeAdmins = (admins ?? []).filter((admin) => admin.status === 'Active').length;
  const suspendedAdmins = (admins ?? []).length - activeAdmins;

  const handleRoleChange = async (admin: AdminAccount, role: AdminRole) => {
    try {
      await roleMutation.mutateAsync({ id: admin.id, role });
      toast.success('Role updated', `${admin.name} is now ${role}.`);
    } catch {
      toast.error('Update failed', 'Unable to change the role.');
    }
  };

  const handleToggleStatus = async (admin: AdminAccount) => {
    try {
      await statusMutation.mutateAsync(admin.id);
      toast.success(
        admin.status === 'Active' ? 'Admin suspended' : 'Admin reactivated',
        `${admin.name} ${admin.status === 'Active' ? 'lost access to the dashboard.' : 'can now sign in again.'}`,
      );
    } catch {
      toast.error('Update failed', 'Unable to change the status.');
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success('Admin invited', `An invite was sent to ${values.email}.`);
      setCreateOpen(false);
      reset();
    } catch {
      toast.error('Invite failed', 'Unable to create the admin account.');
    }
  });

  const columns: Array<Column<AdminAccount>> = [
    {
      key: 'admin',
      header: 'Admin',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="md" />
          <div>
            <p className="font-semibold text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      cell: (row) => (
        <Select
          className="w-40"
          value={row.role}
          onChange={(event) => handleRoleChange(row, event.target.value as AdminRole)}
          options={roles.map((role) => ({ label: role, value: role }))}
        />
      ),
    },
    { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    { key: 'lastLogin', header: 'Last Login', cell: (row) => <span className="text-sm text-slate-600">{row.lastLogin}</span> },
    { key: 'createdAt', header: 'Added', cell: (row) => <span className="text-sm text-slate-600">{row.createdAt}</span> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (row) =>
        row.role !== 'Super Admin' ? (
          <Button variant={row.status === 'Active' ? 'outline' : 'ghost'} size="xs" onClick={() => handleToggleStatus(row)}>
            {row.status === 'Active' ? 'Suspend' : 'Reactivate'}
          </Button>
        ) : (
          <Badge tone="orange" className="ml-auto">
            <FiShield size={11} /> Owner
          </Badge>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Management"
        description="Manage team members, roles, and access to the dashboard."
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <FiPlus size={14} /> Add Admin
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Admins" value={String(admins?.length ?? 0)} icon={FiUser} tone="orange" />
        <StatCard label="Active" value={String(activeAdmins)} icon={FiCheck} tone="green" />
        <StatCard label="Suspended" value={String(suspendedAdmins)} icon={FiShield} tone="red" />
        <StatCard label="Operations Staff" value={String((admins ?? []).filter((admin) => admin.role === 'Operations').length)} icon={FiShield} tone="blue" />
      </div>

      <Card title="Team Members" subtitle="Invite and manage dashboard access" bodyClassName="p-0">
        <DataTable
          columns={columns}
          data={admins ?? []}
          rowKey={(row) => row.id}
          loading={isLoading}
          emptyTitle="No admins yet"
          emptyDescription="Invite your first team member to get started."
        />
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {rolePermissions.map((permission) => (
          <Card key={permission.role}>
            <div className="mb-3 flex items-center gap-2">
              <Badge tone={permission.color}>{permission.role}</Badge>
            </div>
            <ul className="space-y-2">
              {permission.permissions.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <FiCheck size={14} className="mt-0.5 shrink-0 text-primary-500" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Invite Admin" subtitle="The invite grants dashboard access" size="sm">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Full name"
            placeholder="e.g. John Doe"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <Input
            label="Work email"
            type="email"
            placeholder="name@hatodgo.ph"
            error={errors.email?.message}
            {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })}
          />
          <Select
            label="Role"
            options={roles.map((role) => ({ label: role, value: role }))}
            {...register('role', { required: 'Role is required' })}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={createMutation.isPending}>
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
