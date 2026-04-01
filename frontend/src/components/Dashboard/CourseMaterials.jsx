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
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mt-6">
            <div className="flex items-center mb-6">
                <Book className="h-6 w-6 text-indigo-600 mr-2" />
                <h3 className="text-xl font-bold text-gray-900">Study Materials</h3>
            </div>

            {isTeacher && courseId && (
                <form onSubmit={handleUpload} className="mb-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Material Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full rounded-lg border-gray-300 p-2 text-sm focus:ring-indigo-500" placeholder="e.g. Chapter 1 PDF" />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Select File</label>
                        <input type="file" onChange={e => setFile(e.target.files[0])} required className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700" />
                    </div>
                    <button type="submit" disabled={isUploading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
                        <Upload className="h-4 w-4 mr-2" /> {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            )}

            <div className="space-y-3">
                {materials.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No materials uploaded yet.</p>
                ) : (
                    materials.map(mat => (
                        <div key={mat.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors group">
                            <div className="flex items-center">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg mr-4">
                                    <Book className="h-5 w-5" />
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleDownloadMaterial(mat.fileUrl, mat.title)}
                                        className="font-semibold text-gray-900 hover:text-indigo-600 text-sm transition-colors underline-offset-2 hover:underline bg-transparent border-0 cursor-pointer p-0"
                                    >
                                        {mat.title}
                                    </button>
                                    <div className="text-xs text-gray-400 mt-0.5">
                                        {new Date(mat.uploadedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDownloadMaterial(mat.fileUrl, mat.title)} className="p-1.5 text-gray-500 hover:text-indigo-600 bg-white shadow-sm border rounded-md cursor-pointer">
                                    <Download className="h-4 w-4" />
                                </button>
                                {isTeacher && (
                                    <button onClick={() => handleDelete(mat.id)} className="p-1.5 text-gray-500 hover:text-red-600 bg-white shadow-sm border rounded-md">
                                        <Trash2 className="h-4 w-4" />
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
