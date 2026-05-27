import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { getAllStudents } from '../services/userService';
import toast from 'react-hot-toast';

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDepartment, setEditDepartment] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const allStudents = await getAllStudents();
      setStudents(allStudents);
    } catch (error) {
      console.error('Failed to load students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this student? This action cannot be undone.')) {
      toast.error('Delete is disabled in demo mode. In production, this would remove the student.');
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setEditName(student.name);
    setEditDepartment(student.department || '');
  };

  const handleUpdate = async (id) => {
    const updated = students.map(s => s.id === id ? { ...s, name: editName, department: editDepartment } : s);
    setStudents(updated);
    setEditingId(null);
    toast.success('Student updated (demo only, changes not persisted)');
  };

  if (loading) {
    return <div className="bg-white rounded-xl p-6 text-center"><div className="loader-sm mx-auto" /></div>;
  }

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

export default ViewStudents;