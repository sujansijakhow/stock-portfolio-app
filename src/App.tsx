import { PortfolioDashboard } from './components/PortfolioDashboard';
import { ToastContainer } from './components/ToastContainer';

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fbff,#edf2f7_34%,#e2e8f0_100%)] text-slate-800">
      <PortfolioDashboard />
      <ToastContainer />
    </div>
  );
}

export default App;