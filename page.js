'use client';

import React, { useState, useEffect } from 'react';

export default function TiaraAcademicSpace() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('tiara_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran file maksimal 3MB ya!');
      e.target.value = null;
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFileData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title || !course) return alert('Judul tugas dan Mata Kuliah wajib diisi!');

    const newTask = {
      id: Date.now(),
      title,
      course,
      fileName: fileName || null,
      fileData: fileData || null,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    localStorage.setItem('tiara_tasks', JSON.stringify(updatedTasks));

    setTitle('');
    setCourse('');
    setFileName('');
    setFileData(null);
    e.target.reset();
  };

  const handleDelete = (id) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('tiara_tasks', JSON.stringify(updatedTasks));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-[#0f172a] text-white py-6 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">TIARA ACADEMIC SPACE</h1>
            <p className="text-blue-300 text-sm">Arsip Tugas & Portofolio Teknik Elektro</p>
          </div>
          <span className="text-xs bg-blue-600/30 border border-blue-400/30 text-blue-200 px-3 py-1 rounded-full">
            Tiara Aulia Tazri
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-4">Tambah Tugas Baru</h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mata Kuliah</label>
                <input
                  type="text"
                  placeholder="Contoh: Elektronika Dasar"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Tugas</label>
                <input
                  type="text"
                  placeholder="Contoh: Laporan Praktikum Dioda"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Upload File Tugas (PDF, Gambar, Dokumen - Maks 3MB)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-slate-200 rounded-lg p-1"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition shadow-sm"
            >
              + Simpan & Upload Tugas
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#0f172a]">
            Daftar Tugas Tersimpan ({tasks.length})
          </h2>

          {tasks.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 text-sm">
              Belum ada tugas yang diupload. Silakan isi form di atas untuk mulai menyimpan tugas!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
                        {task.course}
                      </span>
                      <span className="text-xs text-slate-400">{task.date}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mt-2">{task.title}</h3>
                    {task.fileName && (
                      <p className="text-xs text-slate-500 mt-1 truncate">📎 {task.fileName}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    {task.fileData ? (
                      <a
                        href={task.fileData}
                        download={task.fileName}
                        className="text-xs font-medium text-white bg-[#0f172a] hover:bg-slate-800 px-3 py-1.5 rounded-md transition"
                      >
                        Unduh / Lihat File
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Tanpa lampiran file</span>
                    )}

                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
