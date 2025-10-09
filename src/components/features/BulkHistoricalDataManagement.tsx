import React, { useState, useRef } from 'react';
import { 
  Database, 
  Upload, 
  Download, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Eye,
  RotateCcw,
  X,
  Plus,
  FileSpreadsheet,
  FileJson,
  Loader2,
  AlertCircle,
  Info
} from 'lucide-react';

interface HistoricalDataRecord {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: 'CSV' | 'XLSX' | 'JSON';
  uploadedBy: string;
  uploadedAt: string;
  status: 'Processed' | 'Failed' | 'Pending' | 'Processing';
  records: number;
  description?: string;
  errorMessage?: string;
}

interface UploadPreviewData {
  headers: string[];
  rows: any[][];
  totalRows: number;
}

export const BulkHistoricalDataManagement: React.FC = () => {
  const [dataRecords, setDataRecords] = useState<HistoricalDataRecord[]>([
    {
      id: '1',
      fileName: 'user_registration_2023.csv',
      fileSize: '2.4 MB',
      fileType: 'CSV',
      uploadedBy: 'John Smith',
      uploadedAt: '2024-01-15 14:30:00',
      status: 'Processed',
      records: 125000,
      description: 'Complete user registration data for 2023'
    },
    {
      id: '2',
      fileName: 'transaction_history_q4_2023.xlsx',
      fileSize: '1.8 MB',
      fileType: 'XLSX',
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2024-01-14 16:45:00',
      status: 'Processing',
      records: 89000,
      description: 'All transaction records for Q4 2023'
    },
    {
      id: '3',
      fileName: 'group_activity_logs_2023.json',
      fileSize: '3.2 MB',
      fileType: 'JSON',
      uploadedBy: 'Mike Wilson',
      uploadedAt: '2024-01-13 09:15:00',
      status: 'Failed',
      records: 0,
      description: 'All group activities and interactions',
      errorMessage: 'Invalid JSON format detected'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HistoricalDataRecord | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<UploadPreviewData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notifications, setNotifications] = useState<Array<{id: string, type: 'success' | 'error' | 'info', message: string}>>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredRecords = dataRecords.filter(record => {
    const matchesSearch = record.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processed': return <CheckCircle className="w-4 h-4" />;
      case 'Processing': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'CSV': return <FileText className="w-5 h-5 text-green-600" />;
      case 'XLSX': return <FileSpreadsheet className="w-5 h-5 text-blue-600" />;
      case 'JSON': return <FileJson className="w-5 h-5 text-purple-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json'];
    const fileExtension = file.name.split('.').pop()?.toUpperCase();
    
    if (!allowedTypes.includes(file.type) && !['CSV', 'XLSX', 'JSON'].includes(fileExtension || '')) {
      showNotification('error', 'Please upload a CSV, XLSX, or JSON file');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      showNotification('error', 'File size must be less than 50MB');
      return;
    }

    setUploadFile(file);
    previewFileData(file);
  };

  const previewFileData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      let previewData: UploadPreviewData;

      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        const lines = content.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1, 6).map(line => line.split(',').map(cell => cell.trim()));
        previewData = { headers, rows, totalRows: lines.length - 1 };
      } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
        try {
          const jsonData = JSON.parse(content);
          const headers = Object.keys(jsonData[0] || {});
          const rows = jsonData.slice(0, 5).map((item: any) => Object.values(item));
          previewData = { headers, rows, totalRows: jsonData.length };
        } catch (error) {
          showNotification('error', 'Invalid JSON format');
          return;
        }
      } else {
        // For XLSX, we'll show a placeholder
        previewData = {
          headers: ['Column 1', 'Column 2', 'Column 3'],
          rows: [['Sample', 'Data', 'Here']],
          totalRows: 1000
        };
      }

      setUploadPreview(previewData);
    };
    reader.readAsText(file);
  };

  const handleConfirmUpload = async () => {
    if (!uploadFile || !uploadPreview) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newRecord: HistoricalDataRecord = {
        id: Date.now().toString(),
        fileName: uploadFile.name,
        fileSize: `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: uploadFile.name.split('.').pop()?.toUpperCase() as 'CSV' | 'XLSX' | 'JSON',
        uploadedBy: 'Current User',
        uploadedAt: new Date().toLocaleString(),
        status: 'Pending',
        records: uploadPreview.totalRows,
        description: `Uploaded ${uploadPreview.totalRows.toLocaleString()} records`
      };

      setDataRecords(prev => [newRecord, ...prev]);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadPreview(null);
        showNotification('success', 'File uploaded successfully!');
      }, 500);

    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      showNotification('error', 'Upload failed. Please try again.');
    }
  };

  const handleViewDetails = (record: HistoricalDataRecord) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const handleReprocess = async (recordId: string) => {
    setIsProcessing(true);
    showNotification('info', 'Reprocessing data...');

    try {
      // Simulate reprocessing
      await new Promise(resolve => setTimeout(resolve, 2000));

      setDataRecords(prev => prev.map(record => 
        record.id === recordId 
          ? { ...record, status: 'Processed' as const, uploadedAt: new Date().toLocaleString() }
          : record
      ));

      setIsProcessing(false);
      showNotification('success', 'Data reprocessed successfully!');
    } catch (error) {
      setIsProcessing(false);
      showNotification('error', 'Reprocessing failed. Please try again.');
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      return;
    }

    try {
      setDataRecords(prev => prev.filter(record => record.id !== recordId));
      showNotification('success', 'Record deleted successfully!');
    } catch (error) {
      showNotification('error', 'Delete failed. Please try again.');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    showNotification('info', 'Refreshing data...');

    try {
      // Simulate API call to refresh data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update any processing records
      setDataRecords(prev => prev.map(record => 
        record.status === 'Processing' 
          ? { ...record, status: Math.random() > 0.5 ? 'Processed' as const : 'Failed' as const }
          : record
      ));

      setIsRefreshing(false);
      showNotification('success', 'Data refreshed successfully!');
    } catch (error) {
      setIsRefreshing(false);
      showNotification('error', 'Refresh failed. Please try again.');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    showNotification('info', 'Preparing export...');

    try {
      // Simulate export generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create CSV content
      const csvContent = [
        ['File Name', 'File Size', 'File Type', 'Uploaded By', 'Upload Date', 'Status', 'Records'],
        ...dataRecords.map(record => [
          record.fileName,
          record.fileSize,
          record.fileType,
          record.uploadedBy,
          record.uploadedAt,
          record.status,
          record.records.toString()
        ])
      ].map(row => row.join(',')).join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bulk-historical-data-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setIsExporting(false);
      showNotification('success', 'Export completed successfully!');
    } catch (error) {
      setIsExporting(false);
      showNotification('error', 'Export failed. Please try again.');
    }
  };

  const stats = {
    total: dataRecords.length,
    processed: dataRecords.filter(r => r.status === 'Processed').length,
    processing: dataRecords.filter(r => r.status === 'Processing').length,
    failed: dataRecords.filter(r => r.status === 'Failed').length,
    totalRecords: dataRecords.reduce((sum, r) => sum + r.records, 0)
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg flex items-center gap-2 ${
              notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
              notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
              'bg-blue-100 text-blue-800 border border-blue-200'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
             notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
             <Info className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
              Bulk Historical Data Management System
            </h1>
            <p className="text-gray-600" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
              Manage and process large historical data sets for analysis and reporting
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
              style={{ fontFamily: 'Molde Semi Expanded Regular' }}
            >
              {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
              Refresh
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
              style={{ fontFamily: 'Molde Semi Expanded Regular' }}
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#098DCF] text-white rounded-xl hover:bg-[#0F2A75] transition-colors shadow-lg"
              style={{ fontFamily: 'Molde Semi Expanded Bold' }}
            >
              <Plus className="w-5 h-5" />
              Upload New Data
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Moved to top */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-[#098DCF] bg-opacity-10 rounded-xl">
              <Database className="w-6 h-6 text-[#098DCF]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Total Files
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.total}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Processed
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.processed}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Processing
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.processing}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Total Records
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.totalRecords.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                style={{ fontFamily: 'Molde Semi Expanded Regular' }}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
              style={{ fontFamily: 'Molde Semi Expanded Regular' }}
            >
              <option value="All">All Status</option>
              <option value="Processed">Processed</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Records Table */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Records
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(record.fileType)}
                    <div>
                        <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                          {record.fileName}
                        </div>
                        <div className="text-sm text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                          {record.fileSize} • {record.fileType}
                        </div>
                        {record.description && (
                          <div className="text-xs text-gray-400 mt-1">
                            {record.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                      {record.uploadedBy}
                    </div>
                    <div className="text-sm text-gray-500">
                      {record.uploadedAt}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      {record.status}
                    </span>
                    {record.errorMessage && (
                      <div className="text-xs text-red-600 mt-1">
                        {record.errorMessage}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.records.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleViewDetails(record)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReprocess(record.id)}
                        disabled={isProcessing}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Reprocess"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                Upload Historical Data
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!uploadFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                  Choose a file to upload
                </h4>
                <p className="text-gray-500 mb-4" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                  Supported formats: CSV, XLSX, JSON (Max 50MB)
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-[#098DCF] text-white rounded-xl hover:bg-[#0F2A75] transition-colors"
                  style={{ fontFamily: 'Molde Semi Expanded Bold' }}
                >
                  Select File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
            </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                    File Preview
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      {getFileIcon(uploadFile.name.split('.').pop()?.toUpperCase() as any)}
                      <span className="font-medium" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                        {uploadFile.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({(uploadFile.size / (1024 * 1024)).toFixed(1)} MB)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                      {uploadPreview?.totalRows.toLocaleString()} records detected
                    </p>
                  </div>

                  {uploadPreview && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            {uploadPreview.headers.map((header, index) => (
                              <th key={index} className="px-3 py-2 text-left font-medium text-gray-700">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {uploadPreview.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b">
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-3 py-2 text-gray-600">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {uploadPreview.totalRows > 5 && (
                        <p className="text-xs text-gray-500 mt-2">
                          Showing first 5 rows of {uploadPreview.totalRows.toLocaleString()} total records
                        </p>
                      )}
              </div>
                  )}
            </div>

                {isUploading && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Uploading...</span>
                      <span className="text-sm text-gray-500">{uploadProgress}%</span>
          </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#098DCF] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
        </div>
      </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setUploadFile(null);
                      setUploadPreview(null);
                    }}
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
                    style={{ fontFamily: 'Molde Semi Expanded Regular' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmUpload}
                    disabled={isUploading}
                    className="px-6 py-2 bg-[#098DCF] text-white rounded-xl hover:bg-[#0F2A75] disabled:opacity-50"
                    style={{ fontFamily: 'Molde Semi Expanded Bold' }}
                  >
                    {isUploading ? 'Uploading...' : 'Confirm Upload'}
                  </button>
            </div>
            </div>
            )}
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                File Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                    File Name
                  </label>
                  <p className="text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                    {selectedRecord.fileName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                    File Size
                  </label>
                  <p className="text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                    {selectedRecord.fileSize}
              </p>
            </div>
                <div>
                  <label className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                    Uploaded By
                  </label>
                  <p className="text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                    {selectedRecord.uploadedBy}
                  </p>
          </div>
                <div>
                  <label className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                    Upload Date
                  </label>
                  <p className="text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                    {selectedRecord.uploadedAt}
                  </p>
        </div>
                <div>
                  <label className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                    Status
                  </label>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedRecord.status)}`}>
                    {getStatusIcon(selectedRecord.status)}
                    {selectedRecord.status}
                  </span>
            </div>
                <div>
                  <label className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                    Records
                  </label>
                  <p className="text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                    {selectedRecord.records.toLocaleString()}
              </p>
            </div>
          </div>

              {selectedRecord.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                    Description
                  </label>
                  <p className="text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                    {selectedRecord.description}
                  </p>
                </div>
              )}

              {selectedRecord.errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Error Message</span>
                  </div>
                  <p className="text-sm text-red-700 mt-2">{selectedRecord.errorMessage}</p>
        </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
                style={{ fontFamily: 'Molde Semi Expanded Regular' }}
              >
                Close
              </button>
              <button
                onClick={() => handleReprocess(selectedRecord.id)}
                disabled={isProcessing}
                className="px-6 py-2 bg-[#098DCF] text-white rounded-xl hover:bg-[#0F2A75] disabled:opacity-50"
                style={{ fontFamily: 'Molde Semi Expanded Bold' }}
              >
                {isProcessing ? 'Processing...' : 'Reprocess'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};