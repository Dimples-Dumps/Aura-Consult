import React, { useState, useEffect } from 'react';
import { Edit, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';

const getStoredUsers = () => JSON.parse(localStorage.getItem('aura_users') || '[]');
const saveUsers = (users) => localStorage.setItem('aura_users', JSON.stringify(users));

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDepartment, setEditDepartment] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const all = getStoredUsers();
    setStudents(all.filter(u => u.role === 'student'));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this student?')) {
      const updated = getStoredUsers().filter(u => u.id !== id);
      saveUsers(updated);
      loadStudents();
      toast.success('Student deleted');
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setEditName(student.name);
    setEditDepartment(student.department || '');
  };

  const handleUpdate = (id) => {
    const all = getStoredUsers();
    const updated = all.map(u => u.id === id ? { ...u, name: editName, department: editDepartment } : u);
    saveUsers(updated);
    setEditingId(null);
    loadStudents();
    toast.success('Student updated');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-honey-100">
      <h1 className="text-2xl font-bold gradient-text mb-4">Manage Students</h1>
      {students.length === 0 ? (
        <p className="text-gray-500">No students found.</p>
      ) : (
        <div className="space-y-3">
          {students.map(student => (
            <div key={student.id} className="flex justify-between items-center p-3 bg-honey-50 rounded-lg">
              {editingId === student.id ? (
                <div className="flex-1 flex gap-2">
                  <input value={editName} onChange={e => setEditName(e.target.value)} className="border rounded px-2 py-1 flex-1" />
                  <input value={editDepartment} onChange={e => setEditDepartment(e.target.value)} className="border rounded px-2 py-1 flex-1" placeholder="Dept" />
                  <button onClick={() => handleUpdate(student.id)} className="text-green-600">Save</button>
                  <button onClick={() => setEditingId(null)} className="text-gray-500">Cancel</button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.email} • {student.department || 'No dept'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(student)} className="text-tomato-500"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(student.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageStudents;