// import React, { useState, useEffect } from 'react';
// import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
// import { Loader2 } from 'lucide-react';
// import axios from 'axios';

// const TrafficVisualizations = () => {
//   const [lstmImage, setLstmImage] = useState(null);
//   const [svmImage, setSvmImage] = useState(null);
//   const [svmHyperplaneImage, setSvmHyperplaneImage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchVisualizations = async () => {
//       try {
//         setLoading(true);
        
//         // Using axios for concurrent requests
//         const [lstmResponse, svmResponse, hyperplaneResponse] = await Promise.all([
//           axios.get('http://localhost:5000/visualize/lstm'),
//           axios.get('http://localhost:5000/visualize/svm'),
//           axios.get('http://localhost:5000/visualize/svm-hyperplane')
//         ]);

//         if (lstmResponse.data.status === 'success') {
//           setLstmImage(lstmResponse.data.image);
//         }

//         if (svmResponse.data.status === 'success') {
//           setSvmImage(svmResponse.data.image);
//         }

//         if (hyperplaneResponse.data.status === 'success') {
//           setSvmHyperplaneImage(hyperplaneResponse.data.image);
//         }
//         console.log('lstm',lstmResponse);
//         console.log('svm', svmResponse);
//         console.log('hyperplane', hyperplaneResponse)
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch visualizations');
//         console.error('Error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVisualizations();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-red-500 text-center p-4">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* LSTM Visualization */}
//       <Card>
//           <h4>LSTM Traffic Prediction vs Actual</h4>
//         <CardContent>
//           {lstmImage && (
//             <img 
//               src={`data:image/png;base64,${lstmImage}`} 
//               alt="LSTM Visualization"
//               className="w-full h-auto"
//             />
//           )}
//         </CardContent>
//       </Card>

//       {/* SVM Hyperplane Visualization */}
//       <Card>
//           <h4>SVM Hyperplane with Decision Boundary</h4>
//         <CardContent>
//           {svmHyperplaneImage && (
//             <img 
//               src={`data:image/png;base64,${svmHyperplaneImage}`} 
//               alt="SVM Hyperplane Visualization"
//               className="w-full h-auto"
//             />
//           )}
//         </CardContent>
//       </Card>

//       {/* Original SVM Visualization */}
//       <Card>
//           <h4>SVM Traffic Classification</h4>
//         <CardContent>
//           {svmImage && (
//             <img 
//               src={`data:image/png;base64,${svmImage}`} 
//               alt="SVM Visualization"
//               className="w-full h-auto"
//             />
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default TrafficVisualizations;

import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const TrafficVisualizations = () => {
  const [lstmImage, setLstmImage] = useState(null);
  const [svmImage, setSvmImage] = useState(null);
  const [svmHyperplaneImage, setSvmHyperplaneImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisualizations = async () => {
      try {
        setLoading(true);

        // Using axios for concurrent requests
        const [lstmResponse, svmResponse, hyperplaneResponse] = await Promise.all([
          axios.get('http://localhost:5000/visualize/lstm'),
          axios.get('http://localhost:5000/visualize/svm'),
          axios.get('http://localhost:5000/visualize/svm-hyperplane')
        ]);

        if (lstmResponse.data.status === 'success') {
          setLstmImage(lstmResponse.data.image);
        }

        if (svmResponse.data.status === 'success') {
          setSvmImage(svmResponse.data.image);
        }

        if (hyperplaneResponse.data.status === 'success') {
          setSvmHyperplaneImage(hyperplaneResponse.data.image);
        }
        console.log('lstm', lstmResponse);
        console.log('svm', svmResponse);
        console.log('hyperplane', hyperplaneResponse);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch visualizations');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisualizations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* LSTM Visualization */}
      <Card>
        <Typography variant="h6" gutterBottom style={{ padding: '16px' }}>
          LSTM Traffic Prediction vs Actual
        </Typography>
        <CardContent>
          {lstmImage && (
            <img
              src={`data:image/png;base64,${lstmImage}`}
              alt="LSTM Visualization"
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* SVM Hyperplane Visualization */}
      <Card>
        <Typography variant="h6" gutterBottom style={{ padding: '16px' }}>
          SVM Hyperplane with Decision Boundary
        </Typography>
        <CardContent>
          {svmHyperplaneImage && (
            <img
              src={`data:image/png;base64,${svmHyperplaneImage}`}
              alt="SVM Hyperplane Visualization"
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Original SVM Visualization */}
      <Card>
        <Typography variant="h6" gutterBottom style={{ padding: '16px' }}>
          SVM Traffic Classification
        </Typography>
        <CardContent>
          {svmImage && (
            <img
              src={`data:image/png;base64,${svmImage}`}
              alt="SVM Visualization"
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficVisualizations;
