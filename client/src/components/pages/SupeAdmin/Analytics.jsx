// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { LineChart } from '@mui/x-charts/LineChart';
// import { CircularProgress } from '@mui/material';

// const Analytics = () => {
//   const [userData, setUserData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get('/api/v1/super/all-users');
//         const users = response.data.users;

//         // Group data by createdAt date and count the number of users for each day
//         const formattedData = users.reduce((acc, user) => {
//           const date = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;
//           if (date) {
//             if (!acc[date]) acc[date] = 0;
//             acc[date] += 1; // Increment user count for this date
//           }
//           return acc;
//         }, {});

//         // Convert grouped data into an array for chart consumption
//         const chartData = Object.keys(formattedData).map(date => ({
//           date, // This will be a string in 'MM/DD/YYYY' format or similar
//           count: formattedData[date], // User count for that date
//         }));

//         setUserData(chartData);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Show loader while data is being fetched
//   if (loading) return <CircularProgress />;

//   return (
//     <div className="responsive-container" style={{ maxWidth: '800px', margin: '0 auto' }} data-aos="zoom-in-up">
//       <h2>User Creation Timeline</h2>
//       <LineChart
//         dataset={userData}
//         xAxis={[
//           {
//             id: 'createdAt',
//             dataKey: 'date', 
//             scaleType: 'band', 
//             valueFormatter: (date) => date, 
//             label: 'Date', 
//           },
//         ]}
//         series={[
//           {
//             id: 'Users',
//             label: 'User Signups',
//             dataKey: 'count', 
//             area: true,
//             showMark: true, 
//           },
//         ]}
//         width={800}
//         height={400}
//         margin={{ left: 50, right: 50, top: 20, bottom: 40 }}
//       />
//     </div>
//   );
// };

// export default Analytics;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from '@mui/x-charts/LineChart';
import { CircularProgress } from '@mui/material';

const Analytics = () => {
  const [userData, setUserData] = useState([]);
  const [subscribedData, setSubscribedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const allUsersResponse = await axios.get('/api/v1/super/all-users');
        const allUsers = allUsersResponse.data.users;

        // Fetch subscribed users
        const subscribedUsersResponse = await axios.get('/api/v1/super/subscribed-users');
        const subscribedUsers = subscribedUsersResponse.data.users;

        // Process all users data
        const formattedUserData = allUsers.reduce((acc, user) => {
          const date = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;
          if (date) {
            if (!acc[date]) acc[date] = 0;
            acc[date] += 1;
          }
          return acc;
        }, {});

        const chartUserData = Object.keys(formattedUserData).map(date => ({
          date,
          count: formattedUserData[date],
        }));

        setUserData(chartUserData);

        // Process subscribed users data
        const formattedSubscribedData = subscribedUsers.reduce((acc, user) => {
          const date = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;
          if (date) {
            if (!acc[date]) acc[date] = 0;
            acc[date] += 1;
          }
          return acc;
        }, {});

        const chartSubscribedData = Object.keys(formattedSubscribedData).map(date => ({
          date,
          count: formattedSubscribedData[date],
        }));

        setSubscribedData(chartSubscribedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <div className="responsive-container" style={{ maxWidth: '800px', margin: '0 auto' }} data-aos="zoom-in-up">
      <h2>User Creation Timeline</h2>
      <LineChart
        dataset={[...userData, ...subscribedData]} // Combine both datasets
        xAxis={[{
          id: 'createdAt',
          dataKey: 'date',
          scaleType: 'band',
          valueFormatter: (date) => date,
          label: 'Date',
        }]}
        series={[
          {
            id: 'Users',
            label: 'User Signups',
            dataKey: 'count',
            area: true,
            color: 'green', // Color for all users
            showMark: true,
          },
          {
            id: 'SubscribedUsers',
            label: 'Subscribed User Signups',
            dataKey: 'count',
            area: true,
            color: 'blue', // Color for subscribed users
            showMark: true,
          }
        ]}
        width={800}
        height={400}
        margin={{ left: 50, right: 50, top: 20, bottom: 40 }}
      />
    </div>
  );
};

export default Analytics;
