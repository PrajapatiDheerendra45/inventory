import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from '@mui/x-charts/LineChart';
import { CircularProgress } from '@mui/material';

const RevenueAnalytics = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axios.get('/api/v1/super/revenue');
        const data = response.data.data;

        // Format data for the chart
        const formattedData = data.map(entry => ({
          date: new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          amount: entry.amount,
        }));
          console.log(formattedData)
        // Group by date and sum the amounts
        const groupedData = formattedData.reduce((acc, { date, amount }) => {
          if (!acc[date]) acc[date] = 0;
          acc[date] += amount;
          return acc;
        }, {});

        // Convert grouped data to array
        const chartData = Object.keys(groupedData).map(date => ({
          date,
          amount: groupedData[date],
        }));

        setRevenueData(chartData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <div className="responsive-container" style={{ maxWidth: '800px', margin: '0 auto' }} data-aos="zoom-in-up">
      <h2>Revenue Over Time</h2>
      <LineChart
        dataset={revenueData}
        xAxis={[
          {
            id: 'date',
            dataKey: 'date',
            scaleType: 'band',
            valueFormatter: (date) => date,
            label: 'Date',
          },
        ]}
        series={[
          {
            id: 'Revenue',
            label: 'Revenue',
            dataKey: 'amount',
            area: true,
            showMark: true,
          },
        ]}
        width={800}
        height={400}
        margin={{ left: 50, right: 50, top: 20, bottom: 40 }}
      />
    </div>
  );
};

export default RevenueAnalytics;
