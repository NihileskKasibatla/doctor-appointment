import { ArrowBackIos } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function DoctorDetails() {
    const navigate = useNavigate();
    return (
        <Box>
            <IconButton aria-label='back' onClick={() => navigate('/selectDoctor')}>
                <ArrowBackIos />
            </IconButton>
            <Typography variant='h2'>Dr.Name - Details</Typography>
            <Box>
                <Typography variant='h6'>Name - Details</Typography>
                <Typography variant='h6'>Department - Details</Typography>
                <Typography variant='h6'>Center - Details</Typography>
                <Typography variant='h6'>Available Timings</Typography>
                <Box>
                    <Typography variant='h6'>From : </Typography>
                    <Typography variant='h6'>To : </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default DoctorDetails;
