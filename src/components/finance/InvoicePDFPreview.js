import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Alert, Button } from '@mui/material';
import config from '../../config';

const InvoicePDFPreview = () => {
  const { jobId, year, month } = useParams();
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${config.API_BASE_URL}/invoices/job/${jobId}/monthly/pdf?year=${year}&month=${month}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (!response.ok) throw new Error('Failed to fetch PDF');
        const blob = await response.blob();
        setPdfUrl(URL.createObjectURL(blob));
      } catch (err) {
        setError('Failed to load PDF');
      } finally {
        setLoading(false);
      }
    };
    fetchPDF();
    return () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); };
    // eslint-disable-next-line
  }, [jobId, year, month]);

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!pdfUrl) return null;

  return (
    <Box sx={{ height: 600 }}>
      <iframe
        title="Invoice PDF"
        src={pdfUrl}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      />
      <Button
        variant="outlined"
        sx={{ mt: 2 }}
        href={pdfUrl}
        download={`invoice_${jobId}_${year}_${month}.pdf`}
      >
        Download PDF
      </Button>
    </Box>
  );
};

export default InvoicePDFPreview;