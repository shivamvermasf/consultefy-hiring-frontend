import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, CircularProgress, Alert, Button, Grid } from '@mui/material';
import config from '../../config';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const InvoiceDetailsPage = () => {
  const { jobId, year, month } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState('');
  const [pdfBlob, setPdfBlob] = useState(null);
  const [opportunity, setOpportunity] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const navigate = useNavigate();

  // Fetch invoice JSON
  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(
          `${config.API_BASE_URL}/invoices/job/${jobId}/monthly?year=${year}&month=${month}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch invoice details');
        }

        const data = await response.json();
        console.log('Invoice data received:', data);
        console.log('Summary data:', data.summary);
        console.log('Days present:', data.summary?.presentDays);
        setInvoice(data);

        // Fetch opportunity details
        if (data.job?.opportunity_id) {
          const opportunityResponse = await fetch(
            `${config.API_BASE_URL}/opportunity/${data.job.opportunity_id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            }
          );
          if (opportunityResponse.ok) {
            const opportunityData = await opportunityResponse.json();
            setOpportunity(opportunityData);
          }
        }

        // Fetch candidate details
        if (data.job?.candidate_id) {
          const candidateResponse = await fetch(
            `${config.API_BASE_URL}/candidates/${data.job.candidate_id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            }
          );
          if (candidateResponse.ok) {
            const candidateData = await candidateResponse.json();
            setCandidate(candidateData);
          }
        }
      } catch (err) {
        console.error('Error fetching invoice details:', err);
        setError(err.message || 'Failed to fetch invoice details');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [jobId, year, month]);

  // Fetch PDF as blob and create blob URL
  useEffect(() => {
    const fetchInvoicePDF = async () => {
      setPdfLoading(true);
      setPdfError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(
          `${config.API_BASE_URL}/invoices/job/${jobId}/monthly/pdf?year=${year}&month=${month}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch invoice PDF');
        }

        const blob = await response.blob();
        setPdfBlob(blob);
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error('Error fetching invoice PDF:', err);
        setPdfError(err.message || 'Failed to fetch invoice PDF');
      } finally {
        setPdfLoading(false);
      }
    };

    if (invoice) {
      fetchInvoicePDF();
    }
  }, [jobId, year, month, invoice]);

  const handleDownload = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_${jobId}_${year}_${month}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!invoice) return <Alert severity="info">No invoice found for the selected period</Alert>;

  const { summary = {}, job = {} } = invoice;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Job Details - Full Width */}
      <Paper sx={{ p: 3, mb: 3, width: '100%' }}>
        <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
          Job Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Job Title:</strong> {opportunity?.title || '-'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Candidate:</strong>{' '}
              {candidate ? (
                <Button
                  color="primary"
                  onClick={() => navigate(`/candidates/${candidate.id}`)}
                  sx={{ 
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {candidate.name}
                </Button>
              ) : (
                '-'
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Client Company:</strong> {job?.client_company || '-'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Partner Company:</strong> {job?.partner_company || '-'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Financial Details - Full Width */}
      <Paper sx={{ p: 3, mb: 3, width: '100%' }}>
        <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
          Financial Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Month:</strong> {MONTHS[(summary.month || 1) - 1]} {summary.year}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Present Days:</strong> {summary?.presentDays || 0}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Total Days:</strong> {summary?.totalDays || 0}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Total Hours:</strong> {summary?.totalHours || 0}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Per Day Rate:</strong> ₹{summary?.perDayRate?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '-'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Total Amount:</strong> ₹{summary?.totalSalary?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '-'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* PDF Preview */}
      {pdfUrl && (
        <Paper sx={{ p: 2, width: '100%' }}>
          <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
            Invoice PDF Preview
          </Typography>
          <Box sx={{ height: 600 }}>
            <iframe
              title="Invoice PDF"
              src={pdfUrl}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleDownload}
          >
            Download PDF
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default InvoiceDetailsPage;