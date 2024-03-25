// AdminDashboard.js
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import UserData from './UserData';
import ProductData from './ProductData';
import SalesData from './SalesData';

function AdminDashboard() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/admin/users">Users</Link></li>
            <li><Link to="/admin/products">Products</Link></li>
            <li><Link to="/admin/sales">Sales</Link></li>
          </ul>
        </nav>

        <Switch>
          <Route path="/admin/users">
            <UserData />
          </Route>
          <Route path="/admin/products">
            <ProductData />
          </Route>
          <Route path="/admin/sales">
            <SalesData />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default AdminDashboard;