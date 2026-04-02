import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, Upload, Trash2, Download } from 'lucide-react';

const CourseMaterials = ({ courseId, isTeacher }) => {
    const [materials, setMaterials] = useState([]);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (courseId) fetchMaterials();
    }, [courseId]);

    const fetchMaterials = async () => {
        try {
            const res = await axios.get(`/api/materials/course/${courseId}`);
            setMaterials(res.data);
        } catch (error) {
            console.error("Failed to load materials");
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('courseId', courseId);
        formData.append('title', title);
        formData.append('file', file);

        try {
            await axios.post('/api/materials', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFile(null);
            setTitle('');
            fetchMaterials();
        } catch (error) {
            console.error("Error uploading material", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this material?")) return;
        try {
            await axios.delete(`/api/materials/${id}`);
            fetchMaterials();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handleDownloadMaterial = async (url, title) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadUrl;
            // Extract filename from URL or use the material title
            const fileName = url.substring(url.lastIndexOf('/') + 1) || title;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading material:', error);
            alert('Failed to download material');
        }
    };

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-[2.5rem] p-8 border border-white dark:border-gray-700 shadow-sm mt-8 transition-all duration-300">
            <div className="flex items-center mb-8">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl mr-3">
                    <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Course Materials</h3>
            </div>

            {isTeacher && courseId && (
                <form onSubmit={handleUpload} className="mb-8 p-6 bg-indigo-50/30 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 flex flex-wrap gap-6 items-end animate-fade-in shadow-inner">
                    <div className="flex-1 min-w-[240px]">
                        <label className="block text-xs font-black text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-widest">Material Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-white dark:bg-gray-900 rounded-xl border-gray-200 dark:border-gray-700 p-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all shadow-sm" placeholder="e.g. Lecture Notes - Chapter 1" />
                    </div>
                    <div className="flex-1 min-w-[240px]">
                        <label className="block text-xs font-black text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-widest">Selected File</label>
                        <input type="file" onChange={e => setFile(e.target.files[0])} required className="w-full text-xs text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-all cursor-pointer" />
                    </div>
                    <button type="submit" disabled={isUploading} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isUploading ? <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div> Uploading...</> : <><Upload className="h-4 w-4 mr-2" /> Publish Material</>}
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 gap-4">
                {materials.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
                        <p className="text-gray-400 dark:text-gray-500 text-sm font-medium italic">No materials uploaded yet.</p>
                    </div>
                ) : (
                    materials.map(mat => (
                        <div key={mat.id} className="flex items-center justify-between p-4 bg-white/40 dark:bg-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-700/60 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                                    <Book className="h-5 w-5" />
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleDownloadMaterial(mat.fileUrl, mat.title)}
                                        className="font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors text-left block"
                                    >
                                        {mat.title}
                                    </button>
                                    <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider">
                                        Uploaded on {new Date(mat.uploadedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => handleDownloadMaterial(mat.fileUrl, mat.title)} 
                                    className="p-2.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-md transition-all active:scale-90"
                                    title="Download Material"
                                >
                                    <Download className="h-4 w-4 font-bold" />
                                </button>
                                {isTeacher && (
                                    <button 
                                        onClick={() => handleDelete(mat.id)} 
                                        className="p-2.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-md transition-all active:scale-90"
                                        title="Delete Material"
                                    >
                                        <Trash2 className="h-4 w-4 font-bold" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CourseMaterials;
