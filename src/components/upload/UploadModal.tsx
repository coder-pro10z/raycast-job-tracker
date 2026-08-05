import React, { useState, useRef } from 'react';
import { useJobStore } from '../../state/useJobStore';
import { X, Download, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { uploadExcelFile } = useJobStore();
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'error'; text: string; subText?: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    setResultMessage(null);
    try {
      const result = await uploadExcelFile(file);
      setResultMessage({
        type: 'success',
        text: `Successfully imported and appended ${result.added} new job opportunities!`,
        subText: result.duplicates > 0 ? `${result.duplicates} repeating entries already present in the master tracker were automatically ignored.` : 'All opportunities were new and non-repeating!'
      });
      if (inputRef.current) inputRef.current.value = '';
    } catch (err: any) {
      setResultMessage({
        type: 'error',
        text: 'Failed to process workbook file',
        subText: err.message || 'Please ensure the file is a valid .xlsx or .csv formatted spreadsheet.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '720px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-tertiary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Upload size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Import & Append Job Leads
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Upload custom spreadsheets without creating repeating duplicates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex'
            }}
            className="glow-hover"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div style={{ padding: '24px', overflowY: 'auto' }}>
          {/* Sample Download Prompt */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileSpreadsheet size={28} style={{ color: '#6366f1' }} />
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>
                  Need the Correct Formatting?
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Download our official template with guided sample entries and pre-styled columns.
                </p>
              </div>
            </div>
            <a
              href="/Job_Tracker_Sample_Template.xlsx"
              download="Job_Tracker_Sample_Template.xlsx"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#6366f1',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.8125rem',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'background-color 150ms',
                whiteSpace: 'nowrap'
              }}
              className="glow-hover"
            >
              <Download size={15} />
              <span>Download Template</span>
            </a>
          </div>

          {/* Format Specification Guide */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HelpCircle size={14} /> Expected Column Schema
            </h4>
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              fontSize: '0.8125rem'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <th style={{ padding: '8px 12px' }}>Column Header</th>
                    <th style={{ padding: '8px 12px' }}>Required</th>
                    <th style={{ padding: '8px 12px' }}>Example Values & Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: '#60a5fa' }}>Company Name</td>
                    <td style={{ padding: '8px 12px', color: '#10b981', fontWeight: 700 }}>Yes</td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>e.g. <em>Cloudflare, Stripe, Microsoft</em></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: '#60a5fa' }}>Target Role</td>
                    <td style={{ padding: '8px 12px', color: '#10b981', fontWeight: 700 }}>Yes</td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>e.g. <em>DevOps Engineer, .NET Full Stack Developer</em></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: '#f59e0b' }}>Domain</td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Optional</td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}><em>SDE / FullStack</em> or <em>Cloud / DevOps</em> (auto-classified if blank)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>Location & Work Mode</td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Optional</td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Can be separate or merged: <em>Remote, Bangalore (Hybrid)</em></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>Links & Status</td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Optional</td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}><em>Application Link, Career Page Link, Application Status, Priority</em></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              💡 <strong>Intelligent Deduplication</strong>: If an uploaded job has an identical Company Name and Role to an existing entry in your workspace, it will not repeat. Only genuinely new openings will be appended!
            </p>
          </div>

          {/* Result Banner */}
          {resultMessage && (
            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
              backgroundColor: resultMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${resultMessage.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              {resultMessage.type === 'success' ? (
                <CheckCircle2 size={20} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
              )}
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: resultMessage.type === 'success' ? '#10b981' : '#ef4444', fontSize: '0.875rem' }}>
                  {resultMessage.text}
                </p>
                {resultMessage.subText && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {resultMessage.subText}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${dragActive ? '#3b82f6' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '36px 20px',
              textAlign: 'center',
              backgroundColor: dragActive ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-primary)',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            className="glow-hover"
          >
            <input
              ref={inputRef}
              type="file"
              style={{ display: 'none' }}
              accept=".xlsx,.xls,.csv"
              onChange={handleChange}
            />
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              color: '#60a5fa'
            }}>
              <Upload size={24} style={{ animation: isUploading ? 'bounce 1s infinite' : 'none' }} />
            </div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
              {isUploading ? 'Processing & Appending Spreadsheet...' : 'Click to Browse or Drag & Drop Excel File Here'}
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Supports .xlsx, .xls, and .csv files
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-tertiary)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            className="glow-hover"
          >
            {resultMessage?.type === 'success' ? 'Done & View Jobs' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
