import React, { useState, useEffect } from 'react';
import { Edit, Trash2, UserPlus, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const getStoredUsers = () => {
  const stored = localStorage.getItem('aura_users');
  if (stored) return JSON.parse(stored);
  return [];
};

const saveUsers = (users) => localStorage.setItem('aura_users', JSON.stringify(users));

const EditUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '', department: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: 'password123', role: 'student', department: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(getStoredUsers());
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updated = users.filter(u => u.id !== id);
      saveUsers(updated);
      setUsers(updated);
      toast.success('User deleted');
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditForm({ name: user.name, email: user.email, role: user.role, department: user.department || '' });
  };

  const handleUpdate = (id) => {
    const updatedUsers = users.map(u => u.id === id ? { ...u, ...editForm } : u);
    saveUsers(updatedUsers);
    setUsers(updatedUsers);
    setEditingId(null);
    toast.success('User updated');
  };

  const handleAdd = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error('Please fill required fields');
      return;
    }
    const exists = users.some(u => u.email === newUser.email);
    if (exists) {
      toast.error('Email already exists');
      return;
    }
    const newId = `${newUser.role}_${Date.now()}`;
    const userToAdd = { ...newUser, id: newId };
    const updated = [...users, userToAdd];
    saveUsers(updated);
    setUsers(updated);
    setShowAdd(false);
    setNewUser({ name: '', email: '', password: 'password123', role: 'student', department: '' });
    toast.success('User added');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-honey-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold gradient-text">Manage Users</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-tomato-500 text-white rounded-lg hover:bg-tomato-600">
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-honey-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-honey-100">
                {editingId === user.id ? (
                  <>
                    <td className="p-2"><input className="border rounded p-1 w-full" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></td>
                    <td className="p-2"><input className="border rounded p-1 w-full" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} /></td>
                    <td className="p-2">
                      <select className="border rounded p-1" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                        <option value="student">Student</option>
                        <option value="lecturer">Lecturer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-2"><input className="border rounded p-1 w-full" value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})} /></td>
                    <td className="p-2 text-center">
                      <button onClick={() => handleUpdate(user.id)} className="text-green-600 mr-2"><Save className="w-4 h-4" /></button>
                      <button onClick={() => setEditingId(null)} className="text-gray-500"><X className="w-4 h-4" /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 capitalize">{user.role}</td>
                    <td className="p-3">{user.department || '—'}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => handleEdit(user)} className="text-tomato-500 mr-2"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <input type="text" placeholder="Name" className="w-full border rounded p-2 mb-2" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
            <input type="email" placeholder="Email" className="w-full border rounded p-2 mb-2" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            <select className="w-full border rounded p-2 mb-2" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="admin">Admin</option>
            </select>
            <input type="text" placeholder="Department" className="w-full border rounded p-2 mb-4" value={newUser.department} onChange={e => setNewUser({...newUser, department: e.target.value})} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 bg-tomato-500 text-white rounded">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUsers;