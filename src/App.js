import { Route, BrowserRouter,Routes} from 'react-router-dom';
import AdminLoginForm from './AdminLogin/AdminForm';
import './App.css';
import { AdminDashBoard } from './dashboard/AdminDashboard';

function App() {
  return (
    <BrowserRouter >
      <div className="App">
        <Routes >
          <Route path="/admin" element={<AdminLoginForm />} />
          <Route path="/dashboard" element={<AdminDashBoard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
