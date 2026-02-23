// import { useActionState } from "@/hooks/useActionState";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import FormInput from "@/components/FormInput";
// import api from "@/utils/api";

// export default function EditEmployee() {
//     const { uid } = useParams();
//     const navigate = useNavigate();
//     const [state, { updateForm, setLoading, setError }] = useActionState({
//         name: '',
//         timezone: '',
//         scheduleStart: '09:00',
//         scheduleEnd: '18:00',
//         role: 'employee'
//     });
//     const { form, loading, error } = state;
//     const [saving, setSaving ] = useState(false);
//     const [success, setSuccess] = useState('');

//     useEffect (() => {
//         async function fetchEmployee() {
//             try {
//                 setLoading(true);
//                 const res = await api.get(`/admin/employees/${uid}`);
//                 const emp = res.data;
//                 console.log('fetchiing specific employee');

//                 updateForm('name', emp.name);
//                 updateForm('timezone', emp.timezone);
//                 updateForm('scheduleStart', emp.schedule?.start || '9:00');
//                 updateForm('scheduleEnd', emp.schedule?.end || '18:00');
//                 updateForm('role', emp.role);

//             } catch (err) {
//                 console.error(err.message);
//                 setError(err.message);
//             }finally {
//                 setLoading(false);
//             }
            
//         }

//         fetchEmployee();
//     }, [uid]);

//     function handleChange (e) {
//         updateForm(e.target.name, e.target.value);
//     }

//     async function handleSubmit(e) {
//         e.preventDefault();
//         setError('');
//         setSuccess('');
//         setSaving(true);

//         try {
//             console.log('submitting edit employeee');
//             await api.patch(`/admin/employees/${uid}`, {
//                 name:form.name,
//                 timezone: form.timezone,
//                 scheduleStart: form.scheduleStart,
//                 scheduleEnd: form.scheduleEnd,
//                 role: form.role
//             });

//             setSuccess('employee updated successfully.');
//             setTimeout(() => navigate('/admin/employees'), 1500);
//         } catch (err) {
//             setError(err.message);
//             console.error(err.message);
//         } finally {
//             setSaving(false);
//         }
//     }

//     if (loading) return <p>Loading...</p>

//     return (
//         <div>
//             <h1>Edit Employee</h1>
//             <Link to="/admin/employees">← Back to Employees</Link>

//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             {success && <p style={{ color: 'green' }}>{success}</p>}

//             <form onSubmit={handleSubmit}>
//                 <FormInput
//                 label="Full Name"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//                 />

//                 <select name="timezone" value={form.timezone} onChange={handleChange}>
//                 <option value="Asia/Manila">Asia/Manila</option>
//                 <option value="Asia/Singapore">Asia/Singapore</option>
//                 <option value="UTC">UTC</option>
//                 </select>

//                 <FormInput
//                 label="Shift Start"
//                 type="time"
//                 name="scheduleStart"
//                 value={form.scheduleStart}
//                 onChange={handleChange}
//                 />

//                 <FormInput
//                 label="Shift End"
//                 type="time"
//                 name="scheduleEnd"
//                 value={form.scheduleEnd}
//                 onChange={handleChange}
//                 />

//                 <select name="role" value={form.role} onChange={handleChange}>
//                 <option value="employee">Employee</option>
//                 <option value="admin">Admin</option>
//                 </select>

//                 <button type="submit" disabled={saving}>
//                 {saving ? 'Saving...' : 'Save Changes'}
//                 </button>
//             </form>
//         </div>
//     );
// }
// COMMENTS HERE ARE FOR DEBUGGING SIMPLEST


import { useActionState } from "@/hooks/useActionState";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "@/utils/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function EditEmployee() {
    const { uid } = useParams();
    const navigate = useNavigate();
    const [state, { updateForm, setLoading, setError }] = useActionState({
        name: '',
        timezone: '',
        scheduleStart: '09:00',
        scheduleEnd: '18:00',
        role: 'employee'
    });
    const { form, loading, error } = state;
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchEmployee() {
            try {
                setLoading(true);
                const res = await api.get(`/admin/employees/${uid}`);
                const emp = res.data;
                updateForm('name', emp.name);
                updateForm('timezone', emp.timezone);
                updateForm('scheduleStart', emp.schedule?.start || '09:00');
                updateForm('scheduleEnd', emp.schedule?.end || '18:00');
                updateForm('role', emp.role);
            } catch (err) {
                setError(err.message);
                toast.error("Failed to load employee data.");
            } finally {
                setLoading(false);
            }
        }
        fetchEmployee();
    }, [uid]);

    function handleChange(e) {
        updateForm(e.target.name, e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await api.patch(`/admin/employees/${uid}`, {
                name: form.name,
                timezone: form.timezone,
                scheduleStart: form.scheduleStart,
                scheduleEnd: form.scheduleEnd,
                role: form.role,
            });
            toast.success("Employee updated successfully.");
            setTimeout(() => navigate('/admin/employees'), 1200);
        } catch (err) {
            setError(err.message);
            toast.error("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <p className="text-sm text-slate-400">Loading employee data...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Top Bar */}
            <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
                <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-blue-500">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span className="font-semibold text-sm text-slate-800 tracking-tight">MiniHCM</span>
                    </div>
                    <Link
                        to="/admin/employees"
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-500 transition-colors"
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back to Employees
                    </Link>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-2xl mx-auto px-6 py-12">

                {/* Page Header */}
                <div className="mb-8">
                    <p className="text-xs font-medium text-blue-500 uppercase tracking-widest mb-2">
                        Admin / Employees
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Edit Employee</h1>
                    <p className="text-slate-400 text-sm">Update employee profile, schedule, and role.</p>
                </div>

                <Separator className="mb-8 bg-slate-200" />

                <Card className="bg-white border border-slate-200 shadow-none">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base text-slate-800">Profile Details</CardTitle>
                        <CardDescription className="text-xs text-slate-400">
                            Changes will take effect immediately after saving.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Name */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-slate-600">Full Name</Label>
                                <Input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter full name"
                                    className="border-slate-200 focus-visible:ring-blue-400 text-sm"
                                />
                            </div>

                            {/* Timezone */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-slate-600">Timezone</Label>
                                <Select
                                    value={form.timezone}
                                    onValueChange={(val) => updateForm('timezone', val)}
                                >
                                    <SelectTrigger className="border-slate-200 focus:ring-blue-400 text-sm">
                                        <SelectValue placeholder="Select timezone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Asia/Manila">Asia/Manila</SelectItem>
                                        <SelectItem value="Asia/Singapore">Asia/Singapore</SelectItem>
                                        <SelectItem value="UTC">UTC</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Schedule */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-slate-600">Shift Start</Label>
                                    <Input
                                        type="time"
                                        name="scheduleStart"
                                        value={form.scheduleStart}
                                        onChange={handleChange}
                                        className="border-slate-200 focus-visible:ring-blue-400 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-slate-600">Shift End</Label>
                                    <Input
                                        type="time"
                                        name="scheduleEnd"
                                        value={form.scheduleEnd}
                                        onChange={handleChange}
                                        className="border-slate-200 focus-visible:ring-blue-400 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-slate-600">Role</Label>
                                <Select
                                    value={form.role}
                                    onValueChange={(val) => updateForm('role', val)}
                                >
                                    <SelectTrigger className="border-slate-200 focus:ring-blue-400 text-sm">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="employee">Employee</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {error && (
                                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                                    {error}
                                </p>
                            )}

                            <Separator className="bg-slate-100" />

                            <div className="flex items-center justify-end gap-3 pt-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate('/admin/employees')}
                                    className="text-slate-400 hover:text-slate-600 text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={saving}
                                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-5"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>

                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}