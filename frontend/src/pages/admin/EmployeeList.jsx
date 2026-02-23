// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "@/utils/api";

// export default function EmployeeList() {
//   const [employees, setEmployees] = useState([]); // stores ALL users
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     async function fetchEmployees() {
//       try {
//         const res = await api.get('/admin/employees');
//         setEmployees(res.data); // save all employees
//       } catch (err) {
//         setError(err.response?.data?.error || err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchEmployees();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p style={{ color: 'red' }}>{error}</p>;

//   // Separate users by role
//   const admins = employees.filter(emp => emp.role === 'admin');
//   const employeesOnly = employees.filter(emp => emp.role === 'employee');

//   return (
//     <div>
//       <h1>Manage Employees</h1>
//       <Link to="/admin/dashboard">← Back to Dashboard</Link>
//       <br /><br />

//       {/* ================= ADMIN SECTION ================= */}
//       <h2>Admins ({admins.length})</h2>
//         {admins.length === 0 && <p>No admins found.</p>}
//         {admins.length > 0 && (
//         <table border="1" cellPadding="8">
//             <thead>
//             <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Timezone</th>
//                 <th>Actions</th>
//                 {/* ← no Shift Start / Shift End */}
//             </tr>
//             </thead>
//             <tbody>
//             {admins.map(emp => (
//                 <tr key={emp.uid}>
//                 <td>{emp.name}</td>
//                 <td>{emp.email}</td>
//                 <td>{emp.timezone}</td>
//                 <td><Link to={`/admin/employees/${emp.uid}`}>Edit</Link></td>
//                 </tr>
//             ))}
//             </tbody>
//         </table>
//         )}

//         <br /><br />

//       {/* ================= EMPLOYEE SECTION ================= */}
//       <h2>Employees ({employeesOnly.length})</h2>

//       {employeesOnly.length === 0 && <p>No employees found.</p>}

//       {employeesOnly.length > 0 && (
//         <table border="1" cellPadding="8">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Timezone</th>
//               <th>Shift Start</th>
//               <th>Shift End</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {employeesOnly.map(emp => (
//               <tr key={emp.uid}>
//                 <td>{emp.name}</td>
//                 <td>{emp.email}</td>
//                 <td>{emp.timezone}</td>
//                 <td>{emp.schedule?.start}</td>
//                 <td>{emp.schedule?.end}</td>
//                 <td>
//                   <Link to={`/admin/employees/${emp.uid}`}>Edit</Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
// =========================COMMENT ARE FOR EASIER DEBUGGING============================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/utils/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchEmployees() {
            try {
                const res = await api.get('/admin/employees');
                setEmployees(res.data);
            } catch (err) {
                setError(err.response?.data?.error || err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchEmployees();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <p className="text-sm text-slate-400">Loading employees...</p>
        </div>
    );

    if (error) return (
        <div className="p-8">
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-4 py-3">{error}</p>
        </div>
    );

    const admins = employees.filter(emp => emp.role === 'admin');
    const employeesOnly = employees.filter(emp => emp.role === 'employee');

    return (
        <div className="p-8">

            {/* Page Header */}
            <div className="mb-8">
                <p className="text-xs font-medium text-blue-500 uppercase tracking-widest mb-2">Admin / Employees</p>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Manage Employees</h1>
                <p className="text-slate-400 text-sm">View and edit all employee accounts and schedules.</p>
            </div>

            <Separator className="mb-8 bg-slate-200" />

            {/* Admins */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Admins</p>
                    <Badge className="bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-50 text-xs">
                        {admins.length}
                    </Badge>
                </div>

                {admins.length === 0 ? (
                    <p className="text-sm text-slate-400">No admins found.</p>
                ) : (
                    <Card className="bg-white border border-slate-200 shadow-none">
                        <CardContent className="p-0">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="text-left text-xs font-medium text-slate-400 px-5 py-3">Name</th>
                                        <th className="text-left text-xs font-medium text-slate-400 px-5 py-3">Email</th>
                                        <th className="text-left text-xs font-medium text-slate-400 px-5 py-3">Timezone</th>
                                        <th className="text-left text-xs font-medium text-slate-400 px-5 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map((emp, i) => (
                                        <tr
                                            key={emp.uid}
                                            className={`hover:bg-slate-50 transition-colors ${i !== admins.length - 1 ? 'border-b border-slate-100' : ''}`}
                                        >
                                            <td className="px-5 py-3 font-medium text-slate-800">{emp.name}</td>
                                            <td className="px-5 py-3 text-slate-500">{emp.email}</td>
                                            <td className="px-5 py-3 text-slate-500">{emp.timezone}</td>
                                            <td className="px-5 py-3">
                                                <Link to={`/admin/employees/${emp.uid}`}>
                                                    <Button variant="outline" size="sm" className="text-xs border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 h-7">
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Employees */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Employees</p>
                    <Badge className="bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-100 text-xs">
                        {employeesOnly.length}
                    </Badge>
                </div>

                {employeesOnly.length === 0 ? (
                    <p className="text-sm text-slate-400">No employees found.</p>
                ) : (
                    <Card className="bg-white border border-slate-200 shadow-none">
                        <CardContent className="p-0">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="text-left text-xs font-medium text-slate-400 px-5 py-3">Name</th>
                                        <th className="text-left text-xs font-medium text-slate-400 px-5 py-3">Email</th>
                                        <th className="text-left text-xs font-medium text-slate-400 px-5 py-3">Timezone</th>
                                        <th className="text-left text-xs font-medium text-slate-400 px-5 py-3">Shift</th>
                                        <th className="text-left text-xs font-medium text-slate-400 px-5 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeesOnly.map((emp, i) => (
                                        <tr
                                            key={emp.uid}
                                            className={`hover:bg-slate-50 transition-colors ${i !== employeesOnly.length - 1 ? 'border-b border-slate-100' : ''}`}
                                        >
                                            <td className="px-5 py-3 font-medium text-slate-800">{emp.name}</td>
                                            <td className="px-5 py-3 text-slate-500">{emp.email}</td>
                                            <td className="px-5 py-3 text-slate-500">{emp.timezone}</td>
                                            <td className="px-5 py-3">
                                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-mono">
                                                    {emp.schedule?.start} – {emp.schedule?.end}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <Link to={`/admin/employees/${emp.uid}`}>
                                                    <Button variant="outline" size="sm" className="text-xs border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 h-7">
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}