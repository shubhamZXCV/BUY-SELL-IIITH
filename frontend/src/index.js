import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import SignIn from './Signup';
import Login from './Login';
import Profile from './Profile';
import Feed from './Feed';
import Layout from './layout';
import Product from './Product';
import Cart from './Cart';
import OrderHistory from './OrderHistory';
import Deliver from './Deliver';
import Support from './Support';
import reportWebVitals from './reportWebVitals';
import Write from './Write';
import Review from './Review'

const root = ReactDOM.createRoot(document.getElementById('root'));

// Define routes with Layout
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Wrap all routes with Layout
    children: [
      {
        path: '',
        element: <App />
      },
      {
        path: 'signup',
        element: <SignIn />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path:"feed",
        element:<Feed/>
      },
      {
        path:"product/:productId",
        element:<Product/>
      },
      {
        path:"cart",
        element:<Cart/>
      },
      {
        path:"/orderhistory",
        element:<OrderHistory/>
      },
      {
        path:"/deliver",
        element:<Deliver/>
      },
      {
        path:"/support",
        element:<Support/>
      }
      ,
      {
        path:"/write",
        element:<Write/>
      },
      {
        path:"/review/:receiverEmail",
        element:<Review/>
      }
    ]
  }
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
